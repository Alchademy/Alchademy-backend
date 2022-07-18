const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

jest.mock('../lib/services/github.js');

describe('assignments routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('GET /tickets should display all tickets currently available ', async () => {
    const agent = await request.agent(app);
    await agent.get('/github/callback?code=55').redirects(1);
    const res = await agent.get('/tickets').send({});

    expect(res.status).toEqual(200);
    expect(res.body.length).toEqual(4);
  });


  afterAll(() => {
    pool.end();
  });
});
//small change
