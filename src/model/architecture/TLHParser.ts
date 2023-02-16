/**
 * File:     TLHParser.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     05.12.2022
 */

import { Line } from "./Line";
import { LineSource } from "./LineSource";
import { Status } from "./Status";
import { Data } from "./data/Data";
import { ParagraphLanguage } from "./metadata/ParagraphLanguage";
import { ParagraphLanguageType } from "./metadata/ParagraphLanguageType";
import { InventoryNumber } from "./metadata/InventoryNumber";
import { PublicationNumber } from "./metadata/PublicationNumber";
import { LinePrefix } from "./metadata/LinePrefix";
import { Marker } from "./metadata/Marker";




/**
 * Defines TLH dig parsers.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 * @since 11
 */
export  class TLHParser {
	/**
	 * The source text.
	 */
	private readonly sourceText:  String | null;

	/**
	 * The current paragraph language.
	 */
	private paragraphLanguage:  ParagraphLanguageType | null = ParagraphLanguageType.defaultLanguage;

	/**
	 * The status.
	 */
	private readonly status:  Status;

	/**
	 * The current line prefix.
	 */
	private linePrefix:  String;

	/**
	 * The lines.
	 */
	private lines:  Line[];

	/**
	 * The number.
	 */
	private number:  number = 0;

	/**
	 * Creates a TLH dig parser.
	 * 
	 * @param sourceText The source text.
	 * @since 11
	 */
	public constructor(sourceText: String) {

		this.sourceText = sourceText;

		if (sourceText !== null)
			sourceText.split('\n').forEach(line => this.addLine(line));

		for (let line of this.lines)
			this.status.addLevel(line.getStatus());
	}

	/**
	 * Add the source text line.
	 * 
	 * @param line The source text line to add.
	 * @since 11
	 */
	private addLine(line: String):  void {
		if (line.trim().length == 0)
			++this.number;
		else {
			let  source: LineSource = new  LineSource(++this.number, line);

			switch (source.getTextNormalized().substring(0, 1)) {
			case `&`:
				/*
				 * inventory number
				 */
				this.lines.push(new  InventoryNumber(source));

				this.linePrefix = null;

				break;

			case `$`:
				/*
				 * publication number
				 */
				this.lines.push(new  PublicationNumber(source));

				this.linePrefix = null;

				break;

			case `%`:
				/*
				 * line prefix
				 */
				let  prefix: LinePrefix = new  LinePrefix(source);
				this.lines.push(prefix);

				this.linePrefix = prefix.getPrefix();

				break;

			case `@`:
				/*
				 * paragraph language
				 */
				let  language: ParagraphLanguage = new  ParagraphLanguage(source);
				this.lines.push(language);

				if (language.isLanguageSet())
					this.paragraphLanguage = language.getLanguage();

				break;

			case `{`:
				/*
				 * marker
				 */
				let  marker: Marker = new  Marker(source);
				this.lines.push(marker);

				break;

			default:
				/*
				 * data
				 */
				this.lines.push(new  Data(source, this.paragraphLanguage, this.linePrefix));

				break;
			}
		}
	}

	/**
	 * Returns the status.
	 *
	 * @return The status.
	 * @since 11
	 */
	public getStatus():  Status | null {
		return this.status;
	}

	/**
	 * Returns the source text.
	 *
	 * @return The source text.
	 * @since 11
	 */
	public getSourceText():  String | null {
		return this.sourceText;
	}

	/**
	 * Returns the lines.
	 *
	 * @return The lines.
	 * @since 11
	 */
	public getLines():  Line[]{
		return this.lines;
	}
}
