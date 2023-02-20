import {alt, Parser, regexp, seqMap, string} from 'parsimmon';
import {xmlElementNode, XmlElementNode, XmlNode} from 'simple_xml';
import {Correction, correctionParser as corrections} from './correctionParser';
import {damageParser as damages, DamageType} from './damageParser';
import {ellipsisParser as ellipsis} from './ellipsisParser';
import {FootNote, footNoteParser as footNote, KolonMark, kolonMarkParser as kolonMark, Sign, signParser as sign} from './annotationsParser';
import {Determinative, determinativeParser as determinative} from './determinativeParser';
import {MaterLectionis, materLectionisParser as materLectionis} from './materLectionisParser';
import {Akkadogramm, firstSyllableAkkadogrammParser as firstSyllableAkkadogramm, otherSyllablesAkkadogrammParser as akkadogramm} from './akkadogrammParser';
import {firstSyllableSumerogrammParser as firstSyllableSumerogramm, innerWordSumerogrammParser as innerWordSumerogramm, Sumerogramm} from './sumerogrammParser';
import {inscribedLetterMarker} from './inscribedLetterMarkerParser';
import {basicText} from './basicTextParser';
import {joinStrings} from './foreignWordsParser';
import {clearUpperMultiStringContent} from './parserBasics';

// Word content

export const numeralContentParser: Parser<string> = regexp(/\d+/);

type SimpleWordContent = Correction | DamageType | Sign | FootNote | KolonMark | Determinative | MaterLectionis | string;

export const simpleWordContentParser: Parser<SimpleWordContent> = alt<SimpleWordContent>(
  corrections,
  damages,
  inscribedLetterMarker,
  ellipsis,
  sign,
  footNote,
  kolonMark,
  basicText,
  // Do not change order of these parsers!
  determinative,
  materLectionis,
  numeralContentParser,
);

type WordContent = Akkadogramm | Sumerogramm | SimpleWordContent;

const firstSyllableWordContentParser: Parser<WordContent> = alt<WordContent>(
  firstSyllableAkkadogramm,
  firstSyllableSumerogramm,
  simpleWordContentParser
);

const otherSyllablesWordContentParser: Parser<WordContent> = alt<WordContent>(
  akkadogramm,
  innerWordSumerogramm,
  simpleWordContentParser
);

// Word

export type Word = XmlElementNode<'w'>;

export const parsedWord = (...content: (XmlNode | string)[]): Word => xmlElementNode('w', {}, content.map(clearUpperMultiStringContent));

export const wordParser: Parser<Word> = seqMap(
  firstSyllableWordContentParser,
  seqMap(
    string('-'),
    otherSyllablesWordContentParser,
    (minus, wordContent): WordContent[] => [minus, wordContent]
  ).many(),
  (firstSyllable, otherSyllables) => parsedWord(...joinStrings([firstSyllable, ...otherSyllables.flat()]))
);
