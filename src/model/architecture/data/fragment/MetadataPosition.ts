/**
 * File:     MetadataPosition.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core.data.fragment
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     16.02.2023
 */

import { java, S } from "../../../../../../../../../../usr/bin/java";


 class  MetadataPosition extends java.lang.Enum<MetadataPosition> {
	public static readonly initial: MetadataPosition = new class extends MetadataPosition {
}(S`initial`, 0); public static readonly end: MetadataPosition = new class extends MetadataPosition {
}(S`final`,S`end`, 1); public static readonly unknown: MetadataPosition = new class extends MetadataPosition {
}(S`unknown`, 2);

	/**
	 * The label.
	 */
	private readonly label:  java.lang.String | null;

	/**
	 * Creates a position for a type.
	 * 
	 * @since 11
	 */
	private constructor(, $name$: java.lang.String, $index$: number);

	/**
	 * Creates a position for a type.
	 * 
	 * @param label The label.
	 * @since 11
	 */
	private constructor(label: java.lang.String| null, $name$: java.lang.String, $index$: number);
private constructor(label?: java.lang.String | null) {
if (label === undefined) {
		super($name$, $index$);
this.label = name();
	}
 else  {
		super($name$, $index$);
this.label = label;
	}

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
