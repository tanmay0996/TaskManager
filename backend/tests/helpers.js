const request = require('supertest');

async function registerUser(app, username, password) {
  const res = await request(app)
    .post('/api/auth/register')
    .send({ username, password });

  return res;
}

async function loginUser(app, username, password) {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ username, password });

  return res;
}

module.exports = {
  registerUser,
  loginUser,
};
