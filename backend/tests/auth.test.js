const request = require('supertest');
const app = require('../server');
const { registerUser, loginUser } = require('./helpers');

describe('Auth routes', () => {
  test('register with valid credentials returns 201', async () => {
    const res = await registerUser(app, 'register_user', 'password123');
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('message');
  });

  test('registering same username returns 400', async () => {
    const username = 'duplicate_user';
    const password = 'password123';

    const first = await registerUser(app, username, password);
    expect(first.status).toBe(201);

    const second = await registerUser(app, username, password);
    expect(second.status).toBe(400);
  });

  test('login with correct credentials returns token', async () => {
    const username = 'login_user';
    const password = 'password123';

    await registerUser(app, username, password);
    const res = await loginUser(app, username, password);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(typeof res.body.token).toBe('string');
  });

  test('login with wrong password returns 401', async () => {
    const username = 'wrong_pass_user';
    const password = 'password123';

    await registerUser(app, username, password);
    const res = await loginUser(app, username, 'wrongpassword');

    expect(res.status).toBe(401);
  });
});
