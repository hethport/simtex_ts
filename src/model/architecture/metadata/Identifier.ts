/**
 * File:     Identifier.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core.metadata
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     06.12.2022
 */



import { java, S } from "../../../../../../../../../usr/bin/java";
import { Metadata } from "./Metadata";
import { LineSource } from "../LineSource";
import { StatusEvent } from "../StatusEvent";
import { StatusEventCode } from "../StatusEventCode";
import { StatusLevel } from "../StatusLevel";




/**
 * Define identifiers.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 * @since 11
 */
export  class Identifier extends Metadata {
	/**
	 * The identifiers.
	 */
	private readonly identifiers:  java.util.List<java.lang.String> | null = new  java.util.ArrayList();

	/**
	 * The comment.
	 */
	private readonly comment:  java.lang.String | null;

	/**
	 * Creates an identifier.
	 * 
	 * @param source The line source.
	 * @since 11
	 */
	public constructor(source: LineSource| null) {
		super(source);

		let  comment: java.lang.String = S``;

		let  textNormalized: java.lang.String = source.getTextNormalized();
		if (textNormalized.contains(S`#`)) {
			 let  index: number = textNormalized.indexOf(S`#`);

			comment = index + 1 < textNormalized.length() ? textNormalized.substring(index + 1) : S``;
			textNormalized = textNormalized.substring(0, index);
		}
		this.comment = comment.isBlank() ? null : comment.trim();

		let  identifiers: java.lang.String = textNormalized.length() === 1 ? S`` : textNormalized.substring(1).trim();
		for (let identifier of identifiers.split(S`\\+`))
			if (!identifier.isBlank())
				this.identifiers.add(identifier.trim());

		if (this.identifiers.isEmpty())
			this.getStatus()
					.add(new  StatusEvent(StatusLevel.severe, StatusEventCode.undefined, S`identification is undefined`));
	}

	/**
	 * Returns the identifiers.
	 *
	 * @return The identifiers.
	 * @since 11
	 */
	public getIdentifiers():  java.util.List<java.lang.String> | null {
		return new  java.util.ArrayList(this.identifiers);
	}

	/**
	 * Returns the comment.
	 *
	 * @return The comment.
	 * @since 11
	 */
	public getComment():  java.lang.String | null {
		return this.comment;
	}

}
