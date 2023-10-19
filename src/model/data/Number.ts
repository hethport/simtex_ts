/**
 * File:     Number.ts
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     21.12.2022
 */

import { WordConstants, matchesFullStringRegularExpression } from './WordConstants';
import { Breakdown } from './fragment/Breakdown';
import {xmlElementNode, XmlElementNode} from 'simple_xml';

/**
 * Defines numbers.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 */
export  class Number extends Breakdown {
  /**
   * The xml tag.
   */
  static readonly xmlTag: string = 'num';
  
  /**
   * The unknown number.
   */
  private static readonly unknownNumber:  string = 'n';

  /**
   * The alphabet for known numbers.
   */
  private static readonly alphabetKnown:  string = '\\d' + WordConstants.delimiterAlphabet + WordConstants.escapedAlphabet;

  /**
   * The alphabet for unknown numbers.
   */
  private static readonly alphabetUnknown:  string = WordConstants.delimiterAlphabet + WordConstants.escapedAlphabet;

  /**
   * The pattern to extract numbers.
   */
  private static readonly patternExtractNumbers: RegExp = new RegExp('([\\-\\d]+)', 'g');

 /**
   * The pattern for numbers.
   */
  static readonly pattern:  RegExp = new RegExp('(' + matchesFullStringRegularExpression(
            '(|' + '[' + Number.alphabetUnknown + ']*' + Number.unknownNumber + '[' + Number.alphabetUnknown + ']*' + '\\+)'
            +'[' + Number.alphabetKnown + ']*' + '\\d' + '[' + Number.alphabetKnown + ']*' 
			+ '(|\\+' + '[' + Number.alphabetUnknown + ']*' + Number.unknownNumber + '[' + Number.alphabetUnknown + ']*' + ')'
			+ WordConstants.subscriptRegularExpression)
			+ ')|(' + matchesFullStringRegularExpression('[' + Number.alphabetUnknown + ']*' + Number.unknownNumber + '['
			+ Number.alphabetUnknown + ']*' + WordConstants.subscriptRegularExpression) + ')');

  /**
   * The integer. Null if unknown.
   */
  private readonly integer: number| null;

  /**
   * Creates a number.
   *
   * @param text           The text.
   */
  public constructor(text: string) {
    super(text);

    try {
      this.integer = parseInt(Number.extractNumber(this.getPlainText()));
    } catch (e) {
      this.integer = null;
    }

  }
  
  /**
   * Returns the number from given text.
   *
   * @param text The text to extract the number.
   * @return The number.
   */
  private static extractNumber(text: string): string {
    const buffer: string [] = [];     

    const matches = text.matchAll(Number.patternExtractNumbers);
    for (const match of matches)
      buffer.push(match[1]);
    
    return buffer.join('');
  }

  /**
   * Returns the integer.
   *
   * @return The integer. Null if unknown.
   */
  public getInteger(): number| null {
    return this.integer;
  }

  /**
   * Returns the absolute value of the integer.
   *
   * @return The absolute value of the integer. Null if unknown.
   */
  public getIntegerAbs(): number| null {
    return this.integer == null ? null : Math.abs(this.integer);
  }

  public exportXml(): XmlElementNode {
    return xmlElementNode(Number.xmlTag, {}, this.exportNodes());
  }
}
