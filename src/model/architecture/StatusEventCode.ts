/**
 * File:     StatusEventCode.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     16.02.2023
 */

import { java, S } from "../../../../../../../../usr/bin/java";


 class  StatusEventCode extends java.lang.Enum<StatusEventCode> {
	public static readonly required: StatusEventCode = new class extends StatusEventCode {
}(1, S`missing object`,S`required`, 0); public static readonly unexpected: StatusEventCode = new class extends StatusEventCode {
}(2, S`unexpected object`,S`unexpected`, 1); public static readonly empty: StatusEventCode = new class extends StatusEventCode {
}(3, S`empty value`,S`empty`, 2);
	public static readonly undefined: StatusEventCode = new class extends StatusEventCode {
}(3, S`undefined value`,S`undefined`, 3); public static readonly unknown: StatusEventCode = new class extends StatusEventCode {
}(4, S`unknown value`,S`unknown`, 4); public static readonly malformed: StatusEventCode = new class extends StatusEventCode {
}(5, S`malformed value`,S`malformed`, 5);
	public static readonly trim: StatusEventCode = new class extends StatusEventCode {
}(5, S`leading and/or trailing spaces`,S`trim`, 6);

	/**
	 * The number.
	 */
	private readonly number:  number;

	/**
	 * The description.
	 */
	private readonly description:  java.lang.String | null;

	/**
	 * Creates a code.
	 * 
	 * @param number      The number.
	 * @param description The description.
	 * @since 11
	 */
	private constructor(number: number, description: java.lang.String| null, $name$: java.lang.String, $index$: number) {
		super($name$, $index$);
this.number = number;
		this.description = description;
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
	 * Returns the description.
	 *
	 * @return The description.
	 * @since 11
	 */
	public getDescription():  java.lang.String | null {
		return this.description;
	}

}
