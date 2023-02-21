export type Attributes = Record<string, string | undefined>;

export interface XmlElement<TagName extends string = string> {
  tagName: TagName;
  attributes: Attributes;
  children: XmlNode[];
}

export function xmlElement<TagName extends string = string>(tagName: TagName, attributes: Attributes, children: (XmlElement | string)[]): XmlElement<TagName> {
  return {tagName, attributes, children: children.map((c) => typeof c === 'string' ? xmlText(c) : c)};
}

export interface XmlText {
  content: string;
}

export function xmlText(content: string): XmlText {
  return {content};
}

export type XmlNode<TagName extends string = string> = XmlElement<TagName> | XmlText;

export function xmlElementNode<TagName extends string = string>(
  tagName: TagName,
  attributes: Attributes = {},
  children: XmlNode[] = []
): XmlElement<TagName> {
  return {tagName, attributes, children};
}
