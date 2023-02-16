/**
 * File:     Empty.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core.data
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     12.12.2022
 */



import { JavaObject, java } from "../../../../../../../../../usr/bin/java";
import { LineEntity } from "../LineEntity";




/**
 * Defines empty strings or code points containing only spaces.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 * @since 11
 */
export  class Empty extends JavaObject implements LineEntity {
	/**
	 * The length of the code points containing only spaces. 0 if the string is
	 * empty.
	 */
	private readonly length:  number;

	/**
	 * Creates an empty string or a code point containing only spaces.
	 * 
	 * @param text The text.
	 * @since 11
	 */
	public constructor(text: java.lang.String| null) {
		super();

		this.length = text.length();
	}

	/**
	 * Returns the length.
	 *
	 * @return The length.
	 * @since 11
	 */
	public getLength():  number {
		return this.length;
	}

}
