/**
 * File:     Tag.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core.metadata
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     12.12.2022
 */



import { JavaObject, java, S } from "../../../../../../../../../usr/bin/java";
import { TagType } from "./TagType";
import { LineEntity } from "../LineEntity";




/**
 * Defines tags.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 * @since 11
 */
export  class Tag extends JavaObject implements LineEntity {

	/**
	 * The segment.
	 */
	private readonly segment:  java.lang.String | null;

	/**
	 * The type.
	 */
	private readonly type:  TagType | null;

	/**
	 * The content.
	 */
	private readonly content:  java.lang.String | null;

	/**
	 * Creates a tag.
	 * 
	 * @param segment The segment.
	 * @param type    The type.
	 * @param content The content.
	 * @since 11
	 */
	public constructor(segment: java.lang.String| null, type: java.lang.String| null, content: java.lang.String| null) {
		super();

		this.segment = segment;

		switch (type) {
		case S`M`:
			this.type = TagType.Mbegin;
			break;

		case S`/M`:
			this.type = TagType.Mend;
			break;

		default:
			this.type = TagType.valueOf(type);
			break;
		}

		this.content = content === null || content.isBlank() ? null : content.trim();
	}

	/**
	 * Returns the segment.
	 *
	 * @return The segment.
	 * @since 11
	 */
	public getSegment():  java.lang.String | null {
		return this.segment;
	}

	/**
	 * Returns the type.
	 *
	 * @return The type.
	 * @since 11
	 */
	public getType():  TagType | null {
		return this.type;
	}

	/**
	 * Returns true if the content is set.
	 *
	 * @return True if the content is set.
	 * @since 11
	 */
	public isContentSet():  boolean {
		return this.content !== null;
	}

	/**
	 * Returns the content.
	 *
	 * @return The content.
	 * @since 11
	 */
	public getContent():  java.lang.String | null {
		return this.content;
	}

}
