# Backend Tests

This backend uses **Jest**, **Supertest**, and **mongodb-memory-server** for testing.

- Tests run against an in-memory MongoDB instance.
- `server.js` must export the Express app via `module.exports = app;` and avoid calling `app.listen()` when `NODE_ENV === 'test'`.

## Running tests

From the `backend` folder:

```bash
npm test
# or with coverage
npm run test:coverage
```
