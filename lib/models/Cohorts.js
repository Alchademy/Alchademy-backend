const pool = require('../utils/pool');

module.exports = class Cohort {
  id;
  created_on;
  month;
  year;
  title;

  constructor({ id, created_on, month, year, title }) {
    this.id = id;
    this.created_on = created_on;
    this.month = month;
    this.year = year;
    this.title = title;
  }

  static async getAll() {
    const { rows } = await pool.query('SELECT * FROM cohorts');
    return  rows.map((row) => new Cohort(row));
  }

  static async getCohortById(id) {
    const { rows } = await pool.query('SELECT * FROM cohorts where id = $1', [id]);
    return new Cohort(rows[0]);
  }

  static async create({ month, year, title }) {
    const { rows } = await pool.query(
      `insert into cohorts (month, year, title)
                            values ($1, $2, $3) returning *`,
      [month, year, title]
    );
    return new Cohort(rows[0]);
  }

  static async delete(id) {
    await pool.query('delete from user_to_cohort where cohort_id=$1;', [id]);
    await pool.query('delete from cohort_to_syllabus where cohort_id=$1;', [id]);
    const { rows } = await pool.query(
      'delete from cohorts where id=$1 returning *',
      [id]
    );
    return new Cohort(rows[0]);
  }
};
