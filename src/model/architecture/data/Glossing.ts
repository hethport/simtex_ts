/**
 * File:     Glossing.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core.data
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     13.12.2022
 */


import { DegreeSign } from './DegreeSign';
import { Word } from './Word';
import { MetadataPosition } from './fragment/MetadataPosition';


/**
 * Defines glossing.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 * @since 11
 */
export  class Glossing extends DegreeSign {
  /**
	 * The alphabet.
	 */
  private static readonly alphabet:  string = Word.alphabetLowerCase + '\\d' + Word.indexDigits + Word.delimiterAlphabet;

  /**
	 * The pattern for Akkadograms.
	 */
  public static readonly pattern:  RegExp = new RegExp('[' + Glossing.alphabet + ']*' + '[' + Word.alphabetLowerCase + ']+'
			+ '[' + Glossing.alphabet + ']*' + Word.subscriptRegularExpression);

  /**
	 * Creates a glossing.
	 * 
	 * @param deleriPosition The deleri ('*' / erased / Rasur) position.
	 * @param segment        The segment.
	 * @param text           The text.
	 * @since 11
	 */
  public constructor(deleriPosition: MetadataPosition, segment: string| null, text: string) {
    super(deleriPosition, segment, text);
  }

}
