/**
 * File:     Determinative.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core.data
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     13.12.2022
 */



import { java, S } from "../../../../../../../../../usr/bin/java";
import { DegreeSign } from "./DegreeSign";
import { Word } from "./Word";
import { MetadataPosition } from "./fragment/MetadataPosition";




/**
 * Defines determinative.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 * @since 11
 */
export  class Determinative extends DegreeSign {
	/**
	 * The alphabet.
	 */
	private static readonly alphabet:  java.lang.String | null = Word.alphabetUpperCase + S`\\.` + S`\\d` + Word.indexDigits
			+ Word.delimiterAlphabet;

	/**
	 * The pattern for determinative.
	 */
	protected static readonly pattern:  java.util.regex.Pattern | null = java.util.regex.Pattern.compile(S`[` + Determinative.alphabet + S`]*` + S`[` + Word.alphabetUpperCase
			+ S`\\.` + S`]+` + S`[` + Determinative.alphabet + S`]*` + Word.subscriptRegularExpression);

	/**
	 * Creates a determinative.
	 * 
	 * @param deleriPosition The deleri ('*' / erased / Rasur) position.
	 * @param segment        The segment.
	 * @param text           The text.
	 * @since 11
	 */
	public constructor(deleriPosition: MetadataPosition| null, segment: java.lang.String| null, text: java.lang.String| null) {
		super(deleriPosition, segment, text);
	}

}
