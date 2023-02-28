/**
 * File:     Number.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core.data
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     21.12.2022
 */


import { WordConstants, matchesFullStringRegularExpression } from './WordConstants';
import { Breakdown } from './fragment/Breakdown';
import { MetadataPosition } from './fragment/MetadataPosition';
import {xmlElementNode, XmlElementNode, xmlTextNode} from 'simple_xml';




/**
 * Defines numbers.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 * @since 11
 */
export  class Number extends Breakdown {
  static readonly xmlTag: string = 'num';
  /**
   * The unknown number.
   */
  private static readonly unknownNumber:  string = 'n';

  /**
   * The alphabet for known numbers.
   */
  private static readonly alphabetKnown:  string = '\\d' + WordConstants.delimiterAlphabet;

  /**
   * The alphabet for unknown numbers.
   */
  private static readonly alphabetUnknown:  string = WordConstants.delimiterAlphabet;

  /**
   * The pattern for numbers.
   */
  static readonly pattern:  RegExp = new RegExp(matchesFullStringRegularExpression('([' + Number.alphabetKnown + ']*' + '\\d' + '[' + Number.alphabetKnown
			+ ']*' + WordConstants.subscriptRegularExpression + ')|(' + '[' + Number.alphabetUnknown + ']*' + Number.unknownNumber + '['
			+ Number.alphabetUnknown + ']*' + WordConstants.subscriptRegularExpression + ')'));

  /**
   * The integer. Null if unknown.
   */
  private readonly integer: number| null;

  /**
   * Creates a number.
   *
   * @param deleriPosition The deleri ('*' / erased / Rasur) position.
   * @param text           The text.
   * @since 11
   */
  public constructor(deleriPosition: MetadataPosition, text: string) {
    super(deleriPosition, text);

    let  integer: number| null;
    try {
      integer = Math.abs(parseInt(this.getPlainText()));
    } catch (e) {
      integer = null;
    }

    this.integer = integer;
  }

  /**
   * Returns the integer.
   *
   * @return The integer. Null if unknown.
   * @since 11
   */
  public getInteger(): number| null {
    return this.integer;
  }

  public exportXml(): XmlElementNode {
    return xmlElementNode(Number.xmlTag, {}, [xmlTextNode(this.getPlainText())]);
  }
}