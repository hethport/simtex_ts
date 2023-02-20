import {Failure} from 'parsimmon';
import {writeNode, XmlElementNode} from 'simple_xml';
import {ParagraphSeparatorNode} from './parsers/paragraphSeparatorParser';

export interface LineNumberInput {
  number: number;
  isConfirmed: boolean;
}

interface LinePreParsingError {
  type: 'LinePreParsingError';
  input: string;
  error: Failure;
}

interface LineWordParsingError {
  type: 'LineWordParsingError';
  input: string;
  lineNumber: LineNumberInput;
  errors: Failure[];
}

interface LineParseSuccess {
  type: 'LineParseSuccess';
  input: string;
  lineNumber: LineNumberInput;
  words: XmlElementNode<'w'>[];
  maybeParagraphSeparator: ParagraphSeparatorNode | undefined;
}

export type LineParseResult = LinePreParsingError | LineWordParsingError | LineParseSuccess;

export function writeLineParseSuccessToXml({lineNumber: {number, isConfirmed}, words, maybeParagraphSeparator}: LineParseSuccess): string {
  return [
    // TODO: `<lb lg="${lg}" lnr="${number + (isConfirmed ? '\'' : '')}" txtid="${textId}"/>`,
    `<lb lnr="${number + (isConfirmed ? '\'' : '')}"/>`,
    ...words.flatMap((w) => writeNode(w)),
    ...(maybeParagraphSeparator ? writeNode(maybeParagraphSeparator) : [])
  ].join(' ');
}

export function writeLineParseResultToXml(lineParseResult: LineParseResult): string {
  switch (lineParseResult.type) {
  case 'LinePreParsingError':
    return '<error>TODO: 1!</error>';
  case 'LineWordParsingError':
    return '<error>TODO: 2!</error>';
  case 'LineParseSuccess':
    return writeLineParseSuccessToXml(lineParseResult);
  }
}
