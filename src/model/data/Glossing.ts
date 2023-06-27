/**
 * File:     Glossing.ts
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     13.12.2022
 */

import { DegreeSign } from './DegreeSign';
import { matchesFullStringRegularExpression, WordConstants } from './WordConstants';
import { MetadataPosition } from './fragment/MetadataPosition';
import {Attributes, XmlElementNode, xmlElementNode} from 'simple_xml';

/**
 * Defines glossing.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 */
export  class Glossing extends DegreeSign {
  static readonly xmlTag: string = 'materlect';
  /**
   * The alphabet.
   */
  private static readonly alphabet:  string = WordConstants.alphabetLowerCase + WordConstants.alphabetSymbols + '\\d' + WordConstants.indexDigits
            + '\\+' + '\\.' + WordConstants.lesionDeleteAlphabet + WordConstants.textEvaluationAlphabet;

  /**
   * The pattern for Glossings.
   */
  public static readonly pattern:  RegExp = new RegExp(matchesFullStringRegularExpression('[' + Glossing.alphabet + ']*' + '[' + WordConstants.alphabetLowerCase + ']+'
			+ '[' + Glossing.alphabet + ']*'), 'g');

  /**
   * The pattern for text with dot, lesion and delete.
   */
  static readonly patternDotLesionDelete: RegExp = new RegExp('([^\\.' + WordConstants.lesionDeleteAlphabet + ']*)' + '([\\.' + WordConstants.lesionDeleteAlphabet + ']?)', 'g');

  /**
   * Creates a glossing.
   *
   * @param deleriPosition The deleri ('*' / erased / Rasur) position.
   * @param segment        The segment.
   * @param text           The text.
   */
  public constructor(deleriPosition: MetadataPosition, segment: string| null, text: string) {
    super(deleriPosition, segment, text);
  }

  public exportXml(): XmlElementNode {
    const text: string | null = this.getText();
    const attributes: Attributes = {};
    
    if (text != null)
      attributes['c'] = text;
    
    return xmlElementNode(Glossing.xmlTag, attributes, []);
  }
}
