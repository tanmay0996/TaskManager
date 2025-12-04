import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import api from './api.js';

// Helper to get the first interceptor handler
const getRequestInterceptor = () => api.interceptors.request.handlers[0]?.fulfilled;
const getResponseErrorInterceptor = () => api.interceptors.response.handlers[0]?.rejected;

describe('api utils (axios wrapper)', () => {
  const originalLocation = window.location;
  let consoleErrorSpy;

  beforeEach(() => {
    // reset localStorage
    localStorage.clear();
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // mock window.location so we can observe redirects
    delete window.location;
    window.location = { ...originalLocation, href: '/', pathname: '/' };
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    window.location = originalLocation;
  });

  it('adds Authorization header when token exists', () => {
    localStorage.setItem('token', 'test-token');

    const interceptor = getRequestInterceptor();
    const config = interceptor ? interceptor({ headers: {} }) : { headers: {} };

    expect(config.headers.Authorization).toBe('Bearer test-token');
  });

  it('does not add Authorization header when no token', () => {
    localStorage.removeItem('token');

    const interceptor = getRequestInterceptor();
    const config = interceptor ? interceptor({ headers: {} }) : { headers: {} };

    expect(config.headers.Authorization).toBeUndefined();
  });

  it('logs error details and clears token / redirects on 401', async () => {
    localStorage.setItem('token', 'test-token');

    const error = {
      config: { url: '/tasks', method: 'get' },
      response: { status: 401, data: { error: 'Unauthorized' } },
    };

    const interceptor = getResponseErrorInterceptor();
    await expect(interceptor(error)).rejects.toBe(error);

    // logged once
    expect(consoleErrorSpy).toHaveBeenCalled();

    // token cleared and redirected to /login
    expect(localStorage.getItem('token')).toBeNull();
    expect(window.location.pathname).toBe('/login');
  });

  it('logs error but does not clear token on non-401 error', async () => {
    localStorage.setItem('token', 'test-token');

    const error = {
      config: { url: '/tasks', method: 'get' },
      response: { status: 500, data: { error: 'Server error' } },
    };

    const interceptor = getResponseErrorInterceptor();
    await expect(interceptor(error)).rejects.toBe(error);

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(localStorage.getItem('token')).toBe('test-token');
    expect(window.location.pathname).toBe('/');
  });
});
