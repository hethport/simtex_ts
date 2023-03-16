/**
 * File:     Surplus.ts
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     07.03.2023
 */

import { xmlElementNode, XmlElementNode } from 'simple_xml';
import { Slice } from './Slice';

/**
 * Content is an immutable class that defines surplus: 〈〈text〉〉.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 */
export class Surplus implements Slice {
  static readonly xmlTag: string = 'surpl';
  
  /**
   * The text.
   */
  private readonly text:  string;

  /**
   * Creates a surplus.
   *
   * @param text The text.
   */
  public constructor(text: string) {
    this.text = text;
  }

  /**
   * Returns the text.
   *
   * @return The text.
   */
  public getText():  string {
    return this.text;
  }

  public exportXml(): XmlElementNode {
    return xmlElementNode(Surplus.xmlTag, {'c': this.text}, []);
  }
}
