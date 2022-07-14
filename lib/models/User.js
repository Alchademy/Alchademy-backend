const pool = require('../utils/pool');

module.exports = class User {
  id;
  created_on;
  username;
  email;
  #password_hash;
  avatar;
  cohort_id;
  role;

  constructor({
    id,
    created_on,
    username,
    email,
    password_hash,
    avatar,
    cohort_id,
    role,
  }) {
    this.id = id;
    this.created_on = created_on;
    this.username = username;
    this.email = email;
    this.#password_hash = password_hash;
    this.avatar = avatar;
    this.cohort_id = cohort_id;
    this.role = role;
  }

  static async insert({ username, email, password_hash, avatar, cohort_id }) {
    const { rows } = await pool.query(
      'INSERT INTO users (username, email, password_hash, avatar, cohort_id, role) VALUES ($1, $2, $3, $4, $5, 1) RETURNING *',
      [username, email, password_hash, avatar, cohort_id]
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
