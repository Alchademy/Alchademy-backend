const pool = require('../utils/pool');

module.exports = class User {
  id;
  created_on;
  username;
  email;
  avatar;
  role;

  constructor({ id, created_on, username, email, avatar, role }) {
    this.id = id;
    this.created_on = created_on;
    this.username = username;
    this.email = email;
    this.avatar = avatar;
    this.role = role;
  }

  static async insert({ username, email, avatar, role }) {
    const { rows } = await pool.query(
      'INSERT INTO users (username, email, avatar, role) VALUES ($1, $2, $3, $4) RETURNING *',
      [username, email, avatar, role]
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

  static async updateByID(id, attrs){
    const user = await User.getByID(id);
    if(!user) return null;
    const { username, email, avatar, role } = { ...user, ...attrs };
    const { rows } = await pool.query(
      `UPDATE users 
      SET username=$2, email=$3, avatar=$4, role=$5 
      WHERE id=$1 RETURNING *`, 
      [id, username, email, avatar, role]
    );
    return new User(rows[0]);
  }

  static async addUserCohort(user, cohortTitle) {
    // grab user by username
    // check if the cohort exists
    let cohort = await pool.query(
      `SELECT * 
      FROM cohorts 
      WHERE title=$1`,
      [cohortTitle]
    );
    // if it doesnt exist, add it to the cohorts table
    if (!cohort.rows.length) {
      cohort = await pool.query(
        `INSERT INTO cohorts (title)
        VALUES $1
        RETURNING *`,
        [cohortTitle]
      );
    }
    // add foreign relation to user_to_cohort table
    await pool.query(
      `INSERT INTO user_to_cohort (cohort_id, user_id)
      VALUES ($1, $2)`,
      [cohort.rows[0].id, user.id]
    );
  }
};
