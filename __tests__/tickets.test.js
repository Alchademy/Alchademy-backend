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
    await agent.get('/github/callback?code=55').redirects(1);
    const res = await agent.get('/tickets');

    expect(res.status).toEqual(200);
    expect(res.body.length).toEqual(4);
  });

  it('GET /tickets/:id should return a single ticket', async () => {
    const agent = await request.agent(app);
    await agent.get('/github/callback?code=55').redirects(1);
    const res = await agent.get('/tickets/1');
    expect(res.status).toBe(200);
    expect(res.body.length).toEqual(2);
  });

  it('POST /ticket should create a single ticket on an assignment', async () => {
    const agent = await request.agent(app);
    await agent.get('/github/callback?code=55').redirects(1);
    const res = await agent.post('/tickets').send({
      title: 'From Scratch: Dont Know Advanced React',
      description: '',
      syllabus_id: 4,
      due_date: 'August 11th 2022',
      total_points: 20,
      status_id: 4 
    });
    expect(res.status).toBe(200);
    expect(res.body.length).toEqual(2);
  });

  afterAll(() => {
    pool.end();
  });
});

