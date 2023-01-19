import {xmlElement, XmlElement} from '../xmlModel';
import {parseError, ParseResult, parseSuccess} from '../parser';
import {digitToSubscript} from './specialChars';

export type Determinative = XmlElement<'det'>;

export function determinative(...children: (XmlElement | string)[]): Determinative {
  return xmlElement('det', {}, children);
}

export function parseDeterminative(source: string): ParseResult<Determinative> {

  // consume first '°'
  if (source[0] !== '°') {
    return parseError();
  }

  let endTokenIndex = source.indexOf('°', 1);

  if (endTokenIndex === -1) {
    return parseError('No matching \'°\' found!');
  }

  const result = source.substring(1, endTokenIndex);
  const remaining = source.substring(endTokenIndex + 1);

  return parseSuccess(
    determinative(result.replace(/[0-9]/, (digit) => digitToSubscript(digit))),
    remaining
  );
}
