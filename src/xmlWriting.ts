import {isXmlTextNode, XmlNode} from './xmlModel';

interface XmlWriteConfig {
  inlineChildrenOf: string[];
}

const tlhXmlWriteConfig: XmlWriteConfig = {
  inlineChildrenOf: ['docID', 'AO:TxtPubl', 'w'],
};

function writeAttributeValue(value: string): string {
  return value
    .replace(/&(?!amp;)/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/ +/g, ' ');
}

const indent = (s: string, count = 2): string => ' '.repeat(count) + s;

export function writeNode(node: XmlNode, xmlWriteConfig: XmlWriteConfig = tlhXmlWriteConfig, parentInline = false, indentCount = 2): string[] {
  if (isXmlTextNode(node)) {
    return [node.content];
  }

  const {tagName, attributes, children} = node;

  const writtenAttributes = Object.entries(attributes)
    .flatMap(([name, value]) => value !== undefined ? [`${name}="${writeAttributeValue(value)}"`] : [])
    .join(' ');

  if (children.length === 0) {
    return [`<${tagName}${writtenAttributes.length === 0 ? '' : ' ' + writtenAttributes}/>`];
  }

  const firstChild = children[0];

  if (children.length === 1 && isXmlTextNode(firstChild)) {
    return [`<${tagName}${writtenAttributes.length === 0 ? '' : ' ' + writtenAttributes}>${firstChild.content}</${tagName}>`];
  }

  const inlineChildren = xmlWriteConfig.inlineChildrenOf.includes(tagName) || parentInline;

  const writtenChildren = children.flatMap((n) => writeNode(n, xmlWriteConfig, inlineChildren));

  const startTag = `<${tagName}${writtenAttributes.length === 0 ? '' : ' ' + writtenAttributes}>`;
  const endTag = `</${tagName}>`;

  return inlineChildren
    ? [startTag + writtenChildren.join('') + endTag]
    : [startTag, ...writtenChildren.map((c) => indent(c, indentCount)), endTag];
}
