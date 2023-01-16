import {parseError, ParseResult} from '../parser';

export type WordFragment = string;

export interface Word {
  fragments: WordFragment[];
}

export function parseWord(source: string): ParseResult<Word> {
  return parseError();
}
