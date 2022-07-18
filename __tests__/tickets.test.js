const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

jest.mock('../lib/services/github.js');

describe('assignments routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('GET /tickets should display all tickets currently available', async () => {
    const agent = await request.agent(app);
    const user = await agent.get('/github/callback?code=55').redirects(1);
    await agent.post('/tickets').send({
      text: 'wow that was painful',
      status_id: 1,
      assignment_id: 4,
      ta_id: user.body.id, 
      user_id: user.body.id
    });
    const res = await agent.get('/tickets');

    expect(res.status).toEqual(200);
    expect(res.body.length).toEqual(1);
  });

  it('GET /tickets/:id should return a single ticket', async () => {
    const agent = await request.agent(app);
    const user = await agent.get('/github/callback?code=55').redirects(1);
    await agent.post('/tickets').send({
      text: 'wow that was painful',
      status_id: 1,
      assignment_id: 4,
      ta_id: 5, 
      user_id: user.body.id
    });
    const res = await agent.get('/tickets/1');
    expect(res.status).toBe(200);
    expect(res.body.length).toEqual(1);
  });

  it('POST /ticket should create a single ticket on an assignment', async () => {
    const agent = await request.agent(app);
    const user = await agent.get('/github/callback?code=55').redirects(1);
    const res = await agent.post('/tickets').send({
      text: 'wow that was painful',
      status_id: 1,
      assignment_id: 4,
      ta_id: 5, 
      user_id: user.body.id
    });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: expect.any(String),
      created_on: expect.any(String),
      text: 'wow that was painful',
      status_id: 1,
      assignment_id: 4,
      ta_id: 5, 
      user_id: Number(user.body.id)
    });
  });

  afterAll(() => {
    pool.end();
  });
});

