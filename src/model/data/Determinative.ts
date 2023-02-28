/**
 * File:     Determinative.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core.data
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     13.12.2022
 */


import { DegreeSign } from './DegreeSign';
import { WordConstants } from './WordConstants';
import { MetadataPosition } from './fragment/MetadataPosition';
import {XmlElementNode, xmlElementNode} from 'simple_xml';


/**
 * Defines determinative.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 * @since 11
 */
export  class Determinative extends DegreeSign {
  static readonly xmlTag: string = 'd';
  /**
   * The alphabet.
   */
  private static readonly alphabet:  string = WordConstants.alphabetUpperCase + '\\.' + '\\d' + WordConstants.indexDigits
			+ WordConstants.delimiterAlphabet;

  /**
   * The pattern for determinative.
   */
  public static readonly pattern:  RegExp = new RegExp('[' + Determinative.alphabet + ']*' + '[' + WordConstants.alphabetUpperCase
			+ '\\.' + ']+' + '[' + Determinative.alphabet + ']*' + WordConstants.subscriptRegularExpression, 'g');

  /**
   * Creates a determinative.
   *
   * @param deleriPosition The deleri ('*' / erased / Rasur) position.
   * @param segment        The segment.
   * @param text           The text.
   * @since 11
   */
  public constructor(deleriPosition: MetadataPosition, segment: string| null, text: string) {
    super(deleriPosition, segment, text);
  }

  public exportXml(): XmlElementNode {
    return xmlElementNode(Determinative.xmlTag, {}, this.exportNodes());
  }
}