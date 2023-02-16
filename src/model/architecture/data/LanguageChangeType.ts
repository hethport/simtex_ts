/**
 * File:     LanguageChangeType.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core.data
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     16.02.2023
 */

import { java, S } from "../../../../../../../../../usr/bin/java";


 class  LanguageChangeType extends java.lang.Enum<LanguageChangeType> {
	public static readonly a: LanguageChangeType = new class extends LanguageChangeType {
}(S`Akkadisch`,S`a`, 0); public static readonly s: LanguageChangeType = new class extends LanguageChangeType {
}(S`Sumerisch`,S`s`, 1); public static readonly l: LanguageChangeType = new class extends LanguageChangeType {
}(S`Luwisch`,S`l`, 2); public static readonly p: LanguageChangeType = new class extends LanguageChangeType {
}(S`Palaisch`,S`p`, 3); public static readonly hu: LanguageChangeType = new class extends LanguageChangeType {
}(S`Hurritisch`,S`hu`, 4); public static readonly ha: LanguageChangeType = new class extends LanguageChangeType {
}(S`Hattisch`,S`ha`, 5); public static readonly h: LanguageChangeType = new class extends LanguageChangeType {
}(S`Hethitisch`,S`h`, 6);

	/**
	 * The label.
	 */
	private readonly label:  java.lang.String | null;

	/**
	 * Creates a language.
	 * 
	 * @param label The label.
	 * @since 11
	 */
	private constructor(label: java.lang.String| null, $name$: java.lang.String, $index$: number) {
		super($name$, $index$);
this.label = label;
	}

	/**
	 * Returns the label.
	 *
	 * @return The label.
	 * @since 11
	 */
	public getLabel():  java.lang.String | null {
		return this.label;
	}
}
