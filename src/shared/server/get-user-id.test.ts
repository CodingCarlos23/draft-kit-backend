import { beforeEach, describe, expect, it } from 'vitest';
import {
  assertApiKeyAuth,
  getAuthenticatedUserId,
} from './get-user-id';

describe('api key auth headers', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_KEY = 'draft-kit_test-key';
  });

  it('accepts a valid api key and user id', () => {
    const request = new Request('http://localhost/api/users/me', {
      headers: {
        'x-api-key': 'draft-kit_test-key',
        'X-User-Id': '507f1f77bcf86cd799439011',
      },
    });

    expect(() => assertApiKeyAuth(request)).not.toThrow();
    expect(getAuthenticatedUserId(request)).toBe('507f1f77bcf86cd799439011');
  });

  it('rejects a missing api key', () => {
    const request = new Request('http://localhost/api/users/me');

    expect(() => assertApiKeyAuth(request)).toThrow(
      'Missing API key',
    );
  });

  it('rejects an invalid api key', () => {
    const request = new Request('http://localhost/api/users/me', {
      headers: {
        'x-api-key': 'wrong-key',
      },
    });

    expect(() => assertApiKeyAuth(request)).toThrow(
      'Invalid API key',
    );
  });

  it('rejects an invalid internal user id', () => {
    const request = new Request('http://localhost/api/users/me', {
      headers: {
        'x-api-key': 'draft-kit_test-key',
        'X-User-Id': 'not-an-object-id',
      },
    });

    expect(() => getAuthenticatedUserId(request)).toThrow(
      'Invalid X-User-Id header',
    );
  });
});
