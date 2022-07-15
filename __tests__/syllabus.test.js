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

  it('GET /cohort/syllabus gets all courses for a user by id', async () => {
    const agent = await request.agent(app);
    await agent.get('/github/callback?code=55').redirects(1);
    const res = await agent.get('/syllabus/10');

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

  afterAll(() => {
    pool.end();
  });
});







