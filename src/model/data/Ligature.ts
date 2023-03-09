/**
 * File:     Ligature.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core.data
 *
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     06.03.2023
 */


import {XmlElementNode, xmlElementNode, xmlTextNode} from 'simple_xml';
import { Fragment } from './fragment/Fragment';
import { WordConstants } from './WordConstants';


/**
 * Defines ligatures for words.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 * @since 11
 */
export class Ligature extends Fragment {
  static readonly xmlTag: string = 'ligature';
  
  /**
   * The pattern for ligatures.
   */
  static readonly pattern: RegExp = new RegExp('( +|' + WordConstants.ligature + '+)', 'g');

  /**
   * Creates a ligature.
   *
   * @param text The text.
   * @since 11
   */
  public constructor(text: string) {
    super(text);
  }

  public exportXml(): XmlElementNode {
    const text: string | null = this.getText();
    return xmlElementNode(Ligature.xmlTag, {}, [xmlTextNode(text == null ? '' : text)]);
  }
}
