const pool = require('../utils/pool');

module.exports = class Submission {
  id;
  text;
  created_on;
  status_id;
  assignment_id;
  user_id;
  repo_link;

  constructor({
    id,
    text,
    created_on,
    status_id,
    assignment_id,
    user_id,
    grade,
    repo_link
  }) {
    this.id = id;
    this.text = text;
    this.created_on = created_on;
    this.status_id = status_id;
    this.assignment_id = assignment_id;
    this.user_id = user_id;
    this.grade = grade;
    this.repo_link = repo_link;
  }
  // maybe add getAllSubmissions for admin
  static async getAllSubmissionsByUserId(user_id) {
    const { rows } = await pool.query(
      'SELECT * FROM submissions WHERE user_id = $1',
      [user_id]
    );

    return rows.map((row) => new Submission(row));
  }

  static async getAllSubmissionsByUserAndAssignment(user_id, assignment_id) {
    const { rows } = await pool.query(
      'SELECT * FROM submissions WHERE user_id = $1 AND assignment_id = $2',
      [user_id, assignment_id]
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

  static async updateSubmission(id, attrs) {
    const submission = await Submission.getSubmissionById(id);
    if (!submission) return null;
    const { text, status_id, assignment_id, user_id, grade } = {
      ...submission,
      ...attrs,
    };
    const { rows } = await pool.query(
      'UPDATE submissions SET text=$2, status_id=$3, assignment_id=$4, user_id=$5, grade=$6 WHERE id=$1 RETURNING *',
      [id, text, status_id, assignment_id, user_id, grade]
    );
    return new Submission(rows[0]);
  }

  static async deleteSubmissionById(id) {
    const { rows } = await pool.query(
      'DELETE FROM submissions WHERE id=$1 RETURNING *',
      [id]
    );
    return new Submission(rows[0]);
  }
};
