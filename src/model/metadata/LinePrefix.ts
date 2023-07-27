/**
 * File:     LinePrefix.ts
 *
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     06.12.2022
 */

import {Metadata} from './Metadata';
import {LineSource} from '../LineSource';
import {xmlElementNode, XmlNode, xmlTextNode} from 'simple_xml';

/**
 * Define line prefixes.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 */
export class LinePrefix extends Metadata {

  // TODO: implement correct export
  static readonly xmlTag: string = 'LINE_PREFIX';

  /**
   * The prefix.
   */
  private readonly prefix: string | null;

  /**
   * Creates a line prefix.
   *
   * @param source The line source.
   */
  public constructor(source: LineSource) {
    super(source);

    const normalized: string = LineSource.normalize(source.getText());

    this.prefix = normalized.length == 0 ? null : normalized.substring(1) + ' ';
  }

  /**
   * Returns true if the prefix are set.
   *
   * @return True if the prefix are set.
   */
  public isPrefixSet(): boolean {
    return this.prefix !== null;
  }

  /**
   * Returns the prefix.
   *
   * @return The prefix.
   */
  public getPrefix(): string | null {
    return this.prefix;
  }

  public exportXml(): XmlNode[] {
    return [xmlElementNode(LinePrefix.xmlTag, {}, [xmlTextNode(this.prefix == null ? '' : this.prefix)])];
  }
}
