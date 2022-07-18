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
    await agent.put('/github/1').send({ role: 3 });
    await agent.delete('/github/sessions');
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

  it('POST /cohorts creates a new cohort', async () => {
    const agent = await request.agent(app);
    await agent.get('/github/callback?code=55').redirects(1);
    await agent.put('/github/1').send({ role: 3 });
    await agent.delete('/github/sessions');
    await agent.get('/github/callback?code=55').redirects(1);
    const res = await agent.post('/cohorts').send({ month: 'March', year: 2022, title: 'march-2022' });

    expect(res.status).toEqual(200);
    expect(res.body.title).toEqual('march-2022');

    const result = await agent.get('/cohorts');

    expect(result.status).toEqual(200);
    expect(result.body.length).toEqual(3);
  });

  it('DELETE /cohorts should delete a particular recipe', async () => {
    const agent = await request.agent(app);
    await agent.get('/github/callback?code=55').redirects(1);
    await agent.put('/github/1').send({ role: 3 });
    await agent.delete('/github/sessions');
    await agent.get('/github/callback?code=55').redirects(1);
    const resp = await agent.delete('/cohorts/1');
    expect(resp.status).toEqual(200);
    expect(resp.body.id).toEqual('1');
    const res = await agent.get('/cohorts');
    expect(res.body.length).toEqual(1);
  });

  it('PUT /cohorts should update a particular cohort', async () => {
    const agent = await request.agent(app);
    await agent.get('/github/callback?code=55').redirects(1);
    await agent.put('/github/1').send({ role: 3 });
    await agent.delete('/github/sessions');
    await agent.get('/github/callback?code=55').redirects(1);
    const resp = await agent
      .put('/cohorts/1')
      .send({ year: 2023, title: 'february-2023' });
    expect(resp.status).toEqual(200);
    expect(resp.body.id).toEqual('1');
    const res = await agent.get('/cohorts/1');
    expect(res.body.title).toEqual('february-2023');
  });

  afterAll(() => {
    pool.end();
  });
});







