import {parseError, ParseResult, parseSuccess} from '../parser';
import {xmlElement, XmlElement, XmlNode} from '../xmlModel';
import {parseAkkadogramm} from './akkadogramm';
import {isLowerChar, isUpperChar} from './specialChars';
import {parseSumerogramm} from './sumerogramm';
import {parseHittite} from './hittite';
import {parseDeterminative} from './determinative';

export type WordFragment = XmlNode;

export type Word = XmlElement<'w'>;

export function word(...children: (XmlElement | string)[]): Word {
  return xmlElement('w', {}, children);
}

export function parseWord(source: string): ParseResult<Word> {

  const firstFragmentResult = parseNextWordFragment(source, true);

  if (!firstFragmentResult.success) {
    return firstFragmentResult;
  }

  let remainingSource = firstFragmentResult.remaining;
  const fragments: WordFragment[] = [firstFragmentResult.value];

  while (remainingSource.length > 0) {

    const nextFragmentResult: ParseResult<XmlNode> = parseNextWordFragment(remainingSource);

    if (!nextFragmentResult.success) {
      throw new Error(`TODO: ${nextFragmentResult.error}!`);
    }

    remainingSource = nextFragmentResult.remaining;
    fragments.push(nextFragmentResult.value);
  }

  return parseSuccess({tagName: 'w', attributes: {}, children: fragments});
}

export function parseNextWordFragment(remainingSource: string, isFirstFragmentInWord = false): ParseResult<WordFragment> {
  if (remainingSource.length === 0) {
    return parseError('No input remaining!');
  }

  const firstChar = remainingSource[0];

  if (isFirstFragmentInWord && firstChar === '_') {
    // consume '_'!
    return parseAkkadogramm(remainingSource.slice(1));
  } else if (isUpperChar(firstChar)) {
    return parseSumerogramm(remainingSource);
  } else if (isLowerChar(firstChar) || !isFirstFragmentInWord && firstChar === '-') {
    return parseHittite(remainingSource);
  } else if(firstChar === '°') {
    return parseDeterminative(remainingSource);
  } else {
    return parseError(`Unexpected token: '${firstChar}'`);
  }
}

