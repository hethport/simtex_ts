/**
 * File:     LineSource.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     16.02.2023
 */

import { JavaObject, java, S } from "../../../../../../../../usr/bin/java";




/**
 * Defines source for lines.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 * @since 11
 */
export  class LineSource extends JavaObject {
	/**
	 * The number.
	 */
	private readonly number:  number;

	/**
	 * The text.
	 */
	private readonly text:  java.lang.String | null;

	/**
	 * The normalized text.
	 */
	private readonly textNormalized:  java.lang.String | null;

	/**
	 * Creates a source for a line.
	 * 
	 * @param number The number.
	 * @param text   The text.
	 * @since 11
	 */
	public constructor(number: number, text: java.lang.String| null) {
		super();

		this.number = number;
		this.text = text;

		this.textNormalized = LineSource.normalize(text);
	}

	/**
	 * Normalizes the text.
	 * 
	 * @param text The text to normalize.
	 * @return The normalized source text.
	 * @since 11
	 */
	public static normalize(text: java.lang.String| null):  java.lang.String | null {
		return text === null ? null
				: text.replaceAll(S`ŝ`, S`š`).replaceAll(S`Ŝ`, S`Š`)

						.replaceAll(S`┌`, S`⸢`).replaceAll(S`┐`, S`⸣`).replaceAll(S`⌈`, S`⸢`).replaceAll(S`⌉`, S`⸣`)

						.replaceAll(S`ĸ`, S`{K:}`).trim();
	}

	/**
	 * Returns the number.
	 *
	 * @return The number.
	 * @since 11
	 */
	public getNumber():  number {
		return this.number;
	}

	/**
	 * Returns the text.
	 *
	 * @return The text.
	 * @since 11
	 */
	public getText():  java.lang.String | null {
		return this.text;
	}

	/**
	 * Returns the normalized text.
	 *
	 * @return The normalized text.
	 * @since 11
	 */
	public getTextNormalized():  java.lang.String | null {
		return this.textNormalized;
	}
}
