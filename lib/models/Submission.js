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

  static async getAllSubmissions({ user_id }) {
    const { rows } = await pool.query(
      'SELECT * FROM submissions WHERE submission_id = $1',
      [user_id]
    );
    if (!rows[0]) return null;
    return rows.map((row) => new Submission(row));
  }
};
