/**
 * File:     AkkadianPreposition.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core.data
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     20.12.2022
 */



import { java, S } from "../../../../../../../../../usr/bin/java";
import { Fragment } from "./fragment/Fragment";




/**
 * Defines Akkadian prepositions.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 * @since 11
 */
export  class AkkadianPreposition extends Fragment {
	/**
	 * The pattern for prepositions.
	 */
	protected static readonly pattern:  java.util.regex.Pattern | null = java.util.regex.Pattern
			.compile(S`\\b((_A\\-NA)|(_ANA)|(_I\\-NA)|(_IŠ\\-TU)|(_IT\\-TI)|(_PA-NI))([ ]+)`);

	/**
	 * The preposition.
	 */
	private readonly preposition:  java.lang.String | null;

	/**
	 * The number of leading whitespace.
	 */
	private readonly leadingWhitespace:  number;

	/**
	 * Creates a Akkadian preposition.
	 * 
	 * @param text The text.
	 * @since 11
	 */
	public constructor(text: java.lang.String| null) {
		super(text);

		text = text.substring(1);

		this.preposition = text.trim();
		this.leadingWhitespace = text.length() - this.preposition.length();
	}

	/**
	 * Returns the preposition.
	 *
	 * @return The preposition.
	 * @since 11
	 */
	public getPreposition():  java.lang.String | null {
		return this.preposition;
	}

	/**
	 * Returns the number of leading whitespace.
	 *
	 * @return The number of leading whitespace.
	 * @since 11
	 */
	public getLeadingWhitespace():  number {
		return this.leadingWhitespace;
	}

}
