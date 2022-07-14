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

  static async getAll(syllabus_id) {
    const { rows } = await pool.query(
      `
    SELECT * 
    FROM assignments 
    WHERE syllabus_id = $1`, 
      [syllabus_id]
    );
    return new Assignment(rows[0]);
  }
};
