/**
 * File:     ParagraphLanguage.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core.metadata
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     06.12.2022
 */



import { java, S } from "../../../../../../../../../usr/bin/java";
import { Metadata } from "./Metadata";
import { ParagraphLanguageType } from "./ParagraphLanguageType";
import { LineSource } from "../LineSource";
import { StatusEvent } from "../StatusEvent";
import { StatusEventCode } from "../StatusEventCode";
import { StatusLevel } from "../StatusLevel";




/**
 * Define paragraph languages.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 * @since 11
 */
export  class ParagraphLanguage extends Metadata {

	/**
	 * The language.
	 */
	private readonly language:  ParagraphLanguageType | null;

	/**
	 * Creates a paragraph language.
	 * 
	 * @param source The line source.
	 * @since 11
	 */
	public constructor(source: LineSource| null) {
		super(source);

		let  language: ParagraphLanguageType = null;

		 let  name: java.lang.String = source.getTextNormalized().length() === 1 ? S`` : source.getTextNormalized().substring(1);
		if (name.isBlank())
			this.getStatus().add(
					new  StatusEvent(StatusLevel.moderate, StatusEventCode.undefined, S`no paragraph language defined`));
		else
			try {
				language = ParagraphLanguageType.valueOf(name);
			} catch (e) {
if (e instanceof java.lang.Exception) {
				this.getStatus().add(new  StatusEvent(StatusLevel.critical, StatusEventCode.unknown,
						S`paragraph language '` + name + S`' is unknown`));
			} else {
	throw e;
	}
}

		this.language = language;
	}

	/**
	 * Returns true if the language is set.
	 *
	 * @return True if the language is set.
	 * @since 11
	 */
	public isLanguageSet():  boolean {
		return this.language !== null;
	}

	/**
	 * Returns the language. Null if not set.
	 *
	 * @return The language.
	 * @since 11
	 */
	public getLanguage():  ParagraphLanguageType | null {
		return this.language;
	}

}
