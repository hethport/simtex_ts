/**
 * File:     Marker.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core.metadata
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     06.12.2022
 */



import { java, S } from "../../../../../../../../../usr/bin/java";
import { Metadata } from "./Metadata";
import { Tag } from "./Tag";
import { LineSource } from "../LineSource";
import { StatusEvent } from "../StatusEvent";
import { StatusEventCode } from "../StatusEventCode";
import { StatusLevel } from "../StatusLevel";




/**
 * Define markers.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 * @since 11
 */
export  class Marker extends Metadata {
	/**
	 * Defines the depth for nested curly braces in the tag pattern.
	 */
	private static readonly curlyBracketTagDepth:  number = 5;

	/**
	 * Defines a regular expression that does not match curly brackets.
	 */
	public static readonly notCurlyBracketPattern:  java.lang.String | null = S`[^\\{\\}]*`;

	/**
	 * The tag pattern.
	 */
	public static readonly tagPattern:  java.util.regex.Pattern | null = java.util.regex.Pattern
			.compile(S`\\{(/M|[MSGFK]{1}):` + Marker.getNestedCurlyBracketDepthPattern(Marker.curlyBracketTagDepth) + S`\\}`);

	/**
	 * Returns the regular expression that matches nested curly braces of the given
	 * depth.
	 * 
	 * @param depth The depth for matching with nested curly brackets.
	 * @return The regular expression that matches nested curly braces of the given
	 *         depth.
	 * @since 11
	 */
	private static getNestedCurlyBracketDepthPattern(depth: number):  java.lang.String | null {
		return depth === 1 ? S``
				: S`((` + Marker.notCurlyBracketPattern + S`|\\{` + Marker.notCurlyBracketPattern
						+ Marker.getNestedCurlyBracketDepthPattern(--depth) + S`\\}` + S`)*)`;
	}

	/**
	 * The tags.
	 */
	private readonly tags:  java.util.List<Tag> | null = new  java.util.ArrayList();

	/**
	 * Creates a marker.
	 * 
	 * @param source The line source.
	 * @since 11
	 */
	public constructor(source: LineSource| null) {
		super(source);

		let  buffer: java.lang.StringBuffer;

		// extract the tags and texts
		let  matcher: java.util.regex.Matcher = Marker.tagPattern.matcher(source.getTextNormalized());
		while (matcher.find()) {
			buffer = new  java.lang.StringBuffer();

			matcher.appendReplacement(buffer, S``);

			this.addUnexpectedStatusEvent(buffer);

			this.tags.add(new  Tag(matcher.group(0), matcher.group(1), matcher.group(2)));
		}

		buffer = new  java.lang.StringBuffer();
		matcher.appendTail(buffer);
		this.addUnexpectedStatusEvent(buffer);
	}

	/**
	 * Adds an unexpected status event if the segment is not empty.
	 * 
	 * @param buffer The buffer that contains the segment.
	 * @since 11
	 */
	private addUnexpectedStatusEvent(buffer: java.lang.StringBuffer| null):  void {
		let  segment: java.lang.String = buffer.toString();
		if (!segment.isBlank())
			this.getStatus().add(new  StatusEvent(StatusLevel.serious, StatusEventCode.unexpected,
					S`the segment '` + segment.trim() + S`' is not a marker.`));
	}

	/**
	 * Returns the tags.
	 *
	 * @return The tags.
	 * @since 11
	 */
	public getTags():  java.util.List<Tag> | null {
		return this.tags;
	}

}
