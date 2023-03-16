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
   * The pattern for a word of type text evaluation.
   */
  static readonly patternWord: RegExp = new RegExp(matchesFullStringRegularExpression('(['+ WordConstants.delimiterAlphabet + ']*(' + WordConstants.alphabetTextEvaluation + ')[' + WordConstants.delimiterAlphabet + ']*' + WordConstants.subscriptRegularExpression + ')'), 'g');
  
  /**
   * The pattern for text evaluation.
   */
  static readonly pattern: RegExp = new RegExp('(' + WordConstants.alphabetTextEvaluation + ')$', 'g');

  /**
	* The text.
	*/
  private readonly text: string;

  /**
   * Creates a text evaluation.
   *
   * @param text The text.
   */
  public constructor(text: string) {
    this.text = text;
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
