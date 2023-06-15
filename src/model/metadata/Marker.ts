/**
 * File:     Marker.ts
 *
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     06.12.2022
 */

import {Metadata} from './Metadata';
import {Tag} from './Tag';
import {LineSource} from '../LineSource';
import {StatusEvent} from '../StatusEvent';
import {StatusEventCode} from '../StatusEventCode';
import {StatusLevel} from '../StatusLevel';
import {XmlNode} from 'simple_xml';

/**
 * Define markers.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 */
export class Marker extends Metadata {

  /**
   * Defines the depth for nested curly braces in the tag pattern.
   */
  private static readonly curlyBracketTagDepth: number = 5;

  /**
   * Defines a regular expression that does not match curly brackets.
   */
  public static readonly notCurlyBracketPattern: string = '[^\\{\\}]*';

  /**
   * The tag pattern.
   */
  public static readonly tagPattern: RegExp = new RegExp('\\{(/M|[MSGFK]{1}):' + Marker.getNestedCurlyBracketDepthPattern(Marker.curlyBracketTagDepth) + '\\}', 'g');

  /**
   * Returns the regular expression that matches nested curly braces of the given
   * depth.
   *
   * @param depth The depth for matching with nested curly brackets.
   * @return The regular expression that matches nested curly braces of the given
   *         depth.
   */
  private static getNestedCurlyBracketDepthPattern(depth: number): string | null {
    return depth === 1 ? ''
      : '((' + Marker.notCurlyBracketPattern + '|\\{' + Marker.notCurlyBracketPattern
      + Marker.getNestedCurlyBracketDepthPattern(--depth) + '\\}' + ')*)';
  }

  /**
   * The tags.
   */
  private readonly tags: Tag[] = [];

  /**
   * Creates a marker.
   *
   * @param source The line source.
   */
  public constructor(source: LineSource) {
    super(source);

    const matches = source.getTextNormalized().matchAll(Marker.tagPattern);
    let index = 0;
    for (const match of matches) {
      this.addUnexpectedStatusEvent(source.getTextNormalized().substring(index, match.index));

      const tag = new Tag(true, match[0], match[1], match[2]);
      
      if (tag.isTypeS())
        this.getStatus().add(new StatusEvent(StatusLevel.serious, StatusEventCode.unexpected,
          'the marker S is not allowed in line mode \'' + match[0] + '\'.'));
      else
        this.tags.push(tag);

      if (match.index != null) {
        index = match.index + match[0].length;
      }
    }

    if (index < source.getTextNormalized().length) {
      this.addUnexpectedStatusEvent(source.getTextNormalized().substring(index));
    }
  }

  /**
   * Adds an unexpected status event if the segment is not empty.
   *
   * @param buffer The buffer that contains the segment.
   */
  private addUnexpectedStatusEvent(segment: string): void {
    if (segment.trim().length > 0)
      this.getStatus().add(new StatusEvent(StatusLevel.serious, StatusEventCode.unexpected,
        'the segment \'' + segment.trim() + '\' is not a marker.'));
  }

  /**
   * Returns the tags.
   *
   * @return The tags.
   */
  public getTags(): Tag[] {
    return this.tags;
  }

  public exportXml(): XmlNode[] {
    const nodes: XmlNode[] = [];
    for (const tag of this.tags) {
      nodes.push(tag.exportXml());
    }

    return nodes;
  }
}
