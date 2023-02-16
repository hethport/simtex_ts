/**
 * File:     LinePrefix.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core.metadata
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     06.12.2022
 */



import { java, S } from "../../../../../../../../../usr/bin/java";
import { Metadata } from "./Metadata";
import { LineSource } from "../LineSource";




/**
 * Define line prefixes.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 * @since 11
 */
export  class LinePrefix extends Metadata {
	/**
	 * The prefix.
	 */
	private readonly prefix:  java.lang.String | null;

	/**
	 * Creates a line prefix.
	 * 
	 * @param source The line source.
	 * @since 11
	 */
	public constructor(source: LineSource| null) {
		super(source);

		let  characters: java.lang.String = source.getTextNormalized().isEmpty() ? S`` : source.getTextNormalized().substring(1);

		this.prefix = characters.isBlank() ? null : characters.trim();
	}

	/**
	 * Returns true if the prefix are set.
	 *
	 * @return True if the prefix are set.
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

}
