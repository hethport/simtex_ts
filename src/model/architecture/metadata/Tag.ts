/**
 * File:     Tag.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core.metadata
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
 * @since 11
 */
export  class Tag implements LineEntity {
  static readonly unknownTag: string = 'NO_TAG';
  /**
	 * The segment.
	 */
  private readonly segment:  string;

  /**
	 * The type.
	 */
  private readonly type:  TagType;

  /**
	 * The content.
	 */
  private readonly content:  string | null;

  /**
	 * Creates a tag.
	 * 
	 * @param segment The segment.
	 * @param type    The type.
	 * @param content The content.
	 * @since 11
	 */
  public constructor(segment: string, type: string, content: string) {

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
	 * @since 11
	 */
  public getSegment():  string | null {
    return this.segment;
  }

  /**
	 * Returns the type.
	 *
	 * @return The type.
	 * @since 11
	 */
  public getType():  TagType | null {
    return this.type;
  }

  /**
	 * Returns true if the content is set.
	 *
	 * @return True if the content is set.
	 * @since 11
	 */
  public isContentSet():  boolean {
    return this.content !== null;
  }

  /**
	 * Returns the content.
	 *
	 * @return The content.
	 * @since 11
	 */
  public getContent():  string | null {
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
      //TODO: unknown tag
      xmlTag = Tag.unknownTag;
      break;
    case TagType.Mend:
      //TODO: unknown tag
      xmlTag = Tag.unknownTag;
      break;
    }

    return xmlElementNode(xmlTag, attributes, []);
  }
}
