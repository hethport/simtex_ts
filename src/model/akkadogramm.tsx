import {parseError, ParseResult} from '../parser';

export interface Akkadogramm {

}

export function parseAkkadogramm(source: string): ParseResult<Akkadogramm> {
  return parseError();
}
