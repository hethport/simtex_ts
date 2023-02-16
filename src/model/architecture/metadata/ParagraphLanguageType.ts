/**
 * File:     ParagraphLanguageType.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core.metadata
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     16.02.2023
 */

import { java, S } from "../../../../../../../../../usr/bin/java";


 export class  ParagraphLanguageType extends java.lang.Enum<ParagraphLanguageType> {
	public static readonly Akk: ParagraphLanguageType = new class extends ParagraphLanguageType {
}(S`Akkadisch`,S`Akk`, 0); public static readonly Sum: ParagraphLanguageType = new class extends ParagraphLanguageType {
}(S`Sumerisch`,S`Sum`, 1); public static readonly Luw: ParagraphLanguageType = new class extends ParagraphLanguageType {
}(S`Luwisch`,S`Luw`, 2); public static readonly Pal: ParagraphLanguageType = new class extends ParagraphLanguageType {
}(S`Palaisch`,S`Pal`, 3); public static readonly Hur: ParagraphLanguageType = new class extends ParagraphLanguageType {
}(S`Hurritisch`,S`Hur`, 4); public static readonly Hat: ParagraphLanguageType = new class extends ParagraphLanguageType {
}(S`Hattisch`,S`Hat`, 5);
	public static readonly Hit: ParagraphLanguageType = new class extends ParagraphLanguageType {
}(S`Hethitisch`,S`Hit`, 6); public static readonly Ign: ParagraphLanguageType = new class extends ParagraphLanguageType {
}(S`unknown language`,S`Ign`, 7);

	/**
	 * The default language.
	 */
	public static readonly defaultLanguage:  ParagraphLanguageType | null = ParagraphLanguageType.Hit;

	/**
	 * The label.
	 */
	private readonly label:  java.lang.String | null;

	/**
	 * Creates a paragraph language type.
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
