/**
 * File:     LanguageChange.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core.metadata
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     20.12.2022
 */



import { java, S } from "../../../../../../../../../usr/bin/java";
import { LanguageChangeType } from "./LanguageChangeType";
import { StatusEvent } from "../StatusEvent";
import { StatusEventCode } from "../StatusEventCode";
import { StatusLevel } from "../StatusLevel";
import { Fragment } from "./fragment/Fragment";




/**
 * Define language changes.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 * @since 11
 */
export  class LanguageChange extends Fragment {

	/**
	 * The language.
	 */
	private readonly language:  LanguageChangeType | null;

	/**
	 * Creates a language change.
	 * 
	 * @param text The text.
	 * @since 11
	 */
	public constructor(text: java.lang.String| null) {
		super(text);

		let  language: LanguageChangeType = null;

		 let  name: java.lang.String = text.length() === 1 ? S`` : text.substring(1);
		if (name.isBlank())
			this.getStatus().add(
					new  StatusEvent(StatusLevel.moderate, StatusEventCode.undefined, S`no language change defined`));
		else
			try {
				language = LanguageChangeType.valueOf(name);
			} catch (e) {
if (e instanceof java.lang.Exception) {
				this.getStatus().add(new  StatusEvent(StatusLevel.critical, StatusEventCode.unknown,
						S`language change '` + name + S`' is unknown`));
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
	public getLanguage():  LanguageChangeType | null {
		return this.language;
	}

}
