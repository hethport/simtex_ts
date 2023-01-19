import {parseError, ParseResult, parseSuccess} from '../parser';
import {xmlText, XmlText} from '../xmlModel';
import {isLowerChar} from './specialChars';

const isHittiteChar = (char: string): boolean => isLowerChar(char) || char === '-' || char === '+';

export function parseHittite(source: string): ParseResult<XmlText> {

  let remaining = source;
  let result: string[] = [];

  while (remaining.length > 0 && isHittiteChar(remaining[0])) {
    result.push(remaining[0]);
    remaining = remaining.slice(1);
  }

  if (result.length === 0) {
    return parseError();
  }

  return parseSuccess(xmlText(result.join('')), remaining);
}
