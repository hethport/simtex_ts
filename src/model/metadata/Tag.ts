/**
 * File:     Tag.ts
 *
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     12.12.2022
 */

import {TagType} from './TagType';
import {LineEntity} from '../LineEntity';
import {Attributes, XmlElementNode, xmlElementNode} from 'simple_xml';

/**
 * Defines tags.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 */
export class Tag implements LineEntity {
  static readonly xmlTag: string = 'TAG_';

  /**
   * The type.
   */
  private readonly type: TagType;

  /**
   * The content.
   */
  private readonly content: string | null;

  /**
    * The segment.
    */
  private readonly segment: string;
    
  /**
   * Creates a tag.
   *
   * @param segment The segment.
   * @param type    The type.
   * @param content The content.
   */
  public constructor(segment: string, type: string, content: string | null) {
    this.segment = segment;
    
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
   * Returns the segment.
   *
   * @return The segment.
   */
  public getSegment(): string | null {
    return this.segment;
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
    const attributes: Attributes = {};
    let xmlTag: string;

    switch (this.type) {
    case TagType.S:
      xmlTag = 'c';
      attributes['sign'] = content;
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
      attributes['c'] = content;
      break;
    case TagType.Mbegin:
    case TagType.Mend:
      //TODO: not defined tag
      xmlTag = Tag.xmlTag + TagType[this.type];
      break;
    }

    return xmlElementNode(xmlTag, attributes, []);
  }
}
