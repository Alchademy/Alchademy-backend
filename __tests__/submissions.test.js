const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Submission = require('../lib/models/Submission');

jest.mock('../lib/services/github.js');

describe('backend submission routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('GET /submissions returns a list of submissions associated with the authenticated user', async () => {
    const agent = await request.agent(app);
    await agent.get('/github/callback?code=55').redirects(1);
    const res = await agent.get('/submissions').send({
      user_id: 10,
    });
    expect(res.status).toEqual(200);
    expect(res.body.length).toEqual(4);
  });
});
