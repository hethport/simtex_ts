/**
 * File:     Gap.ts
 *
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     06.03.2023
 */

import {XmlElementNode, xmlElementNode} from 'simple_xml';
import { Fragment } from './fragment/Fragment';
import { matchesFullStringRegularExpression } from './WordConstants';

/**
 * Defines gaps.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 */
export class Gap extends Fragment {
  static readonly xmlTag: string = 'GAP';
  
  /**
   * The gap. Unicode 1227D.
   */
  static readonly gap: string = '𒉽';

  /**
   * The pattern for gaps.
   */
  static readonly pattern: RegExp = new RegExp(matchesFullStringRegularExpression('(' + Gap.gap + '|〉〈)'), 'g');

  /**
   * Creates a ligature.
   *
   * @param text The text.
   */
  public constructor(text: string) {
    super(text);
  }

  public exportXml(): XmlElementNode {
    return xmlElementNode(Gap.xmlTag, {}, []);
  }
}
