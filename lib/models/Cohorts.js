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
};
