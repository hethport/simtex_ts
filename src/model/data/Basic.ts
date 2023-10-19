/**
 * File:     Basic.ts
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     31.01.2023
 */

import { WordConstants, matchesFullStringRegularExpression } from './WordConstants';
import {XmlElementNode, xmlElementNode} from 'simple_xml';
import { Collection } from './fragment/Collection';

/**
 * Defines basics.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 */
export  class Basic extends Collection {
  public static readonly xmlTag: string = 'BASIC';
  /**
   * The alphabet.
   */
  private static readonly alphabet:  string = WordConstants.alphabetLowerCase + WordConstants.alphabetSymbols + WordConstants.brackets + '\\d' + WordConstants.indexDigits + WordConstants.delimiterAlphabet
			+ '\\+' + WordConstants.escapedAlphabet + WordConstants.beginEscapeNEqual;

  /**
   * The pattern for basics.
   */
  static readonly pattern:  RegExp = new RegExp(matchesFullStringRegularExpression('[' + Basic.alphabet + ']*[' + WordConstants.alphabetLowerCase + WordConstants.horizontalEllipsis + ']+[' + Basic.alphabet + ']*'
    + WordConstants.subscriptRegularExpression));

  /**
   * Creates a basic.
   *
   * @param text           The text.
   */
  public constructor(text: string) {
    super(text);
  }

  public exportXml(): XmlElementNode {
    return xmlElementNode(Basic.xmlTag, {}, this.exportNodes());
  }
  
  /**
   * Returns true if the given object is of same type.
   *
   * @return True if the given object is of same type.
   */
  public isSameType(object : Collection): boolean {
    return object instanceof Basic;
  }
}
