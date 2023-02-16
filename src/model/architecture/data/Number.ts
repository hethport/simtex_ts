/**
 * File:     Number.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core.data
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     21.12.2022
 */



import { java, S } from "../../../../../../../../../usr/bin/java";
import { Word } from "./Word";
import { Breakdown } from "./fragment/Breakdown";
import { MetadataPosition } from "./fragment/MetadataPosition";




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
	private static readonly unknownNumber:  java.lang.String | null = S`n`;

	/**
	 * The alphabet for known numbers.
	 */
	private static readonly alphabetKnown:  java.lang.String | null = S`\\d` + Word.delimiterAlphabet;

	/**
	 * The alphabet for unknown numbers.
	 */
	private static readonly alphabetUnknown:  java.lang.String | null = Word.delimiterAlphabet;

	/**
	 * The pattern for numbers.
	 */
	protected static readonly pattern:  java.util.regex.Pattern | null = java.util.regex.Pattern.compile(S`([` + Number.alphabetKnown + S`]*` + S`\\d` + S`[` + Number.alphabetKnown
			+ S`]*` + Word.subscriptRegularExpression + S`)|(` + S`[` + Number.alphabetUnknown + S`]*` + Number.unknownNumber + S`[`
			+ Number.alphabetUnknown + S`]*` + Word.subscriptRegularExpression + S`)`);

	/**
	 * The integer. Null if unknown.
	 */
	private readonly integer:  java.lang.Integer | null;

	/**
	 * Creates a number.
	 * 
	 * @param deleriPosition The deleri ('*' / erased / Rasur) position.
	 * @param text           The text.
	 * @since 11
	 */
	public constructor(deleriPosition: MetadataPosition| null, text: java.lang.String| null) {
		super(deleriPosition, text);

		let  integer: java.lang.Integer;
		try {
			integer = java.lang.Integer.parseInt(this.getPlainText());
		} catch (e) {
if (e instanceof java.lang.Exception) {
			integer = null;
		} else {
	throw e;
	}
}

		this.integer = integer;
	}

	/**
	 * Returns the integer.
	 *
	 * @return The integer. Null if unknown.
	 * @since 11
	 */
	public getInteger():  java.lang.Integer | null {
		return this.integer;
	}

}
