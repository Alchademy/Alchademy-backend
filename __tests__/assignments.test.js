const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

jest.mock('../lib/services/github.js');

describe('assignments routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('GET /assignments should display all assignments for a syllabus', async () => {
    const agent = await request.agent(app);
    await agent.get('/github/callback?code=55').redirects(1);
    const res = await agent.get('/assignments')
      .send({
        id: 2, 
        title: 'Module 2: Web',
        thumbnail_photo: 'url',
        created_by: 1,
        owner_id: 1,
        description: '2nd module of Alchemy',
        status: 1 
      });

    expect(res.status).toEqual(200);
    expect(res.body.length).toEqual(4);
  });

  it('POST /assignments should add a new assignment into the syllabus', async () => {
    const agent = await request.agent(app);
    await agent.get('/github/callback?code=55').redirects(1);
    const res = await agent.post('/assignments')
      .send({
        title: 'From Scratch: Backend is your friend I promise',
        description: 'Here is some info and then a rubric',
        syllabus_id: 4,
        due_date: 'September 1st 2022',
        total_points: 25,
        status_id: 4
      });

    expect(res.status).toEqual(200);
    expect(res.body).toEqual({
      title: 'From Scratch: Backend is your friend I promise',
      description: 'Here is some info and then a rubric',
      syllabus_id: 4,
      due_date: 'September 1st 2022',
      total_points: 25,
      status_id: 4
    });
  });

  it('PUT /assignments should update', async () => {
    const agent = await request.agent(app);
    await agent.get('/github/callback?code=55').redirects(1);
    const res = await agent.put('/assignments/:id')
      .send({
        description: 'I changed my mind this should be something different',
      });

    expect(res.status).toEqual(200);
    expect(res.body).toEqual({ description: 'I changed my mind this should be something different' });
  });


  afterAll(() => {
    pool.end();
  });
});
