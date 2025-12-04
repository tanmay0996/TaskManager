const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

jest.mock('jsonwebtoken');

function createMockRes() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

describe('auth middleware', () => {
  const OLD_ENV = process.env;

  beforeAll(() => {
    process.env = { ...OLD_ENV, JWT_SECRET: 'test-secret' };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('returns 401 when Authorization header is missing', () => {
    const req = { headers: {} };
    const res = createMockRes();
    const next = jest.fn();

    auth(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({ error: 'Authorization header missing or invalid' });
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when token is invalid or expired', () => {
    const req = { headers: { authorization: 'Bearer invalidtoken' } };
    const res = createMockRes();
    const next = jest.fn();

    jwt.verify.mockImplementation(() => {
      throw new Error('invalid');
    });

    auth(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({ error: 'Invalid or expired token' });
    expect(next).not.toHaveBeenCalled();
  });

  it('calls next and sets req.userId when token is valid', () => {
    const req = { headers: { authorization: 'Bearer validtoken' } };
    const res = createMockRes();
    const next = jest.fn();

    jwt.verify.mockReturnValue({ userId: 'user123' });

    auth(req, res, next);

    expect(req.userId).toBe('user123');
    expect(res.statusCode).toBe(200);
    expect(next).toHaveBeenCalledTimes(1);
  });
});
