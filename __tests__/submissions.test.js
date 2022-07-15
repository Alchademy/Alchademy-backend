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

  it('GET /submissions/:id returns a single submission associated with the authenticated user', async () => {
    // login user
    const agent = await request.agent(app);
    await agent.get('/github/callback?code=55').redirects(1);
    // send id of submission and id of who that submission belongs to
    const res = await agent.get('/submissions/1').send({
      id: 1,
      user_id: 10,
    });
    expect(res.status).toEqual(200);
    // this is the text of beau's (user_id = 10) first submission (id: 1)
    expect(res.body.text).toEqual('Beau Submission for Soccer Score Keeper');
  });

  it('POST /submissions should create a new submission', async () => {
    const agent = await request.agent(app);
    await agent.get('/github/callback?code=55').redirects(1);
    const res = await agent.post('/submissions').send({
      text: 'Delaney Submission for Goblin Fighter',
      status_id: 1,
      assignment_id: 4,
      user_id: 8,
      grade: 20,
    });
    expect(res.status).toEqual(200);
    expect(res.body).toEqual({
      id: expect.any(String),
      created_on: expect.any(String),
      text: 'Delaney Submission for Goblin Fighter',
      status_id: 1,
      assignment_id: 4,
      user_id: 8,
      grade: 20,
    });
  });

  it('PUT /submissions/id should update a submission', async () => {
    const agent = await request.agent(app);
    await agent.get('/github/callback?code=55').redirects(1);
    const res = await agent.put('/submissions/1').send({
      grade: 7,
    });
    expect(res.status).toEqual(200);
    expect(res.body).toEqual({
      id: expect.any(String),
      created_on: expect.any(String),
      text: 'Beau Submission for Soccer Score Keeper',
      status_id: 4,
      assignment_id: 1,
      user_id: 10,
      grade: 7,
    });
  });

  it('DELETE /submissions/:id should delete a single submission', async () => {
    const agent = await request.agent(app);
    await agent.get('/github/callback?code=55').redirects(1);
    await agent.delete('/submissions/2');
    const res = await agent.get('/submissions/2');
    expect(res.status).toEqual(200);
    expect(res.body).toEqual(null);
  });

  afterAll(() => {
    pool.end();
  });
});
