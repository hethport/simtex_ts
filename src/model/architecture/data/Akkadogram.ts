/**
 * File:     Akkadogram.java
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
 * Defines Akkadograms.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 * @since 11
 */
export  class Akkadogram extends Breakdown {
	/**
	 * The alphabet.
	 */
	private static readonly alphabet:  java.lang.String | null = Word.alphabetUpperCase + S`\\d` + Word.indexDigits + Word.delimiterAlphabet;

	/**
	 * The pattern for Akkadograms.
	 */
	protected static readonly pattern:  java.util.regex.Pattern | null = java.util.regex.Pattern.compile(S`[` + Akkadogram.alphabet + S`]*` + S`[` + Word.alphabetUpperCase + S`]+`
			+ S`[` + Akkadogram.alphabet + S`]*` + Word.subscriptRegularExpression);

	/**
	 * Creates an Akkadogram.
	 * 
	 * @param deleriPosition The deleri ('*' / erased / Rasur) position.
	 * @param text           The text.
	 * @since 11
	 */
	public constructor(deleriPosition: MetadataPosition| null, text: java.lang.String| null) {
		super(deleriPosition, text);
	}
}
