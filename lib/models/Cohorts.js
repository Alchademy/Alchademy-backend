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
    const { rows } = await pool.query('SELECT * FROM syllabus');
    return new Syllabus(rows[0]);
  }

  static async getByUser(id) {
    const { rows } = await pool.query('SELECT * FROM users ');
  }
};
