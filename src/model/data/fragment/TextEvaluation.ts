/**
 * File:     TextEvaluation.ts
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     07.03.2023
 */

import { xmlElementNode, XmlElementNode } from 'simple_xml';
import { matchesFullStringRegularExpression, WordConstants } from '../WordConstants';
import { Slice } from './Slice';

/**
 * Content is an immutable class that defines text evaluations.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 */
export class TextEvaluation implements Slice {
  static readonly xmlTag: string = 'corr';
  
  /**
   * The text evaluation alphabet.
   */
  private static readonly alphabet: string = '!|\\?|\\(\\?\\)|sic';
            
  /**
   * The escape pattern for text evaluation.
   */
  private static readonly patternEscape: RegExp = new RegExp('([\\.]?)' + '(' + TextEvaluation.alphabet + ')', 'g');

  /**
   * The pattern for a word of type text evaluation.
   */
  static readonly patternWord: RegExp = new RegExp(matchesFullStringRegularExpression('(['+ WordConstants.delimiterAlphabet + ']*(' + WordConstants.textEvaluationAlphabet + ')[' + WordConstants.delimiterAlphabet + WordConstants.textEvaluationAlphabet + ']*' + WordConstants.subscriptRegularExpression + ')'), 'g');
  
  /**
   * The pattern for text evaluation.
   */
  static readonly pattern: RegExp = new RegExp('(' + WordConstants.textEvaluationAlphabet + ')', 'g');

  /**
	* The text.
	*/
  private readonly text: string;

  /**
   * Creates a text evaluation.
   *
   * @param text The escaped text.
   */
  public constructor(text: string) {
    switch (text) {
    case '⓵':
      this.text = '?';
      break;

    case '⓶':
      this.text = '(?)';
      break;

    case '⓷':
      this.text = '!';
      break;

    case '⓸':
      this.text = 'sic';
      break;

    default:
     this.text = text;
    }
  }
  
  /**
   * Returns the escaped text.
   *
   * @param text The text to escape.
   * @return The escaped text.
   */
  public static escape(text: string): string {
    const matches = text.matchAll(TextEvaluation.patternEscape);
    let index = 0;
    const buffer: string[] = [];
    for (const match of matches) {
      if (match.index && index < match.index) {
        buffer.push(text.substring(index, match.index));
      }
      
      switch (match[2]) {
      case '?':
        buffer.push('⓵');
        break;

      case '(?)':
        buffer.push('⓶');
        break;

      case '!':
        buffer.push('⓷');
        break;

      case 'sic':
        buffer.push('⓸');
        break;

      default:
        buffer.push(match[2]);
      }
      
      // .? -> ?.
      if (match[1] == '.')
        buffer.push('.');
      
      if (match.index != null) {  index = match.index + match[0].length;  }
    }

    if(index < text.length) {
      buffer.push(text.substring(index));
    }
    
    return buffer.join('');
  }

  /**
   * Returns the text.
   *
   * @return The text.
   */
  public getText():  string {
    return this.text;
  }

  public exportXml(): XmlElementNode {
    return xmlElementNode(TextEvaluation.xmlTag, {'c': this.text}, []);
  }
}
