/**
 * File:     Basic.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core.data
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     31.01.2023
 */



import { java, S } from "../../../../../../../../../usr/bin/java";
import { Word } from "./Word";
import { Breakdown } from "./fragment/Breakdown";
import { MetadataPosition } from "./fragment/MetadataPosition";




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
	private static readonly alphabet:  java.lang.String | null = Word.alphabetLowerCase + S`\\d` + Word.indexDigits + Word.delimiterAlphabet
			+ S`\\+`;

	/**
	 * The pattern for basics.
	 */
	protected static readonly pattern:  java.util.regex.Pattern | null = java.util.regex.Pattern.compile(S`[` + Basic.alphabet + S`]*[` + Word.alphabetLowerCase + S`]+[`
			+ Basic.alphabet + S`]*` + Word.subscriptRegularExpression);

	/**
	 * Creates a basic.
	 * 
	 * @param deleriPosition The deleri ('*' / erased / Rasur) position.
	 * @param text           The text.
	 * @since 11
	 */
	public constructor(deleriPosition: MetadataPosition| null, text: java.lang.String| null) {
		super(deleriPosition, text);
	}
}
