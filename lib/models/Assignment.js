const pool = require('../utils/pool');

module.exports = class Assignment {
  id; 
  title; 
  description;
  syllabus_id;
  due_date;
  total_points;
  status_id;

  constructor({ title, description, syllabus_id, due_date, total_points, status_id }){
    this.title = title;
    this.description = description;
    this.syllabus_id = syllabus_id;
    this.due_date = due_date; 
    this.total_points = total_points;
    this.status_id = status_id;
  }

  static async getAll({ id }) {
    const { rows } = await pool.query(
      `
    SELECT * 
    FROM assignments 
    WHERE syllabus_id = $1`, 
      [id]
    );
    return rows.map(row => new Assignment(row)) ;
  }

  static async insert({ title, description, syllabus_id, due_date, total_points, status_id }){
    const { rows } = await pool.query(
      `INSERT INTO assignments 
        (title, description, syllabus_id, due_date, total_points, status_id) 
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, 
      [title, description, syllabus_id, due_date, total_points, status_id]
    );
    return new Assignment(rows[0]);
  }

  static async getByID(id){
    const { rows } = await pool.query(
      'SELECT * FROM assignments WHERE id=$1', 
      [id]
    );
    if(!rows.length) return null;
    return new Assignment(rows[0]);
  }

  static async update(id, attrs){
    const assignment = await Assignment.getByID(id);
    if(!assignment) return null;
    const { title, description, syllabus_id, due_date, total_points, status_id } = { ...assignment, ...attrs };
    const { rows } = await pool.query(
      `UPDATE assignments 
        SET title=$2, description=$3, syllabus=$4, due_date=$5, total_points=$6, status_id=$7 
        WHERE id=$1 RETURNING *`, 
      [id, title, description, syllabus_id, due_date, total_points, status_id]);
    return new Assignment(rows[0]);
  }
};
