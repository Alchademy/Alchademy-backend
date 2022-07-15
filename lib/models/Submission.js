const pool = require('../utils/pool');

module.exports = class Submission {
  id;
  text;
  created_on;
  status_id;
  assignment_id;
  user_id;

  constructor({
    id,
    text,
    created_on,
    status_id,
    assignment_id,
    user_id,
    grade,
  }) {
    this.id = id;
    this.text = text;
    this.created_on = created_on;
    this.status_id = status_id;
    this.assignment_id = assignment_id;
    this.user_id = user_id;
    this.grade = grade;
  }
  // maybe add getAllSub for admin
  static async getAllSubmissionsByUserId({ user_id }) {
    const { rows } = await pool.query(
      'SELECT * FROM submissions WHERE user_id = $1',
      [user_id]
    );

    return rows.map((row) => new Submission(row));
  }

  static async getSubmissionById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM submissions WHERE id = $1',
      [id]
    );
    if (!rows.length) return null;
    return new Submission(rows[0]);
  }

  static async addSubmission({
    text,
    status_id,
    assignment_id,
    user_id,
    grade,
  }) {
    const { rows } = await pool.query(
      `INSERT INTO submissions (text,
				status_id,
				assignment_id,
				user_id,
				grade) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [text, status_id, assignment_id, user_id, grade]
    );
    return new Submission(rows[0]);
  }
};
