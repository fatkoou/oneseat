import { QueryFailedError } from 'typeorm';

export function createPgError(code: string): QueryFailedError {
  const driverError = Object.assign(new Error('database error'), { code });

  return new QueryFailedError('test query', [], driverError);
}
