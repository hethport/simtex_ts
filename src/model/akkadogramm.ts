import {parseError, ParseResult, parseSuccess} from '../parser';
import {xmlElement, XmlElement} from '../xmlModel';
import {isUpperChar} from './specialChars';

// Großbuchstaben, Verbindung mit Bindestrich, ggf. am Wortanfang Unterstrich
export type Akkadogramm = XmlElement<'aGr'>;

export function akkadogramm(...children: (XmlElement | string)[]): Akkadogramm {
  return xmlElement('aGr', {}, children);
}

const isAkkadogrammChar = (char: string): boolean => isUpperChar(char) || char === '-';

export function parseAkkadogramm(source: string): ParseResult<Akkadogramm> {

  let remaining = source;
  let result: string [] = [];

  while (remaining.length > 0 && isAkkadogrammChar(remaining[0])) {
    result.push(remaining[0]);
    remaining = remaining.slice(1);
  }

  if (result.length === 0) {
    return parseError();
  }

  return parseSuccess(akkadogramm(result.join('')), remaining);
}
