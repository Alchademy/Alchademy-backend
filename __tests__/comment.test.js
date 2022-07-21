const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

jest.mock('../lib/services/github.js');

describe('comment routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('GET /comments/:id returns a single comment', async () => {
    const agent = await request.agent(app);
    await agent.get('/github/callback?code=55');
    const res = await agent.get('/comments/2');

    expect(res.status).toEqual(200);
    expect(res.body.text).toEqual(
      'testing the comment system, Beau commenting on the Feb Cohort'
    );
  });

  it('GET /comments/type/:id returns all comments for a specific record and type', async () => {
    const agent = await request.agent(app);
    await agent.get('/github/callback?code=55');
    const res = await agent.get('/comments/400/2');

    expect(res.status).toEqual(200);
    expect(res.body[0].text).toEqual(
      'testing the comment system, comment on Beau Poll Maker'
    );
    expect(res.body.length).toEqual(1);
  });

  it('POST /comments creates a new comment for the user on a record', async () => {
    const agent = await request.agent(app);
    await agent.get('/github/callback?code=55');
    const res = await agent.post('/comments').send({
      text: 'test second comment',
      user_id: 10,
      target_entity: 400,
      target_entity_id: 2,
      status_id: 2,
    });

    expect(res.status).toEqual(200);
    expect(res.body.text).toEqual('test second comment');

    const resp = await agent.get('/comments/400/2');

    expect(resp.status).toEqual(200);
    expect(resp.body[0].text).toEqual(
      'testing the comment system, comment on Beau Poll Maker'
    );
    expect(resp.body.length).toEqual(2);
  });

  it('DELETE /comments should delete a particular comment', async () => {
    const agent = await request.agent(app);
    await agent.get('/github/callback?code=55');
    const res = await agent.post('/comments').send({
      text: 'test second comment',
      user_id: 10,
      target_entity: 400,
      target_entity_id: 2,
      status_id: 2,
    });

    expect(res.status).toEqual(200);
    expect(res.body.text).toEqual('test second comment');

    const resp = await agent.get('/comments/400/2');

    expect(resp.status).toEqual(200);
    expect(resp.body[0].text).toEqual(
      'testing the comment system, comment on Beau Poll Maker'
    );
    expect(resp.body.length).toEqual(2);

    const respDelete = await agent.delete(`/comments/${res.body.id}`);
    expect(respDelete.status).toEqual(200);
    expect(respDelete.body.text).toEqual('test second comment');

    const respDeleted = await agent.get('/comments/400/2');

    expect(respDeleted.status).toEqual(200);
    expect(respDeleted.body.length).toEqual(1);
  });

  afterAll(() => {
    pool.end();
  });
});
