/**
 * File:     Number.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core.data
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     21.12.2022
 */


import { Word } from './Word';
import { Breakdown } from './fragment/Breakdown';
import { MetadataPosition } from './fragment/MetadataPosition';




/**
 * Defines numbers.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 * @since 11
 */
export  class Number extends Breakdown {
  /**
	 * The unknown number.
	 */
  private static readonly unknownNumber:  string = 'n';

  /**
	 * The alphabet for known numbers.
	 */
  private static readonly alphabetKnown:  string = '\\d' + Word.delimiterAlphabet;

  /**
	 * The alphabet for unknown numbers.
	 */
  private static readonly alphabetUnknown:  string = Word.delimiterAlphabet;

  /**
	 * The pattern for numbers.
	 */
  static readonly pattern:  RegExp = new RegExp('([' + Number.alphabetKnown + ']*' + '\\d' + '[' + Number.alphabetKnown
			+ ']*' + Word.subscriptRegularExpression + ')|(' + '[' + Number.alphabetUnknown + ']*' + Number.unknownNumber + '['
			+ Number.alphabetUnknown + ']*' + Word.subscriptRegularExpression + ')');

  /**
	 * The integer. Null if unknown.
	 */
  private readonly integer: number;

  /**
	 * Creates a number.
	 * 
	 * @param deleriPosition The deleri ('*' / erased / Rasur) position.
	 * @param text           The text.
	 * @since 11
	 */
  public constructor(deleriPosition: MetadataPosition, text: string) {
    super(deleriPosition, text);

    let  integer: number;
    try {
      integer = parseInt(this.getPlainText());
    } catch (e) {
      // TODO: handle Exception
      throw e;
    }

    this.integer = integer;
  }

  /**
	 * Returns the integer.
	 *
	 * @return The integer. Null if unknown.
	 * @since 11
	 */
  public getInteger(): number {
    return this.integer;
  }

}
