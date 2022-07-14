const pool = require('../utils/pool');

module.exports = class User {
  id;
  created_on;
  username;
  email;
  #passwordHash;
  avatar;

  constructor({ id, created_on, username, email, passwordHash, avatar }) {
    this.id = id;
    this.created_on = created_on;
    this.username = username;
    this.email = email;
    (this.#passwordHash = passwordHash), (this.avatar = avatar);
  }

  static async insert({ username, email, passwordHash, avatar }) {
    const { rows } = pool.query(
      'INSERT INTO users (username, email, passwordHash, avatar) WHERE ($1, $2, $3, $4) RETURNING *',
      [username, email, passwordHash, avatar]
    );
    return rows.map((row) => new User(row[0]));
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
