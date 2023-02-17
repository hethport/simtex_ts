/**
 * File:     Data.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core.data
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     06.12.2022
 */


import { AkkadianPreposition } from './AkkadianPreposition';
import { Column } from './Column';
import { DataContent } from './DataContent';
import { DataInformation } from './DataInformation';
import { DegreeSign } from './DegreeSign';
import { Empty } from './Empty';
import { Word } from './Word';
import { Line } from '../Line';
import { LineEntity } from '../LineEntity';
import { LineSource } from '../LineSource';
import { StatusEvent } from '../StatusEvent';
import { StatusEventCode } from '../StatusEventCode';
import { StatusLevel } from '../StatusLevel';
import { Marker } from '../metadata/Marker';
import { ParagraphLanguageType } from '../metadata/ParagraphLanguageType';
import { Tag } from '../metadata/Tag';




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
  static readonly spaceEscapeCharacter:  string = '⊕';

  /**
	 * The space pattern.
	 */
  private static readonly spacePattern:  RegExp = new RegExp('([ ]+)');

  /**
	 * The information.
	 */
  private readonly information:  DataInformation;

  /**
	 * The content.
	 */
  private readonly content:  DataContent;

  /**
	 * Creates a data line for the TLH dig parser.
	 * 
	 * @param source            The line source.
	 * @param paragraphLanguage The paragraph language.
	 * @param linePrefix        The line prefix.
	 * @since 11
	 */
  public constructor(source: LineSource, paragraphLanguage: ParagraphLanguageType, linePrefix: string| null) {
    super(source);

    let  lineNumber: string| null;
    let  lineSource: string;
    if (source == null || source.getTextNormalized() == null) {
      lineNumber = null;
      lineSource = '';

      this.getStatus().add(
        new  StatusEvent(StatusLevel.maximal, StatusEventCode.required, 'line source is not available'));
    } else {

      const  split: string[] = source.getTextNormalized().split('#', 2);

      if (split.length === 1) {
        lineNumber = null;
        lineSource = split[0];

        this.getStatus().add(new  StatusEvent(StatusLevel.critical, StatusEventCode.required,
          'line number is not available'));
      } else {
        lineNumber = split[0];
        lineSource = split[1];

        if (lineNumber.trim().length == 0)
          this.getStatus().add(new  StatusEvent(StatusLevel.minor, StatusEventCode.empty, 'line number is empty'));
      }
    }

    this.information = new  DataInformation(paragraphLanguage, linePrefix, lineNumber);
    this.content = StatusLevel.ok == this.getStatus().getLevel() ? new  DataContent(lineSource, Data.parse(lineSource))
      : new  DataContent(lineSource, null);

    for (const entity of this.content.getEntities())
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
  private static parse(text: string| null):  LineEntity[] {
    if (text == null || text.trim().length == 0)
      return [];
    else {
      // extract the tags and segments
      const  entities: LineEntity[] = [];

      text = text.trim();
      const  matches = text.matchAll(Marker.tagPattern);
      let index = 0;
      for (const match of matches) {
        if (match.index && index < match.index) {

          entities.push(Data.parseSegment(text.substring(index, match.index)));
        }
        entities.push(new Tag(match[0], match[1], match[2]));
        if (match.index != null) {  index = match.index + match[0].length;  }
      }

      if(index < text.length) {
        entities.push(Data.parseSegment(text.substring(index, text.length - 1)));
      }

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
  private static parseSegment(segment: string):  LineEntity[] {
    if (segment.trim().length == 0)
      return [new  Empty(segment)];
    else {
      /*
	   * escape required spaces to extract words
	   */

      // escape spaces in determinative and glossing
      let  matches = segment.matchAll(DegreeSign.pattern);
      let index = 0;
      let buffer: string[] = [];
      for (const match of matches) {
        if (match.index && index < match.index) {
          buffer.push(segment.substring(index, match.index));
        }
        buffer.push(match[0].replace(' ', Data.spaceEscapeCharacter));
        if (match.index != null) {  index = match.index + match[0].length;  }
      }

      if(index < segment.length) {
        buffer.push(segment.substring(index, segment.length - 1));
      }

      // escape spaces after Akkadian prepositions
      matches = buffer.join('').matchAll(AkkadianPreposition.pattern);
      index = 0;
      buffer = [];
      for (const match of matches) {
        if (match.index && index < match.index) {
          buffer.push(segment.substring(index, match.index));
        }
        buffer.push(match[0].replace(' ', Data.spaceEscapeCharacter));
        if (match.index != null) {  index = match.index + match[0].length;  }
      }

      if(index < segment.length) {
        buffer.push(segment.substring(index, segment.length - 1));
      }

      /*
	   * extract the words, restore spaces and parse
	   */
      const  entities: LineEntity[] = [];

      const wordBuffer = buffer.join('');
      matches = wordBuffer.matchAll(Data.spacePattern);
      index = 0;
      for (const match of matches) {
        if (match.index && index < match.index) {
          entities.push(this.getSegmentEntity(wordBuffer.substring(index, match.index)));
        }
        entities.push(new Empty(match[1]));
        if (match.index != null) {  index = match.index + match[0].length;  }
      }

      if(index < wordBuffer.length) {
        entities.push(this.getSegmentEntity(wordBuffer.substring(index, wordBuffer.length - 1)));
      }
      return entities;
    }

  }

  /**
	 * Returns the segment entity for given text.
	 * 
	 * @param text The buffer containing the text.
	 * @return The segment entity.
	 * @since 11
	 */
  private static getSegmentEntity(text: string):  LineEntity {
    return '\\' == text ? new  Column() : new  Word(text.replace(Data.spaceEscapeCharacter, ' '));
  }

  /**
	 * Parses the line content and returns the content.
	 * 
	 * @param text The text to parse.
	 * @return The content.
	 * @since 11
	 */
  public static parseContent(text: string):  DataContent {
    const  normalized: string = LineSource.normalize(text);

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
