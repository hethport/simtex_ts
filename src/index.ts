import {Result} from 'parsimmon';
import {LinePreParseResult, preParseLine} from './parsers/linePreParser';
import {parseTransliterationLineContent} from './parsers/lineContentParser';
import {LineParseResult} from './lineParseResult';

export {LineParseResult} from './lineParseResult';

// noinspection JSUnusedGlobalSymbols
export function parseTransliterationLine(input: string): LineParseResult {

  // extract line number and actual content
  const linePreParsingResult: Result<LinePreParseResult> = preParseLine(input.trim());

  if (!linePreParsingResult.status) {
    return {type: 'LinePreParsingError', input, error: linePreParsingResult};
  }

  const {lineNumber, content} = linePreParsingResult.value;

  const contentParseResult = parseTransliterationLineContent(content);

  if ('errors' in contentParseResult) {
    return {type: 'LineWordParsingError', lineNumber, input, errors: contentParseResult.errors};
  }

  const {words, maybeParagraphSeparator} = contentParseResult;

  return {type: 'LineParseSuccess', input, lineNumber, words, maybeParagraphSeparator};
}
