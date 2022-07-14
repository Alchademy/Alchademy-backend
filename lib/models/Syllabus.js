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
    return new Syllabus(rows[0]);
  }
};
