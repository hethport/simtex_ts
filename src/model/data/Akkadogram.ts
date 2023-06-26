/**
 * File:     Akkadogram.ts
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
 */
export  class Akkadogram extends Breakdown {
  static readonly xmlTag: string = 'aGr';
  
  /**
   * The alphabet.
   */
  private static readonly alphabet:  string = WordConstants.alphabetUpperCase + WordConstants.alphabetSymbols + '\\d' + WordConstants.indexDigits
            + WordConstants.delimiterAlphabet + '\\+' + '\\.' + WordConstants.textEvaluationAlphabet;

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
   * The prepositions.
   */
  private static readonly prepositions:  string[][] = [
    ['_', 'A', 'N', 'A'],
    
    ['_', 'A', '\\-', 'N', 'A'],
    ['_', 'A', '\\+', '_', 'N', 'A'],
    
    ['_', 'A', '\\-', 'D', 'I'],
    ['_', 'A', '\\+', '_', 'D', 'I'],
    
    ['_', 'I', '\\-', 'N', 'A'],
    ['_', 'I', '\\+', '_', 'N', 'A'],
    
    ['_', 'A', 'Š', '\\-', 'Š', 'U', 'M'],
    ['_', 'A', 'Š', '\\+', '_', 'Š', 'U', 'M'],
   
    ['_', 'I', 'Š', '\\-', 'T', 'U'],
    ['_', 'I', 'Š', '\\+', '_', 'T', 'U'],

    ['_', 'I', 'T', '\\-', 'T', 'I'],
    ['_', 'I', 'T', '\\+', '_', 'T', 'I'],

    ['_', 'P', 'A', '\\-', 'N', 'I'],
    ['_', 'P', 'A', '\\+', '_', 'N', 'I'],
 
    ['_', 'Q', 'A', '\\-', 'D', 'U'],
    ['_', 'Q', 'A', '\\+', '_', 'D', 'U'],
  
    ['_', 'Š', 'A'],
  
    ['_', 'Š', 'A', '\\-', 'A'],
    ['_', 'Š', 'A', '\\+', '_', 'A'],
  
    ['_', 'Š', 'A', '\\-', 'P', 'A', 'L'],
    ['_', 'Š', 'A', '\\+', '_', 'P', 'A', 'L']
  ];

  /**
   * The pattern for prepositions.
   */
  public static readonly patternPreposition:  RegExp = new RegExp(
    '((' + Akkadogram.getPrepositionRegularExpression() + ')' + WordConstants.subscriptRegularExpression + '(|' + WordConstants.ligature + '*[^ ]*))[ ]+', 'g');

  /**
   * Returns the regular expression that matches prepositions.
   *
   * @return The regular expression that matches prepositions.
   */
  private static getPrepositionRegularExpression() {
    const buffer: string[] = [];
    let isFisrt = true;
	
    for (const name of this.prepositions) {
      if (isFisrt) 
        isFisrt = false;
      else
        buffer.push('|');

      buffer.push('(');
      
      for (const part of name) {
        buffer.push('[' + WordConstants.delimiterAlphabet + ']*' + part);
      }
      
      buffer.push('[' + WordConstants.indexDigits + WordConstants.delimiterAlphabet + WordConstants.textEvaluationAlphabet + ']*' + ')');
    }
	
    return buffer.join('');
  }

  /**
   * Creates an Akkadogram.
   *
   * @param deleriPosition The deleri ('*' / erased / Rasur) position.
   * @param text           The text.
   */
  public constructor(deleriPosition: MetadataPosition, text: string) {
    super(deleriPosition, text);
  }

  public exportXml(): XmlElementNode {
    return xmlElementNode(Akkadogram.xmlTag, {}, this.exportNodes());
  }
}
