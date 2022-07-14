const pool = require('../utils/pool');

module.exports = class User {
  id;
  created_on;
  username;
  email;
  avatar;
  cohort_id;
  role;

  constructor({ id, created_on, username, email, avatar, cohort_id, role }) {
    this.id = id;
    this.created_on = created_on;
    this.username = username;
    this.email = email;
    this.avatar = avatar;
    this.cohort_id = cohort_id;
    this.role = role;
  }

  static async insert({ username, email, avatar, cohort_id, role }) {
    const { rows } = await pool.query(
      'INSERT INTO users (username, email, avatar, cohort_id, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [username, email, avatar, cohort_id, role]
    );

    return new User(rows[0]);
  }

  static async findByUsername(username) {
    const { rows } = await pool.query(
      `SELECT *
      FROM users
      WHERE username=$1`,
      [username]
    );

    if (!rows[0]) return null;

    return new User(rows[0]);
  }
};
