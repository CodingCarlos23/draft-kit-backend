import { isValidObjectId } from 'mongoose';
import { UnauthorizedError } from './http-errors';

const API_KEY_HEADER = 'x-api-key';
const USER_ID_HEADER = 'x-user-id';

function getExpectedApiKey(): string {
  const apiKey = process.env.NEXT_PUBLIC_API_KEY?.trim();

  if (!apiKey) {
    throw new Error('NEXT_PUBLIC_API_KEY is required');
  }

  return apiKey;
}

export function assertApiKeyAuth(request: Request): void {
  const providedApiKey = request.headers.get(API_KEY_HEADER)?.trim();

  if (!providedApiKey) {
    throw new UnauthorizedError('Missing API key');
  }

  if (providedApiKey !== getExpectedApiKey()) {
    throw new UnauthorizedError('Invalid API key');
  }
}

export function getAuthenticatedUserId(request: Request): string {
  assertApiKeyAuth(request);

  const userId = request.headers.get(USER_ID_HEADER);

  if (!userId) {
    throw new UnauthorizedError('Missing X-User-Id header');
  }

  if (!isValidObjectId(userId)) {
    throw new UnauthorizedError('Invalid X-User-Id header');
  }

  return userId;
}
