const pool = require('../utils/pool');
const Syllabus = require('./Syllabus');

module.exports = class Cohort {
  id;
  created_on;
  month;
  year;
  title;

  constructor({ id, created_on, month, year, title }) {
    this.id = id;
    this.created_on = created_on;
    this.month = month;
    this.year = year;
    this.title = title;
  }
  //admin and teacher feature
  static async getAll() {
    const { rows } = await pool.query('SELECT * FROM cohorts');
    return  rows.map((row) => new Cohort(row));
  }
  //all, but authorize based on user access
  static async getCohortById(id) {
    const { rows } = await pool.query('SELECT * FROM cohorts where id = $1', [id]);
    return new Cohort(rows[0]);
  }
  //admin and teacher feature
  static async create({ month, year, title }) {
    const { rows } = await pool.query(
      `insert into cohorts (month, year, title)
                            values ($1, $2, $3) returning *`,
      [month, year, title]
    );
    return new Cohort(rows[0]);
  }

  //admin and teacher function
  static async delete(id) {
    //had to delete dependent records in the user to cohort and cohort to syllabus tables
    //dependency on the join tables needs to be removed prior to removing the cohort record
    await pool.query('delete from user_to_cohort where cohort_id=$1;', [id]);
    await pool.query('delete from cohort_to_syllabus where cohort_id=$1;', [id]);
    const { rows } = await pool.query(
      'delete from cohorts where id=$1 returning *',
      [id]
    );
    return new Cohort(rows[0]);
  }

  //TA, Teachers, Admins
  static async updateById(id, attrs) {
    const updatedCohort = await Cohort.getCohortById(id);
    if (!updatedCohort) return null;

    const { month, year, title } = {
      ...updatedCohort,
      ...attrs,
    };
    const { rows } = await pool.query(
      `update cohorts 
      set month=$1, year=$2, title=$3
      where id=$4
      returning *`,
      [month, year, title, id]
    );
    return new Cohort(rows[0]);
  }

  //Admins and Teachers, maybe TAs
  //adding function for adding an available syllabus for a cohort
  static async addSyllabusForCohort(syllabusId, cohortId) {
    //running check to make sure that the syllabus and cohort record exist that were provided
    const cohortRecord = await Cohort.getCohortById(cohortId);
    if (!cohortRecord) return null;

    const syllabusRecord = await Syllabus.getById(syllabusId);
    if (!syllabusRecord) return null;

    const { rows } = await pool.query(
      `insert into cohort_to_syllabus (syllabusId, cohortId)
                            values ($1, $2) returning *`,
      [syllabusId, cohortId]
    );
    return new Cohort(rows[0]);
  }
};
