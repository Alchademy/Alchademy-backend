const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Submission = require('../lib/models/Submission');

describe('backend submission routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('GET /submissions returns a list of submissions associated with the authenticated user', async () => {
    const res = await request(app).get('/submissions');
    const allSubmissions = await Submission.getAllSubmissions();
    const expected = allSubmissions.map((submission) => {
      return {
        id: submission.id,
        created_on: submission.created_on,
        status_id: submission.status_id,
        assignment_id: submission.assignment_id,
        user_id: submission.user_id,
      };
    });
    expect(res.body).toEqual(expected);
  });

  it('/submissions/:id returns a single submission', async () => {
    const res = await request(app).get('/submissions/3');
    const juliet = {
      id: '11',
      name: 'Juliet',
      gender: 'Female',
      relationship: 'Aunt',
      age: 38,
    };
    expect(res.body).toEqual(juliet);
  });
});
