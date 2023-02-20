import {Parser, regexp} from 'parsimmon';
import {SuccessfulTestData} from './wordParser.spec';
import {XmlNode, xmlTextNode} from 'simple_xml';

export const lowerText: Parser<string> = regexp(/[a-wyzáàéèíìúùṭṣšḫ]+/u);

export const upperText: Parser<string> = regexp(/\p{Lu}+/u);

/**
 * FIXME: rename...
 * @param c
 */
export function clearUpperMultiStringContent(c: XmlNode | string): XmlNode {
  return typeof c === 'string' ? xmlTextNode(c) : c;
}

export function testParser<T>(name: string, parser: Parser<T>, cases: readonly SuccessfulTestData<T>[]) {
  return test.each(cases)(
    `parser "${name}" should parse "$source" as $awaitedResult`,
    ({source, awaitedResult}) => expect(parser.tryParse(source)).toEqual<T>(awaitedResult)
  );
}
