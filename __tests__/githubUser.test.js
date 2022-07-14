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
      /https:\/\/github.com\/login\/oauth\/authorize\?client_id=[\w\d]+&scope=user&redirect_uri=http:\/\/localhost:7890\/github\/callback/i
    );
  });

  it('GET /github/callback route should login and redirect users to /github/dashboard', async () => {
    const res = await request
      .agent(app)
      .get('/github/callback?code=55')
      .redirects(1);

    expect(res.body).toEqual({
      id: expect.any(String),
      username: 'helloGoodbye',
      email: 'hello@goobye.com',
      avatar: 'https://www.placecage.com/gif/200/200',
      iat: expect.any(Number),
      exp: expect.any(Number),
      created_on: expect.any(String),
    });
  });

  it('should remove user session on calling delete', async () => {
    const agent = await request
      .agent(app)
      .get('/github/callback?code=55')
      .redirects(1);
    expect(agent.status).toEqual(200);

    const loggedOut = await agent.delete('/github/sessions');

    expect(loggedOut.body).toEqual({
      message: 'Signed out successfully!',
      success: true
    });
  });

  afterAll(() => {
    pool.end();
  });
});
