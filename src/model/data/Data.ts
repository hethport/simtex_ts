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
import { ParagraphLanguageType, defaultParagraphLanguage } from '../metadata/ParagraphLanguageType';
import { Tag } from '../metadata/Tag';
import {LanguageChangeType} from './LanguageChangeType';
import {Attributes, xmlElementNode, XmlNode} from 'simple_xml';
import { InventoryNumber } from '../metadata/InventoryNumber';


/**
 * Define data lines for the TLH dig parser.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 * @since 11
 */
export  class Data extends Line {
  static readonly xmlTag: string = 'lb';
  /**
   * The space escape character.
   */
  static readonly spaceEscapeCharacter:  string = '⊕';

  /**
   * The space escape character.
   */
  static readonly spaceEscapeCharacterPattern:  RegExp = new RegExp(this.spaceEscapeCharacter, 'g');

  /**
   * The space pattern.
   */
  private static readonly spacePattern:  RegExp = new RegExp('([ ]+)', 'g');

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
   * @param inventoryNumber   The inventory number.
   * @param paragraphLanguage The paragraph language. If null, use default
   *                          language.
   * @param linePrefix        The line prefix.
   * @since 11
   */
  public constructor(source: LineSource, inventoryNumber: InventoryNumber | null, paragraphLanguage: ParagraphLanguageType | null, linePrefix: string| null) {
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
    
    this.information = new  DataInformation(inventoryNumber, paragraphLanguage, linePrefix, lineNumber);
    this.content = StatusLevel.ok == this.getStatus().getLevel() ? new  DataContent(lineSource, Data.parse(paragraphLanguage, lineSource))
      : new  DataContent(lineSource, null);

    /*
     * Updates word entities status and language change.
	 */
    let languageChange: LanguageChangeType | null = null;
    for (const entity of this.content.getEntities())
      if (entity instanceof Word) {
        const word: Word = entity as Word;
        this.getStatus().addLevel(word.getStatus());
				
        if (word.isLanguageChangeType())
          languageChange = word.getLanguageChangeType();
        else if (languageChange != null) {
          word.setLanguageChange(languageChange);
          languageChange = null;
        }			
      }
  }

  /**
   * Parses the line text.
   *
   * @param paragraphLanguage The paragraph language. If null, use default
   *                          language.
   * @param text The text to parse.
   * @return The entities.
   * @since 11
   */
  private static parse(paragraphLanguage: ParagraphLanguageType | null, text: string| null):  LineEntity[] {
    if (text == null || text.trim().length == 0)
      return [];
    else {
      if (paragraphLanguage == null)
        paragraphLanguage = defaultParagraphLanguage();
					
      // extract the tags and segments
      let entities: LineEntity[] = [];

      text = text.trim();
      const  matches = text.matchAll(Marker.tagPattern);
      let index = 0;
      for (const match of matches) {
        if (match.index && index < match.index) {
          entities = entities.concat(Data.parseSegment(paragraphLanguage, text.substring(index, match.index)));
        }
        entities.push(new Tag(match[0], match[1], match[2]));
        if (match.index != null) {  index = match.index + match[0].length;  }
      }

      if(index < text.length) {
        entities = entities.concat(Data.parseSegment(paragraphLanguage, text.substring(index)));
      }

      return entities;
    }
  }

  /**
   * Parses the segment and returns the respective entities.
   *
   * @param paragraphLanguage The paragraph language.
   * @param segment The segment to parse.
   * @return The entities.
   * @since 11
   */
  private static parseSegment(paragraphLanguage: ParagraphLanguageType, segment: string):  LineEntity[] {
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
        buffer.push(match[0].replace(/ /g, Data.spaceEscapeCharacter));
        if (match.index != null) {  index = match.index + match[0].length;  }
      }

      if(index < segment.length) {
        buffer.push(segment.substring(index));
      }

      // escape spaces after Akkadian prepositions
      matches = buffer.join('').matchAll(AkkadianPreposition.pattern);
      index = 0;
      buffer = [];
      for (const match of matches) {
        if (match.index && index < match.index) {
          buffer.push(segment.substring(index, match.index));
        }
        buffer.push(match[0].replace(/ /g, Data.spaceEscapeCharacter));
        if (match.index != null) {  index = match.index + match[0].length;  }
      }

      if(index < segment.length) {
        buffer.push(segment.substring(index));
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
          entities.push(this.getSegmentEntity(paragraphLanguage, wordBuffer.substring(index, match.index)));
        }
        entities.push(new Empty(match[1]));
        if (match.index != null) {  index = match.index + match[0].length;  }
      }

      if(index < wordBuffer.length) {
        entities.push(this.getSegmentEntity(paragraphLanguage, wordBuffer.substring(index)));
      }
      return entities;
    }

  }

  /**
   * Returns the segment entity for given text.
   *
   * @param paragraphLanguage The paragraph language.
   * @param text The buffer containing the text.
   * @return The segment entity.
   * @since 11
   */
  private static getSegmentEntity(paragraphLanguage: ParagraphLanguageType, text: string):  LineEntity {
    return '\\' == text ? new  Column() : new  Word(paragraphLanguage, text.replace(Data.spaceEscapeCharacterPattern, ' '));
  }

  /**
	 * Parses the data.
	 * 
	 * @param inventoryNumber   The inventory number.
	 * @param paragraphLanguage The paragraph language. If null, use default
	 *                          language.
	 * @param linePrefix        The line prefix.
	 * @param lineNumber        The line number.
	 * @param text              The text.
	 * @return
	 * @since 11
	 */
  public static parseData(inventoryNumber: InventoryNumber | null, paragraphLanguage: ParagraphLanguageType | null,
    linePrefix: string, lineNumber: string, text: string): Data {
    const  buffer: string[] = [];
    if (lineNumber != null)
      buffer.push(lineNumber);
    buffer.push('#');
    if (text != null)
      buffer.push(text);

    return new Data(new LineSource(1, buffer.join('')), inventoryNumber, paragraphLanguage, linePrefix);
  }

  /**
   * Parses the line content and returns the content.
   *
   * @param paragraphLanguage The paragraph language. If null, use default
   *                          language.
   * @param text The text to parse.
   * @return The content.
   * @since 11
   */
  public static parseContent(paragraphLanguage: ParagraphLanguageType | null, text: string):  DataContent {
    const  normalized: string = LineSource.normalize(text);

    return new  DataContent(normalized, Data.parse(paragraphLanguage == null ? defaultParagraphLanguage()
      : paragraphLanguage, normalized));
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

  /**
   * Returns a lineBreak <lb/> node with lineEntities after it
   *
   * @return The content.
   */
  public exportXml(): XmlNode[] {
    const entities: XmlNode[] = [];

    const attributes: Attributes = {};

    const inventoryNumber: InventoryNumber| null = this.information.getInventoryNumber();
    if (inventoryNumber != null && inventoryNumber.getIdentifiers().length > 0) {
      attributes['txtid'] = inventoryNumber.getIdentifiers()[0];
    }
    attributes['lnr'] = this.information.getLine().getFormatted();
    attributes['lg'] = ParagraphLanguageType[this.information.getParagraphLanguage()];

    // create new lineBreak <lb> Node, which contains lineInformation as attributes
    entities.push(xmlElementNode(Data.xmlTag, attributes, []));

    // add lineEntities after <lb> node
    for (const entity of this.content.getEntities()) {
      if (entity instanceof Word) {
        const word: Word =  entity as Word;
        if (!word.isLanguageChangeType()) {
          entities.push(word.exportXml());
        }
      } else {
        entities.push(entity.exportXml());
      }
    }

    return entities;
  }
}
