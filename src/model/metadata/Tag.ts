/**
 * File:     Tag.ts
 *
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     12.12.2022
 */

import {TagType} from './TagType';
import {Attributes, XmlElementNode, xmlElementNode, XmlNode, xmlTextNode} from 'simple_xml';
import { Fragment } from '../data/fragment/Fragment';

/**
 * Defines tags.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 */
export class Tag extends Fragment {
  static readonly xmlTag: string = 'TAG_';

  /**
   * True if is a line tag.
   */
  private readonly isLine: boolean;

  /**
   * The type.
   */
  private readonly type: TagType;

  /**
   * The content.
   */
  private readonly content: string | null;

  /**
   * Creates a tag.
   *
   * @param segment The segment.
   * @param type    The type.
   * @param content The content.
   */
  public constructor(isLine: boolean, segment: string, type: string, content: string | null) {
    super(segment);
    
    this.isLine = isLine;
    
    switch (type) {
    case 'M':
      this.type = TagType.Mbegin;
      break;

    case '/M':
      this.type = TagType.Mend;
      break;

    default:
      this.type = TagType[type as keyof typeof TagType];
      break;
    }
	
    this.content = content === null || content.trim().length == 0 ? null : content.trim();
  }

  /**
   * Returns the type.
   *
   * @return The type.
   */
  public getType(): TagType | null {
    return this.type;
  }

  /**
   * Returns true if the type is S.
   *
   * @return True if the type is S.
   */
  public isTypeS(): boolean {
    return this.type != null && this.type == TagType.S;
  }

  /**
   * Returns true if the content is set.
   *
   * @return True if the content is set.
   */
  public isContentSet(): boolean {
    return this.content !== null;
  }

  /**
   * Returns the content.
   *
   * @return The content.
   */
  public getContent(): string | null {
    return this.content;
  }

  public exportXml(): XmlElementNode {
    const content: string| undefined = this.content == null ? undefined : this.content;
    
    const nodes: XmlNode[] = [];
    const attributes: Attributes = {};
    let xmlTag: string;

    switch (this.type) {
    case TagType.S:
      xmlTag = 'c';
      attributes['type'] = 'sign';
      if (this.content != null)
        nodes.push(xmlTextNode(this.content));
      break;
    case TagType.F:
      xmlTag = 'note';
      attributes['c'] = content;
      break;
    case TagType.K:
      xmlTag = 'clb';
      attributes['id'] = content;
      // TODO: unknown attribute behavior 'nr'
      attributes['nr'] = '1';
      break;
    case TagType.G:
      xmlTag = 'gap';
      if (this.isLine)
       attributes['t'] = 'line';
      attributes['c'] = content;
      break;
    case TagType.Mbegin:
    case TagType.Mend:
      //TODO: not defined tag
      xmlTag = Tag.xmlTag + TagType[this.type];
      break;
    }

    return xmlElementNode(xmlTag, attributes, nodes);
  }
}
