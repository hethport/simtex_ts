/**
 * File:     Basic.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core.data
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     31.01.2023
 */


import { Word } from './Word';
import { Breakdown } from './fragment/Breakdown';
import { MetadataPosition } from './fragment/MetadataPosition';


/**
 * Defines basics.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 * @since 11
 */
export  class Basic extends Breakdown {
  /**
	 * The alphabet.
	 */
  private static readonly alphabet:  string = Word.alphabetLowerCase + '\\d' + Word.indexDigits + Word.delimiterAlphabet
			+ '\\+';

  /**
	 * The pattern for basics.
	 */
  static readonly pattern:  RegExp = new RegExp('[' + Basic.alphabet + ']*[' + Word.alphabetLowerCase + ']+['
			+ Basic.alphabet + ']*' + Word.subscriptRegularExpression);

  /**
	 * Creates a basic.
	 * 
	 * @param deleriPosition The deleri ('*' / erased / Rasur) position.
	 * @param text           The text.
	 * @since 11
	 */
  public constructor(deleriPosition: MetadataPosition, text: string) {
    super(deleriPosition, text);
  }
}
