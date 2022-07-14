const pool = require('../utils/pool');

module.exports = class Submission {
  id;
  created_on;
  status_id;
  assignment_id;
  user_id;

  constructor({ id, created_on, status_id, assignment_id, user_id }) {
    this.id = id;
    this.created_on = created_on;
    this.status_id = status_id;
    this.assignment_id = assignment_id;
    this.user_id = user_id;
  }

  static async getAllSubmissions() {
    const { rows } = await pool.query('SELECT * FROM submissions');
    return new Submission(rows[0]);
  }
};
