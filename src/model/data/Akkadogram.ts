/**
 * File:     Akkadogram.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core.data
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     31.01.2023
 */

import { WordConstants, matchesFullStringRegularExpression } from './WordConstants';
import { Breakdown } from './fragment/Breakdown';
import { MetadataPosition } from './fragment/MetadataPosition';
import {xmlElementNode, XmlElementNode} from 'simple_xml';

/**
 * Defines Akkadograms.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 * @since 11
 */
export  class Akkadogram extends Breakdown {
  static readonly xmlTag: string = 'aGr';
  /**
	 * The alphabet.
	 */
  private static readonly alphabet:  string = WordConstants.alphabetUpperCase + WordConstants.alphabetSymbols + '\\d' + WordConstants.indexDigits
            + WordConstants.delimiterAlphabet + '\\+' + '\\.';

  /**
   * The pattern for Akkadograms starting with an underscore.
   */
  static readonly patternStartingUnderscore:  RegExp = new RegExp('^[' + WordConstants.delimiterAlphabet + ']*_');

  /**
   * The pattern for Akkadograms.
   */
  static readonly pattern:  RegExp = new RegExp(matchesFullStringRegularExpression('[' + Akkadogram.alphabet + ']*' + '[' + WordConstants.alphabetUpperCase + ']+'
			+ '[' + Akkadogram.alphabet + ']*' + WordConstants.subscriptRegularExpression));

  /**
   * Creates an Akkadogram.
   *
   * @param deleriPosition The deleri ('*' / erased / Rasur) position.
   * @param text           The text.
   * @since 11
   */
  public constructor(deleriPosition: MetadataPosition, text: string) {
    super(deleriPosition, text);
  }

  public exportXml(): XmlElementNode {
    return xmlElementNode(Akkadogram.xmlTag, {}, this.exportNodes());
  }
}
