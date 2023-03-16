/**
 * File:     Basic.ts
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     31.01.2023
 */

import { WordConstants, matchesFullStringRegularExpression } from './WordConstants';
import { Breakdown } from './fragment/Breakdown';
import { MetadataPosition } from './fragment/MetadataPosition';
import {XmlElementNode, xmlElementNode} from 'simple_xml';

/**
 * Defines delimiters.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 */
export  class Delimiter extends Breakdown {
  public static readonly xmlTag: string = 'DELIMITER';
  /**
   * The alphabet.
   */
  private static readonly alphabet: string = WordConstants.delimiterAlphabet;

  /**
   * The pattern for delimiters.
   */
  static readonly pattern:  RegExp = new RegExp(matchesFullStringRegularExpression('[' + Delimiter.alphabet + ']+' + WordConstants.textEvaluationRegularExpression + WordConstants.subscriptRegularExpression));

  /**
   * Creates a delimiter.
   *
   * @param deleriPosition The deleri ('*' / erased / Rasur) position.
   * @param text           The text.
   */
  public constructor(deleriPosition: MetadataPosition, text: string) {
    super(deleriPosition, text);
  }

  public exportXml(): XmlElementNode {
    return xmlElementNode(Delimiter.xmlTag, {}, this.exportNodes());
  }
}
