/**
 * File:     Sumerogram.java
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
 * Defines Sumerograms.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 * @since 11
 */
export  class Sumerogram extends Breakdown {
  static readonly xmlTag: string = 'sGr';
  /**
   * The alphabet.
   */
  private static readonly alphabet:  string = WordConstants.alphabetUpperCase  + WordConstants.alphabetSymbols+ '\\d' + WordConstants.indexDigits + WordConstants.delimiterAlphabet
			+ '\\.' + '\\+' + 'x';

  /**
   * The pattern for Sumerograms.
   */
  static readonly pattern :  RegExp = new RegExp(matchesFullStringRegularExpression('[' + Sumerogram.alphabet + ']*' + '[' + WordConstants.alphabetUpperCase + ']+'
			+ '[' + Sumerogram.alphabet + ']*' + WordConstants.subscriptRegularExpression));

  /**
   * The symbol for inscribed characters.
   */
  protected static readonly inscribedCharacter:  string = '×';

  /**
   * The pattern for inscribed character.
   */
  private static inscribedCharacterPattern = new RegExp('([' + WordConstants.alphabetUpperCase + '\\d]{1})(x)([' + WordConstants.alphabetUpperCase + '\\d]{1})', 'g');

  /**
	 * Creates a Sumerogram.
	 * 
	 * @param deleriPosition The deleri ('*' / erased / Rasur) position.
	 * @param text           The text.
	 * @since 11
	 */
  public constructor(deleriPosition: MetadataPosition, text: string) {
    super(deleriPosition, Sumerogram.resolveInscribedCharacter(text));
  }

  /**
   * Resolve inscribed characters and returns it.
   *
   * @param text The text.
   * @return The text with resolved inscribed characters.
   * @since 11
   */
  private static resolveInscribedCharacter(text: string):  string {

    const  matches = text.matchAll(Sumerogram.inscribedCharacterPattern);
    let index = 0;
    const buffer: string[] = [];
    for (const match of matches) {
      buffer.push(text.substring(index, match.index) + match[1] + Sumerogram.inscribedCharacter + match[3]);
      if (match.index != null) {  index = match.index + match[0].length;  }
    }

    if(index < text.length) {
      buffer.push(text.substring(index));
    }

    return buffer.join('');
  }

  public exportXml(): XmlElementNode {
    return xmlElementNode(Sumerogram.xmlTag, {}, this.exportNodes());
  }
}
