const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

jest.mock('../lib/services/github.js');

describe('backend submission routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('GET /submissions returns a list of submissions associated with the authenticated user', async () => {
    const agent = await request.agent(app);
    await agent.get('/github/callback?code=55');
    const user = await agent.get('/github/dashboard');
    await agent.post('/submissions').send({
      text: 'Delaney Submission for Goblin Fighter',
      status_id: 1,
      assignment_id: 4,
      user_id: user.body.id,
      grade: 20,
    });
    const res = await agent.get('/submissions');
    expect(res.status).toEqual(200);
    expect(res.body.length).toEqual(1);
  });

  it('GET /submissions/:id returns a single submission associated with the authenticated user', async () => {
    // login user
    const agent = await request.agent(app);
    await agent.get('/github/callback?code=55');
    const user = await agent.get('/github/dashboard');
    await agent.post('/submissions').send({
      text: 'Delaney Submission for Goblin Fighter',
      status_id: 1,
      assignment_id: 4,
      user_id: String(user.body.id),
      grade: 20,
    });
    // send id of submission and id of who that submission belongs to
    const res = await agent.get('/submissions/5');
    expect(res.status).toEqual(200);
    // this is the text of beau's (user_id = 10) first submission (id: 1)
    expect(res.body.text).toEqual('Delaney Submission for Goblin Fighter');
  });

  it('GET /submissions/assignment/:id returns all submissions for a specific assignment for a user', async () => {
    // login user
    const agent = await request.agent(app);
    await agent.get('/github/callback?code=55');
    const user = await agent.get('/github/dashboard');
    await agent.post('/submissions').send({
      text: 'Delaney Submission for Goblin Fighter',
      status_id: 1,
      assignment_id: 4,
      user_id: String(user.body.id),
      grade: 20,
    });
    await agent.post('/submissions').send({
      text: 'Delaney 2nd Submission for Goblin Fighter',
      status_id: 1,
      assignment_id: 4,
      user_id: String(user.body.id),
      grade: 20,
    });
    await agent.post('/submissions').send({
      text: 'Delaney 3rd Submission for Goblin Fighter',
      status_id: 1,
      assignment_id: 4,
      user_id: String(user.body.id),
      grade: 20,
    });
    const res = await agent.get('/submissions/assignment/4');
    // this is the text of beau's (user_id = 10) first submission (id: 1)
    expect(res.status).toEqual(200);
    expect(res.body.length).toEqual(3);
  });

  it('GET /submissions/ta returns all submissions if the user is a ta', async () => {
    const agent = await request.agent(app);
    await agent.get('/github/callback?code=55');
    const res = await agent.get('/submissions/ta');
    expect(res.status).toEqual(200);
    // there are 4 seeded submissions
    expect(res.body.length).toEqual(4);
  });

  it('POST /submissions should create a new submission', async () => {
    const agent = await request.agent(app);
    await agent.get('/github/callback?code=55');
    const user = await agent.get('/github/dashboard');
    const res = await agent.post('/submissions').send({
      text: 'Delaney Submission for Goblin Fighter',
      status_id: 1,
      assignment_id: 4,
      user_id: user.body.id,
      grade: 20,
    });
    expect(res.status).toEqual(200);
    expect(res.body).toEqual({
      id: expect.any(String),
      created_on: expect.any(String),
      text: 'Delaney Submission for Goblin Fighter',
      status_id: 1,
      assignment_id: 4,
      user_id: Number(user.body.id),
      grade: 20,
      repo_link: null,
    });
  });

  it('PUT /submissions/:id should update a submission', async () => {
    const agent = await request.agent(app);
    await agent.get('/github/callback?code=55');
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
      repo_link: null,
    });
  });

  it('DELETE /submissions/:id should delete a single submission', async () => {
    const agent = await request.agent(app);
    await agent.get('/github/callback?code=55');
    await agent.put('/github/1').send({ role: 4 });
    await agent.delete('/github/sessions');
    await agent.get('/github/callback?code=55');
    await agent.delete('/submissions/2');
    const res = await agent.get('/submissions/2');
    expect(res.status).toEqual(200);
    expect(res.body).toEqual(null);
  });

  afterAll(() => {
    pool.end();
  });
});
