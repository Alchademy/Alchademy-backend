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
    await agent.get('/github/callback?code=55');
    const res = await agent.get('/assignments/syllabus/1');

    expect(res.status).toEqual(200);
    expect(res.body.length).toEqual(21);
  });

  it('GET /assignments/:id should display a singular assignment', async () => {
    const agent = await request.agent(app);
    await agent.get('/github/callback?code=55');
    const res = await agent.get('/assignments/1');

    expect(res.status).toEqual(200);
    expect(res.body).toEqual({
      id: expect.any(String),
      title: 'Complete Typing Test',
      description: expect.any(String),
      syllabus_id: 1,
      due_date: null,
      status: expect.any(String),
      total_points: 1,
      status_id: 4,
      example_link: null,
      template_link: null
    });
  });

  it('POST /assignments should only allow teachers and above to create new assignments', async () => {
    const agent = await request.agent(app);
    await agent.get('/github/callback?code=55');
    const res = await agent.post('/assignments').send({
      title: 'From Scratch: Backend is your friend I promise',
      description: 'Here is some info and then a rubric',
      syllabus_id: 4,
      due_date: '2022-06-17 09:00:00',
      total_points: 25,
      status_id: 4,
      template_link: null,
      example_link: null
    });

    expect(res.status).toEqual(403);
    expect(res.body).toEqual({
      message: 'You must have Teacher privileges to access this page',
      status: 403,
    });
  });

  it('POST /assignments should add a new assignment into the syllabus if you are a teacher or higher', async () => {
    const agent = await request.agent(app);
    await agent.get('/github/callback?code=55');
    await agent.put('/github/1').send({ role: 3 });
    await agent.delete('/github/sessions');
    await agent.get('/github/callback?code=55');
    const res = await agent.post('/assignments').send({
      title: 'From Scratch: Backend is your friend I promise',
      description: 'Here is some info and then a rubric',
      syllabus_id: 4,
      due_date: '2022-06-17 09:00:00',
      total_points: 25,
      status_id: 4
    });

    expect(res.status).toEqual(200);
    expect(res.body).toEqual({
      id: expect.any(String),
      title: 'From Scratch: Backend is your friend I promise',
      description: 'Here is some info and then a rubric',
      syllabus_id: 4,
      due_date: expect.any(String),
      total_points: 25,
      status_id: 4,
      template_link: null,
      example_link: null
    });
  });

  it('PUT /assignments/:id should update an assignment', async () => {
    const agent = await request.agent(app);
    await agent.get('/github/callback?code=55');
    const res = await agent.put('/assignments/1').send({
      description: 'I changed my mind this should be something different',
    });
    expect(res.status).toEqual(200);
    expect(res.body).toEqual({
      id: expect.any(String),
      due_date: null,
      status_id: 4,
      syllabus_id: 1,
      title: 'Complete Typing Test',
      total_points: 1,
      description: 'I changed my mind this should be something different',
      template_link: null,
      example_link: null
    });
  });

  it('DELETE /assignments/:id should only allow teachers and admin to delete a singular assignment', async () => {
    const agent = await request.agent(app);
    await agent.get('/github/callback?code=55');
    const resp = await agent.delete('/assignments/1');
    expect(resp.status).toEqual(403);
    const res = await agent.get('/assignments/1');

    expect(res.status).toEqual(200);
    expect(res.body).toEqual({
      id: expect.any(String),
      title: 'Complete Typing Test',
      description: expect.any(String),
      syllabus_id: 1,
      due_date: null,
      status: expect.any(String),
      total_points: 1,
      status_id: 4,
      example_link: null,
      template_link: null
    });
  });

  it('DELETE /assignments/:id should delete a singular assignment', async () => {
    const agent = await request.agent(app);
    await agent.get('/github/callback?code=55');
    await agent.put('/github/1').send({ role: 3 });
    await agent.delete('/github/sessions');
    await agent.get('/github/callback?code=55');
    await agent.delete('/assignments/1');
    const res = await agent.get('/assignments/1');

    expect(res.status).toEqual(200);
    expect(res.body).toEqual(null);
  });

  afterAll(() => {
    pool.end();
  });
});
