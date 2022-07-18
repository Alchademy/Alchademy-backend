const pool = require('../utils/pool');

module.exports = class Comment {
  id;
  created_on;
  text;
  user_id;
  target_entity;
  target_entity_id;
  status_id;

  constructor({
    id,
    created_on,
    text,
    user_id,
    target_entity,
    target_entity_id,
    status_id,
  }) {
    this.id = id;
    this.created_on = created_on;
    this.text = text;
    this.user_id = user_id;
    this.target_entity = target_entity;
    this.target_entity_id = target_entity_id;
    this.status_id = status_id;
  }

  static async getAllCommentsPerRecord(target_entity_id, target_entity) {
    const { rows } = await pool.query(
      `SELECT * 
      FROM comments
      WHERE target_entity = $1 
      AND target_entity_id = $2`,
      [target_entity, target_entity_id]
    );

    return rows.map((row) => new Comment(row));
  }

  static async getSingleComment(id) {
    const { rows } = await pool.query(
      `SELECT * 
      FROM comments
      WHERE id = $1`,
      [id]
    );
    if (!rows.length) return null;
    return new Comment(rows[0]);
  }

  static async create({
    text,
    user_id,
    target_entity,
    target_entity_id,
    status_id,
  }) {
    const { rows } = await pool.query(
      `INSERT INTO comments (
        text,
        user_id,
        target_entity,
        target_entity_id,
        status_id
				) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *`,
      [text, user_id, target_entity, target_entity_id, status_id]
    );

    return new Comment(rows[0]);
  }

  static async delete(id) {
    const { rows } = await pool.query(
      `DELETE FROM comments 
      WHERE id=$1 
      RETURNING *`,
      [id]
    );
    return new Comment(rows[0]);
  }
};
