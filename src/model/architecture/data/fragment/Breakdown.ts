/**
 * File:     Breakdown.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core.data.fragment
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     16.02.2023
 */



import { java } from "../../../../../../../../../../usr/bin/java";
import { Fragment } from "./Fragment";
import { MetadataPosition } from "./MetadataPosition";
import { Split } from "./Split";




/**
 * Defines breakdowns. The delimiters are removed.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 * @since 11
 */
export  class Breakdown extends Fragment {
	/**
	 * The splits.
	 */
	private readonly splits:  java.util.List<Split> | null = new  java.util.ArrayList();

	/**
	 * The deleri ('*' / erased / Rasur) position.
	 */
	private deleriPosition:  MetadataPosition | null;

	/**
	 * Creates a breakdown.
	 * 
	 * @param deleriPosition The deleri ('*' / erased / Rasur) position.
	 * @param text           The text. If null, do not normalize.
	 * @since 11
	 */
	public constructor(deleriPosition: MetadataPosition| null, text: java.lang.String| null) {
		super(text);

		if (text !== null) {
			let  matcher: java.util.regex.Matcher = Split.pattern.matcher(text);

			while (matcher.find())
				if (!matcher.group(1).isEmpty()) {
					let  split: Split = new  Split(this.getStatus(), deleriPosition, matcher.group(1));
					this.splits.add(split);

					deleriPosition = split.getDeleriPosition();
				}
		}

		this.deleriPosition = deleriPosition;
	}

	/**
	 * Returns the deleri ('*' / erased / Rasur) position.
	 *
	 * @return The deleri ('*' / erased / Rasur) position.
	 * @since 11
	 */
	public getDeleriPosition():  MetadataPosition | null {
		return this.deleriPosition;
	}

	/**
	 * Returns the splits.
	 *
	 * @return The splits.
	 * @since 11
	 */
	public getSplits():  java.util.List<Split> | null {
		return this.splits;
	}

	/**
	 * Returns the plain text.
	 *
	 * @return The plain text.
	 * @since 11
	 */
	public getPlainText():  java.lang.String | null {
		let  buffer: java.lang.StringBuffer = new  java.lang.StringBuffer();

		for (let split of this.splits)
			buffer.append(split.getMainPartPlainText());

		return buffer.toString();
	}

}
