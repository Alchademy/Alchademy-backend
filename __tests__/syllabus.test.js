const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

jest.mock('../lib/services/github.js');

describe('github routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('GET /cohort/syllabus gets all courses for a students assigned cohort', async () => {
    const agent = await request.agent(app);
    await agent.get('/github/callback?code=55').redirects(1);
    const res = await agent.get('/syllabus');

    expect(res.status).toEqual(200);
    expect(res.body.length).toEqual(5);
  });

  it('GET /syllabus/users/:id gets all courses for a user by id', async () => {
    const agent = await request.agent(app);
    await agent.get('/github/callback?code=55').redirects(1);
    const res = await agent.get('/syllabus/user/10');

    expect(res.status).toEqual(200);
    expect(res.body.length).toEqual(4);
  });

  it('POST /syllabus creates a new syllabus', async () => {
    const agent = await request.agent(app);
    await agent.get('/github/callback?code=55').redirects(1);
    const res = await agent.post('/syllabus').send({  title: 'test', thumbnail_photo: '', 
      created_by: 1, owner_id: 1, description: 'test course', status_id: 1 });

    expect(res.status).toEqual(200);
    expect(res.body.title).toEqual('test');

    const result = await agent.get('/syllabus');

    expect(result.status).toEqual(200);
    expect(result.body.length).toEqual(6);
  });

  it('DELETE /syllabus/:id should delete a particular syllabus', async () => {
    const agent = await request.agent(app);
    await agent.get('/github/callback?code=55').redirects(1);
    const resp = await agent.delete('/syllabus/1');
    expect(resp.status).toEqual(200);
    expect(resp.body.id).toEqual('1');
    const res = await agent.get('/syllabus');
    expect(res.body.length).toEqual(4);
  });

  it('POST /syllabus should update a particular syllabus', async () => {
    const agent = await request.agent(app);
    await agent.get('/github/callback?code=55').redirects(1);
    const resp = await agent
      .put('/syllabus/1')
      .send({ title: 'test', thumbnail_photo: 'www.google.com' });
    expect(resp.status).toEqual(200);
    expect(resp.body.id).toEqual('1');
    const res = await agent.get('/syllabus/1');
    console.log(res);
    expect(res.body.title).toEqual('test');
  });

  afterAll(() => {
    pool.end();
  });
});







