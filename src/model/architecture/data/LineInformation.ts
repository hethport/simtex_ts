/**
 * File:     LineInformation.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core.data
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     16.02.2023
 */

import { JavaObject, java, S } from "../../../../../../../../../usr/bin/java";




/**
 * LineInformation is an immutable class that defines line information for data
 * lines.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 * @since 11
 */
export  class LineInformation extends JavaObject {
	/**
	 * The prefix.
	 */
	private readonly prefix:  java.lang.String | null;

	/**
	 * The number.
	 */
	private readonly number:  java.lang.String | null;

	/**
	 * Creates a line information.
	 * 
	 * @param prefix The prefix.
	 * @param number The number.
	 * @since 11
	 */
	public constructor(prefix: java.lang.String| null, number: java.lang.String| null) {
		super();
		this.prefix = prefix;
		this.number = LineInformation.normalizeNumber(number);
	}

	/**
	 * Normalizes the line number.
	 * 
	 * @param number The line number to normalize.
	 * @return The normalized line number.
	 * @since 11
	 */
	public static normalizeNumber(number: java.lang.String| null):  java.lang.String | null {
		return number === null ? null
				: number.replaceAll(S`'`, S`′`).replaceAll(S`’`, S`′`).replaceAll(S`ʹʹʹʹ'`, S`⁗`).replaceAll(S`ʹʹʹ`, S`‴`)
						.replaceAll(S`ʹʹ`, S`″`).replaceAll(S`ʹ`, S`′`).trim();
	}

	/**
	 * Returns true if the prefix is set.
	 *
	 * @return True if the prefix is set.
	 * @since 11
	 */
	public isPrefixSet():  boolean {
		return this.prefix !== null;
	}

	/**
	 * Returns the prefix.
	 *
	 * @return The prefix.
	 * @since 11
	 */
	public getPrefix():  java.lang.String | null {
		return this.prefix;
	}

	/**
	 * Returns true if the number is set.
	 *
	 * @return True if the number is set.
	 * @since 11
	 */
	public isNumberSet():  boolean {
		return this.number !== null;
	}

	/**
	 * Returns the number.
	 *
	 * @return The number.
	 * @since 11
	 */
	public getNumber():  java.lang.String | null {
		return this.number;
	}
}
