export interface ParseSuccess<T> {
  success: true;
  value: T;
  remaining: string;
}

export function parseSuccess<T>(value: T, remaining = ''): ParseSuccess<T> {
  return {success: true, value, remaining};
}

export interface ParseError {
  success: false;
  error: string;
}

export function parseError(error: string = 'TODO!'): ParseError {
  return {success: false, error};
}

export type ParseResult<T> = ParseSuccess<T> | ParseError;

