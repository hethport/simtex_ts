import {parseError, ParseResult, parseSuccess} from '../parser';
import {xmlElement, XmlElement} from '../xmlModel';
import {isDigitChar, isUpperChar} from './specialChars';

// Großbuchstaben, Verbindung mit Punkt
export type Sumerogramm = XmlElement<'sGr'>;

export function sumerogramm(...children: (XmlElement | string)[]): Sumerogramm {
  return xmlElement('sGr', {}, children);
}

const isSumerogrammChar = (char: string): boolean => isUpperChar(char) || isDigitChar(char) || char === '.';

export function parseSumerogramm(source: string): ParseResult<Sumerogramm> {

  let remaining = source;
  let result: string[] = [];

  while (remaining.length > 0 && isSumerogrammChar(remaining[0])) {
    result.push(remaining[0]);
    remaining = remaining.slice(1);
  }

  if (result.length === 0) {
    return parseError();
  }

  return parseSuccess(sumerogramm(result.join('')), remaining);
}
