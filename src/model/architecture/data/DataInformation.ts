/**
 * File:     DataInformation.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core.data
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     16.02.2023
 */



import { JavaObject, java } from "../../../../../../../../../usr/bin/java";
import { LineInformation } from "./LineInformation";
import { ParagraphLanguageType } from "../metadata/ParagraphLanguageType";




/**
 * Information is an immutable class that defines information for data lines.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 * @since 11
 */
export  class DataInformation extends JavaObject {
	/**
	 * The paragraph language.
	 */
	private readonly paragraphLanguage:  ParagraphLanguageType | null;

	/**
	 * The line information.
	 */
	private readonly line:  LineInformation | null;

	/**
	 * Creates an information for a data line.
	 * 
	 * @param paragraphLanguage The paragraph language.
	 * @param linePrefix        The line prefix.
	 * @param lineNumber        The line number.
	 * @since 11
	 */
	public constructor(paragraphLanguage: ParagraphLanguageType| null, linePrefix: java.lang.String| null, lineNumber: java.lang.String| null) {
		super();

		this.paragraphLanguage = paragraphLanguage;
		this.line = new  LineInformation(linePrefix, lineNumber);
	}

	/**
	 * Returns true if the paragraph language is set.
	 *
	 * @return True if the paragraph language is set.
	 * @since 11
	 */
	public isParagraphLanguageSet():  boolean {
		return this.paragraphLanguage !== null;
	}

	/**
	 * Returns the paragraph language.
	 *
	 * @return The paragraph language.
	 * @since 11
	 */
	public getParagraphLanguage():  ParagraphLanguageType | null {
		return this.paragraphLanguage;
	}

	/**
	 * Returns the line.
	 *
	 * @return The line.
	 * @since 11
	 */
	public getLine():  LineInformation | null {
		return this.line;
	}

}
