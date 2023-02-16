/**
 * File:     TagType.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core.metadata
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     16.02.2023
 */

import { java, S } from "../../../../../../../../../usr/bin/java";


 class  TagType extends java.lang.Enum<TagType> {
	public static readonly S: TagType = new class extends TagType {
}(S`sign`,S`S`, 0); public static readonly G: TagType = new class extends TagType {
}(S`text gap`,S`G`, 1); public static readonly F: TagType = new class extends TagType {
}(S`footnote`,S`F`, 2); public static readonly K: TagType = new class extends TagType {
}(S`colon`,S`K`, 3); public static readonly Mbegin: TagType = new class extends TagType {
}(S`begin marker`,S`Mbegin`, 4); public static readonly Mend: TagType = new class extends TagType {
}(S`end marker`,S`Mend`, 5);

	/**
	 * The label.
	 */
	private readonly label:  java.lang.String | null;

	/**
	 * Creates a tag type.
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
