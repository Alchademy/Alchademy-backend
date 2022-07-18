const pool = require('../utils/pool');

module.exports = class Tickets {
  id;
  created_on;
  text;
  user_id;
  assignment_id;
  status_id;
  ta_id;

  constructor({
    id,
    created_on,
    text,
    user_id,
    assignment_id,
    status_id,
    ta_id,
  }) {
    this.id = id;
    this.created_on = created_on;
    this.text = text;
    this.user_id = user_id;
    this.assignment_id = assignment_id;
    this.status_id = status_id;
    this.ta_id = ta_id;
  }

  static async getAllCurrent(ta_id) {
    const { rows } = await pool.query(
      `SELECT *
      FROM tickets
      WHERE ta_id = $1
      AND status_id IN (1, 2)`,
      [ta_id]
    );
    return rows.map((row) => new Tickets(row));
  }

  static async getUserTicket(user_id) {
    const { rows } = await pool.query(
      `SELECT *
      FROM tickets
      WHERE user_id = $1`,
      [user_id]
    );
    return rows.map((row) => new Tickets(row));
  }

  static async insert({ text, status_id, assignment_id, ta_id, user_id }){
    const { rows } = await pool.query(
      `INSERT INTO tickets (text, status_id, assignment_id, ta_id, user_id) 
        VALUES ($1, $2, $3, $4, $5) RETURNING *`
      , [text, status_id, assignment_id, ta_id, user_id]);
    return new Tickets(rows[0]);
  } 
}
;
