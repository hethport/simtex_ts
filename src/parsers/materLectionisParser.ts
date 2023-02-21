import {Parser, seq, seqMap, string} from 'parsimmon';
import {lowerText} from './parserBasics';
import {xmlElementNode, XmlElementNode, xmlTextNode} from 'simple_xml';
import {determinativ, Determinative} from './determinativeParser';

export type MaterLectionis = XmlElementNode<'AOMaterLectionis'>;

export const materLectionis = (content: string) => xmlElementNode('AOMaterLectionis', {}, [xmlTextNode(content)]);

export const materLectionisParser: Parser<Determinative | MaterLectionis> = seqMap(
  string('°'),
  lowerText,
  seq(
    string('.'),
    lowerText
  ).many().tie(),
  string('°'),
  (openingCircle, result, /* closingCircle */) => result === 'm' || result === 'f'
    ? determinativ(xmlTextNode(result))
    : materLectionis(result)
);
