/**
 * File:     Basic.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core.data
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     31.01.2023
 */


import { WordConstants, matchesFullStringRegularExpression } from './WordConstants';
import { Breakdown } from './fragment/Breakdown';
import { MetadataPosition } from './fragment/MetadataPosition';
import {XmlElementNode, xmlElementNode} from 'simple_xml';


/**
 * Defines basics.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 * @since 11
 */
export  class Basic extends Breakdown {
  public static readonly xmlTag: string = 'BASIC';
  /**
	 * The alphabet.
	 */
  private static readonly alphabet:  string = WordConstants.alphabetLowerCase + WordConstants.alphabetSymbols + WordConstants.brackets + '\\d' + WordConstants.indexDigits + WordConstants.delimiterAlphabet
			+ '\\+';

  /**
   * The pattern for basics.
   */
  static readonly pattern:  RegExp = new RegExp(matchesFullStringRegularExpression('[' + Basic.alphabet + ']*[' + WordConstants.alphabetLowerCase + ']+['
			+ Basic.alphabet + ']*' + WordConstants.subscriptRegularExpression));

  /**
   * Creates a basic.
   *
   * @param deleriPosition The deleri ('*' / erased / Rasur) position.
   * @param text           The text.
   * @since 11
   */
  public constructor(deleriPosition: MetadataPosition, text: string) {
    super(deleriPosition, text);
  }

  public exportXml(): XmlElementNode {
    return xmlElementNode(Basic.xmlTag, {}, this.exportNodes());
  }
}
