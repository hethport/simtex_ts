/**
 * File:     Marker.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core.metadata
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     06.12.2022
 */

import { Metadata } from './Metadata';
import { Tag } from './Tag';
import { LineSource } from '../LineSource';
import { StatusEvent } from '../StatusEvent';
import { StatusEventCode } from '../StatusEventCode';
import { StatusLevel } from '../StatusLevel';
import {xmlElementNode, XmlNode} from 'simple_xml';

/**
 * Define markers.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 * @since 11
 */
export  class Marker extends Metadata {
  // TODO: implement correct export
  static readonly xmlTag: string = 'MARKER';
  /**
   * Defines the depth for nested curly braces in the tag pattern.
   */
  private static readonly curlyBracketTagDepth:  number = 5;

  /**
   * Defines a regular expression that does not match curly brackets.
   */
  // TODO: fix regex
  public static readonly notCurlyBracketPattern:  RegExp = new RegExp('[^\\{\\}]*', 'g');

  /**
   * The tag pattern.
   */
  // TODO: fix regex
  public static readonly tagPattern:  RegExp = new RegExp('\\{(/M|[MSGFK]{1}):' + Marker.getNestedCurlyBracketDepthPattern(Marker.curlyBracketTagDepth) + '\\}', 'g');

  /**
   * Returns the regular expression that matches nested curly braces of the given
   * depth.
   *
   * @param depth The depth for matching with nested curly brackets.
   * @return The regular expression that matches nested curly braces of the given
   *         depth.
   * @since 11
   */
  private static getNestedCurlyBracketDepthPattern(depth: number):  string | null {
    return depth === 1 ? ''
      : '((' + Marker.notCurlyBracketPattern + '|\\{' + Marker.notCurlyBracketPattern
						+ Marker.getNestedCurlyBracketDepthPattern(--depth) + '\\}' + ')*)';
  }

  /**
   * The tags.
   */
  private readonly tags:  Tag[] = [];

  /**
   * Creates a marker.
   *
   * @param source The line source.
   * @since 11
   */
  public constructor(source: LineSource) {
    super(source);

    const  matches = source.getTextNormalized().matchAll(Marker.tagPattern);
    let index = 0;
    for (const match of matches) {
      this.addUnexpectedStatusEvent(source.getTextNormalized().substring(index, match.index));
      this.tags.push(new Tag(match[0], match[1], match[2]));
      if (match.index != null) {  index = match.index + match[0].length;  }
    }

    if(index < source.getTextNormalized().length) {
      this.addUnexpectedStatusEvent(source.getTextNormalized().substring(index));
    }
  }

  /**
   * Adds an unexpected status event if the segment is not empty.
   *
   * @param buffer The buffer that contains the segment.
   * @since 11
   */
  private addUnexpectedStatusEvent(segment: string):  void {
    if (segment.trim().length > 0)
      this.getStatus().add(new  StatusEvent(StatusLevel.serious, StatusEventCode.unexpected,
        'the segment \'' + segment.trim() + '\' is not a marker.'));
  }

  /**
   * Returns the tags.
   *
   * @return The tags.
   * @since 11
   */
  public getTags():  Tag[] {
    return this.tags;
  }

  public exportXml(): XmlNode[] {
    const nodes: XmlNode[] = [];
    for (const tag of this.tags) {
      nodes.push(tag.exportXml());
    }
    // TODO: group data
    return [xmlElementNode(Marker.xmlTag, {}, nodes)];
  }
}
