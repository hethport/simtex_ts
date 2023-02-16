/**
 * File:     Glossing.java
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
	private static readonly alphabet:  java.lang.String | null = Word.alphabetLowerCase + S`\\d` + Word.indexDigits + Word.delimiterAlphabet;

	/**
	 * The pattern for Akkadograms.
	 */
	protected static readonly pattern:  java.util.regex.Pattern | null = java.util.regex.Pattern.compile(S`[` + Glossing.alphabet + S`]*` + S`[` + Word.alphabetLowerCase + S`]+`
			+ S`[` + Glossing.alphabet + S`]*` + Word.subscriptRegularExpression);

	/**
	 * Creates a glossing.
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
