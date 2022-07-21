const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

jest.mock('../lib/services/github.js');

describe('github routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('GET /github/login gets user from Github and inserts them into users table', async () => {
    const res = await request(app).get('/github/login');

    expect(res.header.location).toMatch(
      `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=user&redirect_uri=${process.env.REDIRECT_URI}`
    );
  });

  it('GET /github/callback route should login in user. GET /github/dashboard should get user', async () => {
    const agent = await request.agent(app);
    const cookie = await agent.get('/github/callback?code=55');
    expect(cookie.cookie);

    const user = await agent.get('/github/dashboard');

    expect(user.body).toEqual({
      id: expect.any(String),
      role_name: 'TA',
      username: 'rileyjhofftest',
      email: null,
      avatar: 'https://avatars.githubusercontent.com/u/109310727?v=4',
      role: 2,
      iat: expect.any(Number),
      exp: expect.any(Number),
      created_on: expect.any(String),
    });
  });

  it('should remove user session on calling delete', async () => {
    const agent = await request.agent(app);
    await agent.get('/github/callback?code=55');
    await agent.get('/github/dashboard');

    const loggedOut = await agent.delete('/github/sessions');

    expect(loggedOut.body).toEqual({
      message: 'Signed out successfully!',
      success: true,
    });
  });

  it('PUT should update a user', async () => {
    const agent = await request.agent(app);
    await agent.get('/github/callback?code=55');
    await agent.get('/github/dashboard');
    const updatedUser = await agent.put('/github/1').send({
      role: 3,
    });

    expect(updatedUser.body).toEqual({
      avatar: 'https://avatars.githubusercontent.com/u/109310727?v=4',
      created_on: expect.any(String),
      email: null,
      id: '14',
      role: 3,
      username: 'rileyjhofftest',
    });
  });

  afterAll(() => {
    pool.end();
  });
});
