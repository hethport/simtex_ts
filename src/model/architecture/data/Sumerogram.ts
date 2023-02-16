/**
 * File:     Sumerogram.java
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
 * Defines Sumerograms.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 * @since 11
 */
export  class Sumerogram extends Breakdown {
	/**
	 * The alphabet.
	 */
	private static readonly alphabet:  java.lang.String | null = Word.alphabetUpperCase + S`\\d` + Word.indexDigits + Word.delimiterAlphabet
			+ S`\\.` + S`x`;

	/**
	 * The pattern for Sumerograms.
	 */
	protected static readonly pattern:  java.util.regex.Pattern | null = java.util.regex.Pattern.compile(S`[` + Sumerogram.alphabet + S`]*` + S`[` + Word.alphabetUpperCase + S`]+`
			+ S`[` + Sumerogram.alphabet + S`]*` + Word.subscriptRegularExpression);

	/**
	 * The symbol for inscribed characters.
	 */
	protected static readonly inscribedCharacter:  java.lang.String | null = S`×`;

	/**
	 * The pattern for inscribed character.
	 */
	private static inscribedCharacterPattern:  java.util.regex.Pattern | null = java.util.regex.Pattern
			.compile(S`([` + Word.alphabetUpperCase + S`\\d]{1})(x)([` + Word.alphabetUpperCase + S`\\d]{1})`);

	/**
	 * Creates a Sumerogram.
	 * 
	 * @param deleriPosition The deleri ('*' / erased / Rasur) position.
	 * @param text           The text.
	 * @since 11
	 */
	public constructor(deleriPosition: MetadataPosition| null, text: java.lang.String| null) {
		super(deleriPosition, Sumerogram.resoveInscribedCharacter(text));
	}

	/**
	 * Resolve inscribed characters and returns it.
	 * 
	 * @param text The text.
	 * @return The text with resolved inscribed characters.
	 * @since 11
	 */
	private static resoveInscribedCharacter(text: java.lang.String| null):  java.lang.String | null {
		let  matcher: java.util.regex.Matcher = Sumerogram.inscribedCharacterPattern.matcher(text);

		let  buffer: java.lang.StringBuffer = new  java.lang.StringBuffer();
		while (matcher.find())
			matcher.appendReplacement(buffer, matcher.group(1) + Sumerogram.inscribedCharacter + matcher.group(3));
		matcher.appendTail(buffer);

		return buffer.toString();
	}

}
