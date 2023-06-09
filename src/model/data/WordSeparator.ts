/**
 * File:     WordSeparator.ts
 *
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     09.06.2023
 */

import {LineEntity} from '../LineEntity';
import {XmlElementNode, xmlElementNode} from 'simple_xml';

/**
 * Defines word separators.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 */
export class WordSeparator implements LineEntity {
  static readonly xmlTag: string = 'wsep';
  /**
   * The charachter.
   */
  private readonly charachter:  string;

  /**
   * Creates a word separator.
   *
   * @param charachter The text charachter.
   */
  public constructor(charachter:  string) {
    this.charachter = charachter;
  }

  /**
   * Returns the charachter.
   *
   * @return The charachter.
   */
  public getCharachter(): string {
    return this.charachter;
  }

  public exportXml(): XmlElementNode {
    return xmlElementNode(WordSeparator.xmlTag, {'c': this.charachter}, []);
  }
}
