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

  

  afterAll(() => {
    pool.end();
  });
});
