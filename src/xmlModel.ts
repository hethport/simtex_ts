type Attributes = Record<string, string | undefined>;

export interface XmlElementNode<TagName extends string = string> {
  tagName: TagName;
  attributes: Attributes;
  children: XmlNode[];
}

export function xmlElementNode<TagName extends string = string>(tagName: TagName, attributes: Attributes = {}, children: XmlNode [] = []): XmlElementNode<TagName> {
  return {tagName, attributes, children};
}

export interface XmlText {
  content: string;
}

export function xmlTextNode(content: string): XmlText {
  return {content};
}

export function isXmlTextNode(node: XmlNode): node is XmlText {
  return 'content' in node;
}

export type XmlNode<TagName extends string = string> = XmlElementNode<TagName> | XmlText;
