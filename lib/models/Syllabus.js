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
  created_by_name;

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
    created_by_name
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
    this.created_by_name = created_by_name;
  }

  static async getAll() {
    const { rows } = await pool.query('SELECT * FROM syllabus');
    return  rows.map((row) => new Syllabus(row));
  }

  static async getById(id) {
    const { rows } = await pool.query('select * from syllabus where id = $1', [id]);
    return new Syllabus(rows[0]);
  }

  static async getByUser(id) {
    const { rows } = await pool.query(
      `select s.*
    from users u
    left join user_to_cohort utc on utc.user_id = u.id
    left join cohorts c on utc.cohort_id = c.id
    left join cohort_to_syllabus cts on cts.cohort_id = c.id
    join syllabus s on s.id = cts.syllabus_id
    where u.id = $1`,
      [id]
    );
    const createdByArray = [];
    for (const row of rows) {
      const syllabusCreator = await pool.query(
        `select u.username as created_by_name
      from users u
      join syllabus s on s.created_by = u.id
      WHERE s.id = $1`,
        [row.id]
      );
      createdByArray.push(syllabusCreator.rows[0]);
    }
    return rows.map((row, i) => new Syllabus({ ...row, ...createdByArray[i] }));
  }

  static async create({ title, thumbnail_photo, created_by, owner_id, description, status_id }) {
    const { rows } = await pool.query(
      `insert into syllabus (title, thumbnail_photo, created_by, owner_id, description, status_id)
                            values ($1, $2, $3, $4, $5, $6) returning *`,
      [title, thumbnail_photo, created_by, owner_id, description, status_id]
    );
    return new Syllabus(rows[0]);
  }

  static async delete(id) {
    await pool.query('delete from assignments where syllabus_id=$1', [id]);
    await pool.query('delete from cohort_to_syllabus where syllabus_id=$1', [id]);
    const { rows } = await pool.query('delete from syllabus where id=$1 returning *', [id]);
    return new Syllabus(rows[0]);
  }

  static async updateById(id, attrs){
    const syllabus = await Syllabus.getById(id);
    if(!syllabus) return null;
    const { title, thumbnail_photo, created_by, owner_id, description, status_id } = { ...syllabus, ...attrs };
    const { rows } = await pool.query(
      `UPDATE syllabus 
        SET title=$2, thumbnail_photo=$3, created_by=$4, owner_id=$5, description=$6, status_id=$7 
        WHERE id=$1 RETURNING *`, 
      [id, title, thumbnail_photo, created_by, owner_id, description, status_id]);
    return new Syllabus(rows[0]);
  }
};
