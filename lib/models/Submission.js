const pool = require('../utils/pool');

module.exports = class Submission {
  id;
  text;
  created_on;
  status_id;
  assignment_id;
  user_id;
  repo_link;
  title;
  due_date;
  total_points;
  username;

  constructor({
    id,
    text,
    created_on,
    status_id,
    assignment_id,
    user_id,
    grade,
    repo_link,
    title,
    due_date,
    total_points,
    username
  }) {
    this.id = id;
    this.text = text;
    this.created_on = created_on;
    this.status_id = status_id;
    this.assignment_id = assignment_id;
    this.user_id = user_id;
    this.grade = grade;
    this.repo_link = repo_link;
    this.title = title;
    this.due_date = due_date;
    this.total_points = total_points;
    this.username = username;
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
      'SELECT * FROM submissions WHERE user_id = $1 AND assignment_id = $2 order by id desc',
      [user_id, assignment_id]
    );

    return rows.map((row) => new Submission(row));
  }

  static async getSubmissionById(id) {
    const { rows } = await pool.query(
      'SELECT s.*, u.username FROM submissions s join users u on s.user_id = u.id WHERE s.id = $1',
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
    repo_link
  }) {
    await pool.query('update submissions set status_id = 3 where assignment_id = $1 and user_id = $2', [assignment_id, user_id]);
    const { rows } = await pool.query(
      `INSERT INTO submissions (text,
				status_id,
				assignment_id,
				user_id,
				grade,
        repo_link) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [text, status_id, assignment_id, user_id, grade, repo_link]
    );
    return new Submission(rows[0]);
  }

  //passing in a grade and updating status
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

  static async getAllSubmissionsByTAId() {
    const { rows } = await pool.query(`SELECT s.*, a.title, a.total_points, a.due_date, u.username
    FROM submissions s 
    join assignments a on a.id = s.assignment_id
    join users u on u.id = s.user_id`);

    return rows.map((row) => new Submission(row));
  }
};
