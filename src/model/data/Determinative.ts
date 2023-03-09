/**
 * File:     Determinative.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core.data
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     13.12.2022
 */


import { DegreeSign } from './DegreeSign';
import { matchesFullStringRegularExpression, WordConstants } from './WordConstants';
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
   * The god names.
   */
  private static readonly godNames:  string[][] = [['D'], ['m'], ['f'], ['m', '\\.', 'D'], ['f', '\\.', 'D']];

  /**
   * The god numbers.
   */
  private static readonly godNumbers:  number[] = [10, 15, 20, 30, 50];

  /**
   * Returns true if the number matches a god number.
   *
   * @return True if the number matches a god number.
   */
  static isGodNumber(godNumber: number | null) : boolean {
    if (godNumber != null) {
      for (const god of this.godNumbers)
        if (god == godNumber)
          return true;
    }
	
    return false;
  }
  
  /**
   * Returns the regular expression that matches god names.
   *
   * @return The regular expression that matches god names.
   * @since 11
   */
  private static getGodNamesRegularExpression() {
    const buffer: string[] = [];
    let isFisrt = true;
	
    for (const name of this.godNames) {
      if (isFisrt) 
        isFisrt = false;
      else
        buffer.push('|');

      buffer.push('(');
      
      for (const part of name) {
        buffer.push('[' + WordConstants.delimiterAlphabet + ']*' + part);
      }
      
      buffer.push('[' + WordConstants.delimiterAlphabet + ']*' + ')');
    }
	
    return buffer.join('');
  }

  /**
   * The alphabet.
   */
  private static readonly alphabet:  string = WordConstants.alphabetUpperCase + WordConstants.alphabetSymbols + '\\.' + '\\d' + WordConstants.indexDigits
			+ WordConstants.delimiterAlphabet + '\\+';

  /**
   * The pattern for determinative.
   */
  public static readonly pattern:  RegExp = new RegExp(matchesFullStringRegularExpression(
    '((' + Determinative.getGodNamesRegularExpression() + ')'
    +'|(' + '[' + Determinative.alphabet + ']*' + '[' + WordConstants.alphabetUpperCase + '\\.' + ']+' + '[' + Determinative.alphabet + ']*))'
	+ WordConstants.textEvaluationRegularExpression + WordConstants.subscriptRegularExpression), 'g');

  /**
   * The pattern for god name.
   */
  public static readonly patternGodName:  RegExp = new RegExp(matchesFullStringRegularExpression(
    '(' + Determinative.getGodNamesRegularExpression() + ')'
	+ WordConstants.textEvaluationRegularExpression + WordConstants.subscriptRegularExpression), 'g');

  /**
   * True if the determinative is a god name.
   */
  private readonly isGod: boolean;

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
    
    this.isGod = text.match(Determinative.patternGodName) ? true : false;
  }

  /**
   * Returns true if the determinative is a god name.
   *
   * @return True if the determinative is a god name.
   */
  public isGodName(): boolean {
    return this.isGod;
  }
  
  public exportXml(): XmlElementNode {
    return xmlElementNode(Determinative.xmlTag, {}, this.exportNodes());
  }
}
