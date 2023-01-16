import {parseError, ParseResult} from './parser';

export function parseDocument(source: string): ParseResult<any>[] {
  return source
    .split('\n')
    .map((line, index) => parseError());
}
