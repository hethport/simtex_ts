import {xmlElementNode, XmlElementNode, XmlNode} from '../xmlModel';
import {Parser, seqMap, string} from 'parsimmon';
import {ForeignCharacter, foreignCharacterParser as foreignCharacter, joinStrings} from './foreignWordsParser';
import {clearUpperMultiStringContent} from './parserBasics';

export type Sumerogramm = XmlElementNode<'sGr'>;

export const sumerogramm = (...children: (XmlNode | string)[]) => xmlElementNode('sGr', {}, children.map(clearUpperMultiStringContent));

const sumerogrammParser: Parser<Sumerogramm> = seqMap(
  foreignCharacter,
  seqMap(
    string('.'),
    foreignCharacter,
    (point, foreignChars): ForeignCharacter[] => [point, ...foreignChars]
  ).many().map((foreignChars) => foreignChars.flat()),
  (first: ForeignCharacter[], rest: ForeignCharacter[]) => sumerogramm(...joinStrings([...first, ...rest]))
);

export const firstSyllableSumerogrammParser: Parser<Sumerogramm> = sumerogrammParser;

export const innerWordSumerogrammParser: Parser<Sumerogramm> = seqMap(
  string('-'),
  sumerogrammParser,
  (minus, sumerogramm) => sumerogramm
);
