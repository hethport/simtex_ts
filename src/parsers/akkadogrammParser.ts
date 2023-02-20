import {xmlElementNode, XmlElementNode, XmlNode} from '../xmlModel';
import {oneOf, Parser, seq, seqMap, string} from 'parsimmon';
import {DamageType} from './damageParser';
import {Correction} from './correctionParser';
import {foreignCharacterParser, joinStrings} from './foreignWordsParser';
import {clearUpperMultiStringContent} from './parserBasics';

export type Akkadogramm = XmlElementNode<'aGr'>;

export const akkadogramm = (...children: (XmlNode | string)[]) => xmlElementNode('aGr', {}, children.map(clearUpperMultiStringContent));

const akkadogrammContentParser: Parser<Akkadogramm> = seqMap(
  foreignCharacterParser,
  seq(
    oneOf('-+'),
    foreignCharacterParser
  ).many(),
  (first: (DamageType | Correction | string)[], rest) => akkadogramm(/*mark, */...joinStrings([...first, ...rest.flat().flat()]))
);

export const firstSyllableAkkadogrammParser: Parser<Akkadogramm> = seqMap(
  string('_'),
  akkadogrammContentParser,
  (mark, akkadogramm) => akkadogramm
);

export const otherSyllablesAkkadogrammParser: Parser<Akkadogramm> = akkadogrammContentParser;
