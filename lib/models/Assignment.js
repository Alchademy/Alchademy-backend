const pool = require('../utils/pool');

module.exports = class Assignment {
  id;
  title;
  description;
  syllabus_id;
  due_date;
  total_points;
  status_id;
  status;
  grade;
  created_on;
  submission_status;

  constructor({
    id,
    title,
    description,
    syllabus_id,
    due_date,
    total_points,
    status_id,
    status,
    grade,
    created_on,
    template_link,
    example_link,
    submission_status
  }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.syllabus_id = syllabus_id;
    this.due_date = due_date;
    this.total_points = total_points;
    this.status_id = status_id;
    this.status = status;
    this.grade = grade;
    this.created_on = created_on;
    this.template_link = template_link;
    this.example_link = example_link;
    this.submission_status = submission_status;
  }

  static async getAll(id, user_id) {
    const { rows } = await pool.query(
      `SELECT a.*, st.name as status, s.status_id as submission_status
      FROM assignments a
      join status st on st.id = a.status_id
      LEFT JOIN submissions s ON s.assignment_id = a.id and s.user_id = $2
      WHERE syllabus_id = $1
      ORDER BY due_date ASC`,
      [id, user_id]
    );
    return rows.map((row) => new Assignment(row));
  }

  static async getAllAssignmentsWithGradesBySyllabusIdAndUserId(
    syllabus_id,
    user_id
  ) {
    const { rows } = await pool.query(
      `
      SELECT a.*, s.id as submission_id, s.created_on, s.text, s.status_id as submission_status_id, s.assignment_id, s.user_id, s.grade
      FROM assignments a
      LEFT JOIN submissions s ON s.assignment_id = a.id
      AND s.user_id = $2
      AND s.status_id IN (1, 2, 4)
      WHERE a.syllabus_id = $1
      ORDER BY a.due_date ASC
    `,
      [syllabus_id, user_id]
    );
    return rows.map((row) => new Assignment(row));
  }

  static async insert({
    title,
    description,
    syllabus_id,
    due_date,
    total_points,
    status_id,
  }) {
    const { rows } = await pool.query(
      `INSERT INTO assignments
        (title, description, syllabus_id, due_date, total_points, status_id)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [title, description, syllabus_id, due_date, total_points, status_id]
    );
    return new Assignment(rows[0]);
  }

  static async getByID(id) {
    const { rows } = await pool.query(
      `SELECT a.*, s.name as status
      FROM assignments a
      join status s on a.status_id = s.id
      WHERE a.id = $1`,
      [id]
    );
    if (!rows.length) return null;
    return new Assignment(rows[0]);
  }

  static async update(id, attrs) {
    const assignment = await Assignment.getByID(id);
    if (!assignment) return null;
    const {
      title,
      description,
      syllabus_id,
      due_date,
      total_points,
      status_id,
    } = { ...assignment, ...attrs };
    const { rows } = await pool.query(
      `UPDATE assignments
        SET title=$2, description=$3, syllabus_id=$4, due_date=$5, total_points=$6, status_id=$7
        WHERE id=$1 RETURNING *`,
      [id, title, description, syllabus_id, due_date, total_points, status_id]
    );
    return new Assignment(rows[0]);
  }

  static async delete(id) {
    await pool.query('DELETE FROM submissions WHERE assignment_id=$1', [id]);
    const { rows } = await pool.query(
      'DELETE FROM assignments WHERE id=$1 RETURNING *',
      [id]
    );
    return new Assignment(rows[0]);
  }

  static async getByUserID(userId) {
    const { rows } = await pool.query(
      `select asgn.id, asgn.title, u.username
    from users u
    left join user_to_cohort utc on utc.user_id = u.id
    left join cohorts c on utc.cohort_id = c.id
    left join cohort_to_syllabus cts on cts.cohort_id = c.id
    join syllabus s on s.id = cts.syllabus_id
    join assignments asgn on asgn.syllabus_id = s.id
    and u.id = $1`,
      [userId]
    );
    return rows.map((row) => new Assignment(row));
  }
};
