const request = require('supertest');
const app = require('../server');
const { registerUser, loginUser } = require('./helpers');

async function getAuthToken(app, username, password) {
  await registerUser(app, username, password);
  const loginRes = await loginUser(app, username, password);
  return loginRes.body.token;
}

describe('Tasks routes', () => {
  test('GET /api/tasks without token returns 401', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.status).toBe(401);
  });

  test('full CRUD flow for tasks', async () => {
    const token = await getAuthToken(app, 'user1', 'password123');

    // Create task
    const createRes = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test Task', description: 'Test description' });

    expect(createRes.status).toBe(201);
    expect(createRes.body).toHaveProperty('_id');
    const taskId = createRes.body._id;

    // Get tasks
    const listRes = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${token}`);

    expect(listRes.status).toBe(200);
    expect(Array.isArray(listRes.body)).toBe(true);
    expect(listRes.body.find((t) => t._id === taskId)).toBeTruthy();

    // Update task
    const updateRes = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'completed' });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.status).toBe('completed');

    // Delete task
    const deleteRes = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(deleteRes.status).toBe(200);

    const finalListRes = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${token}`);

    expect(finalListRes.body.find((t) => t._id === taskId)).toBeFalsy();
  });

  test('authorization: user B cannot modify user A tasks', async () => {
    const tokenA = await getAuthToken(app, 'userA', 'password123');
    const tokenB = await getAuthToken(app, 'userB', 'password123');

    const createRes = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ title: 'User A Task' });

    const taskId = createRes.body._id;

    const updateRes = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ status: 'completed' });

    expect([403, 404]).toContain(updateRes.status);

    const deleteRes = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${tokenB}`);

    expect([403, 404]).toContain(deleteRes.status);
  });
});
