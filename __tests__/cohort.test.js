const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

jest.mock('../lib/services/github.js');

describe('github routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('GET /cohorts gets all cohorts', async () => {
    const agent = await request.agent(app);
    await agent.get('/github/callback?code=55').redirects(1);
    const res = await agent.get('/cohorts');

    expect(res.status).toEqual(200);
    expect(res.body.length).toEqual(2);
  });

  it('GET /cohorts/:id gets a single cohort by id', async () => {
    const agent = await request.agent(app);
    await agent.get('/github/callback?code=55').redirects(1);
    const res = await agent.get('/cohorts/1');

    expect(res.status).toEqual(200);
    expect(res.body.title).toEqual('february-2022');
  });

  it.skip('POST /cohorts creates a new cohort', async () => {
    const agent = await request.agent(app);
    await agent.get('/github/callback?code=55').redirects(1);
    const res = await agent.post('/cohorts').send();

    expect(res.status).toEqual(200);
    expect(res.body.title).toEqual('february-2022');
  });

  afterAll(() => {
    pool.end();
  });
});







