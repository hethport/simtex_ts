/**
 * File:     Tag.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core.metadata
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     12.12.2022
 */


import { TagType } from './TagType';
import { LineEntity } from '../LineEntity';
import {ParagraphLanguageType} from './ParagraphLanguageType';




/**
 * Defines tags.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 * @since 11
 */
export  class Tag implements LineEntity {

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

}
