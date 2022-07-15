const pool = require('../utils/pool');

module.exports = class Syllabus {
  id;
  title;
  created_on;
  thumbnail_photo;
  created_by;
  owner_id;
  description;
  status_id;
  cohort_id;

  constructor({
    id,
    title,
    created_on,
    thumbnail_photo,
    created_by,
    owner_id,
    description,
    status_id,
    cohort_id,
  }) {
    this.id = id;
    this.title = title;
    this.created_on = created_on;
    this.thumbnail_photo = thumbnail_photo;
    this.created_by = created_by;
    this.owner_id = owner_id;
    this.description = description;
    this.status_id = status_id;
    this.cohort_id = cohort_id;
  }

  static async getAll() {
    const { rows } = await pool.query('SELECT * FROM syllabus');
    return  rows.map((row) => new Syllabus(row));
  }

  static async getByUser(id) {
    const { rows } = await pool.query(`select s.*
    from users u
    left join user_to_cohort utc on utc.user_id = u.id
    left join cohorts c on utc.cohort_id = c.id
    left join cohort_to_syllabus cts on cts.cohort_id = c.id
    join syllabus s on s.id = cts.syllabus_id
    where u.id = $1`, [id]);
    return rows.map((row) => new Syllabus(row));
  }

  static async create({ title, thumbnail_photo, created_by, owner_id, description, status_id }) {
    const { rows } = await pool.query(
      `insert into syllabus (title, thumbnail_photo, created_by, owner_id, description, status_id)
                            values ($1, $2, $3, $4, $5, $6) returning *`,
      [title, thumbnail_photo, created_by, owner_id, description, status_id]
    );
    return new Syllabus(rows[0]);
  }
};
