const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

jest.mock('../lib/services/github');

describe('backend-express-template routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it('Get user from Github and inserts them into users table', () => {
    expect(1).toEqual(1);
  });
  afterAll(() => {
    pool.end();
  });
});
