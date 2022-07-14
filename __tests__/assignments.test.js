const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

jest.mock('../lib/services/github.js');

describe('github routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('GET /assignments should display all assignments for a syllabus', async () => {
    const agent = await request.agent(app);
    await agent.get('/github/callback?code=55').redirects(1);
    const res = await agent.get('/assignments');

    expect(res.status).toEqual(200);
    expect(res.body.length).toEqual(1);
  });

  

  afterAll(() => {
    pool.end();
  });
});