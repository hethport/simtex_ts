/**
 * File:     Data.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core.data
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     06.12.2022
 */



import { java, S } from "../../../../../../../../../usr/bin/java";
import { AkkadianPreposition } from "./AkkadianPreposition";
import { Column } from "./Column";
import { DataContent } from "./DataContent";
import { DataInformation } from "./DataInformation";
import { DegreeSign } from "./DegreeSign";
import { Empty } from "./Empty";
import { Word } from "./Word";
import { Line } from "../Line";
import { LineEntity } from "../LineEntity";
import { LineSource } from "../LineSource";
import { StatusEvent } from "../StatusEvent";
import { StatusEventCode } from "../StatusEventCode";
import { StatusLevel } from "../StatusLevel";
import { Marker } from "../metadata/Marker";
import { ParagraphLanguageType } from "../metadata/ParagraphLanguageType";
import { Tag } from "../metadata/Tag";




/**
 * Define data lines for the TLH dig parser.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 * @since 11
 */
export  class Data extends Line {
	/**
	 * The space escape character.
	 */
	protected static readonly spaceEscapeCharacter:  java.lang.String | null = S`⊕`;

	/**
	 * The space pattern.
	 */
	private static readonly spacePattern:  java.util.regex.Pattern | null = java.util.regex.Pattern.compile(S`([ ]+)`);

	/**
	 * The information.
	 */
	private readonly information:  DataInformation | null;

	/**
	 * The content.
	 */
	private readonly content:  DataContent | null;

	/**
	 * Creates a data line for the TLH dig parser.
	 * 
	 * @param source            The line source.
	 * @param paragraphLanguage The paragraph language.
	 * @param linePrefix        The line prefix.
	 * @since 11
	 */
	public constructor(source: LineSource| null, paragraphLanguage: ParagraphLanguageType| null, linePrefix: java.lang.String| null) {
		super(source);

		let  lineNumber: java.lang.String;
		let  lineSource: java.lang.String;
		if (source === null || source.getTextNormalized() === null) {
			lineNumber = null;
			lineSource = null;

			this.getStatus().add(
					new  StatusEvent(StatusLevel.maximal, StatusEventCode.required, S`line source is not available`));
		} else {

			let  split: java.lang.String[] = source.getTextNormalized().split(S`#`, 2);

			if (split.length === 1) {
				lineNumber = null;
				lineSource = split[0];

				this.getStatus().add(new  StatusEvent(StatusLevel.critical, StatusEventCode.required,
						S`line number is not available`));
			} else {
				lineNumber = split[0];
				lineSource = split[1];

				if (lineNumber.isBlank())
					this.getStatus().add(new  StatusEvent(StatusLevel.minor, StatusEventCode.empty, S`line number is empty`));
			}
		}

		this.information = new  DataInformation(paragraphLanguage, linePrefix, lineNumber);
		this.content = StatusLevel.ok.equals(this.getStatus().getLevel()) ? new  DataContent(lineSource, Data.parse(lineSource))
				: new  DataContent(lineSource);

		for (let entity of this.content.getEntities())
			if (entity instanceof Word)
				this.getStatus().addLevel(( entity as Word).getStatus());
	}

	/**
	 * Parses the line text.
	 * 
	 * @param text The text to parse.
	 * @return The entities.
	 * @since 11
	 */
	private static parse(text: java.lang.String| null):  java.util.List<LineEntity> | null {
		if (text === null || text.isBlank())
			return new  java.util.ArrayList();
		else {
			// extract the tags and segments
			let  entities: java.util.List<LineEntity> = new  java.util.ArrayList();

			let  matcher: java.util.regex.Matcher = Marker.tagPattern.matcher(text.trim());

			let  buffer: java.lang.StringBuffer;
			while (matcher.find()) {
				buffer = new  java.lang.StringBuffer();

				matcher.appendReplacement(buffer, S``);

				if (buffer.length() > 0)
					entities.addAll(Data.parseSegment(buffer.toString()));

				entities.add(new  Tag(matcher.group(0), matcher.group(1), matcher.group(2)));
			}

			buffer = new  java.lang.StringBuffer();
			matcher.appendTail(buffer);
			if (buffer.length() > 0)
				entities.addAll(Data.parseSegment(buffer.toString()));

			return entities;
		}
	}

	/**
	 * Parses the segment and returns the respective entities.
	 * 
	 * @param segment The segment to parse.
	 * @return The entities.
	 * @since 11
	 */
	private static parseSegment(segment: java.lang.String| null):  java.util.List<LineEntity> | null {
		if (segment.isBlank())
			return java.util.Arrays.asList(new  Empty(segment));
		else {
			/*
			 * escape required spaces to extract words
			 */

			// escape spaces in determinative and glossing
			let  matcher: java.util.regex.Matcher = DegreeSign.pattern.matcher(segment);

			let  buffer: java.lang.StringBuffer = new  java.lang.StringBuffer();
			while (matcher.find())
				matcher.appendReplacement(buffer, matcher.group(0).replaceAll(S` `, Data.spaceEscapeCharacter));
			matcher.appendTail(buffer);

			// escape spaces after Akkadian prepositions
			matcher = AkkadianPreposition.pattern.matcher(buffer.toString());

			buffer = new  java.lang.StringBuffer();
			while (matcher.find())
				matcher.appendReplacement(buffer, matcher.group(0).replaceAll(S` `, Data.spaceEscapeCharacter));
			matcher.appendTail(buffer);

			/*
			 * extract the words, restore spaces and parse
			 */
			let  entities: java.util.List<LineEntity> = new  java.util.ArrayList();

			matcher = Data.spacePattern.matcher(buffer.toString());

			while (matcher.find()) {
				buffer = new  java.lang.StringBuffer();
				matcher.appendReplacement(buffer, S``);

				if (buffer.length() > 0)
					entities.add(Data.getSegmentEntity(buffer));

				entities.add(new  Empty(matcher.group(1)));
			}
			buffer = new  java.lang.StringBuffer();
			matcher.appendTail(buffer);
			if (buffer.length() > 0)
				entities.add(Data.getSegmentEntity(buffer));

			return entities;
		}

	}

	/**
	 * Returns the segment entity for given text.
	 * 
	 * @param buffer The buffer containing the text.
	 * @return The segment entity.
	 * @since 11
	 */
	private static getSegmentEntity(buffer: java.lang.StringBuffer| null):  LineEntity | null {
		 let  text: java.lang.String = buffer.toString();

		return S`\\`.equals(text) ? new  Column(text) : new  Word(text.replaceAll(Data.spaceEscapeCharacter, S` `));
	}

	/**
	 * Parses the line content and returns the content.
	 * 
	 * @param text The text to parse.
	 * @return The content.
	 * @since 11
	 */
	public static parseContent(text: java.lang.String| null):  DataContent | null {
		 let  normalized: java.lang.String = LineSource.normalize(text);

		return new  DataContent(normalized, Data.parse(normalized));
	}

	/**
	 * Returns the information.
	 *
	 * @return The information.
	 * @since 11
	 */
	public getInformation():  DataInformation | null {
		return this.information;
	}

	/**
	 * Returns the content.
	 *
	 * @return The content.
	 * @since 11
	 */
	public getContent():  DataContent | null {
		return this.content;
	}

}
