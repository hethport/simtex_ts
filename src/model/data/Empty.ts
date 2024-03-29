/**
 * File:     Empty.ts
 *
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     12.12.2022
 */

import {LineEntity} from '../LineEntity';
import {XmlElementNode, xmlElementNode} from 'simple_xml';

/**
 * Defines empty strings or code points containing only spaces.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 */
export class Empty implements LineEntity {
  static readonly xmlTag: string = 'space';
  /**
   * The length of the code points containing only spaces. 0 if the string is
   * empty.
   */
  private readonly length:  number;

  /**
   * Creates an empty string or a code point containing only spaces.
   *
   * @param length The text length.
   */
  public constructor(length: number) {
    this.length = length;
  }

  /**
   * Returns the length.
   *
   * @return The length.
   */
  public getLength(): number {
    return this.length;
  }

  public exportXml(): XmlElementNode {
    return xmlElementNode(Empty.xmlTag, {'c': this.length.toString()}, []);
  }
}
