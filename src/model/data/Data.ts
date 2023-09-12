/**
 * File:     Data.ts
 *
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     06.12.2022
 */

import {Column} from './Column';
import {DataContent} from './DataContent';
import {DataInformation} from './DataInformation';
import {DegreeSign} from './DegreeSign';
import {Empty} from './Empty';
import {Word} from './Word';
import {Line} from '../Line';
import {LineEntity} from '../LineEntity';
import {LineSource} from '../LineSource';
import {StatusEvent} from '../StatusEvent';
import {StatusEventCode} from '../StatusEventCode';
import {StatusLevel} from '../StatusLevel';
import {Marker} from '../metadata/Marker';
import {defaultParagraphLanguage, ParagraphLanguageType} from '../metadata/ParagraphLanguageType';
import {LanguageChangeType} from './LanguageChangeType';
import {Attributes, xmlElementNode, XmlNode} from 'simple_xml';
import {InventoryNumber} from '../metadata/InventoryNumber';
import {ParagraphSeparator} from './ParagraphSeparator';
import {Akkadogram} from './Akkadogram';
import {WordSeparator} from './WordSeparator';

/**
 * Define data lines for the TLH dig parser.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 */
export class Data extends Line {

  static readonly xmlTag: string = 'lb';

  /**
   * The space escape character.
   */
  static readonly spaceEscapeCharacter: string = '⊕';

  /**
   * The space escape character.
   */
  static readonly spaceEscapeCharacterPattern: RegExp = new RegExp(this.spaceEscapeCharacter, 'g');

  /**
   * The space pattern.
   */
  private static readonly spacePattern: RegExp = new RegExp('([ ]+)', 'g');

  /**
   * The information.
   */
  private readonly information: DataInformation;

  /**
   * The content.
   */
  private readonly content: DataContent;

  /**
   * Creates a data line for the TLH dig parser.
   *
   * @param source            The line source.
   * @param inventoryNumber   The inventory number.
   * @param paragraphLanguage The paragraph language. If null, use default
   *                          language.
   * @param linePrefix        The line prefix.
   */
  public constructor(source: LineSource, inventoryNumber: InventoryNumber | null, paragraphLanguage: ParagraphLanguageType | null, linePrefix: string | null) {
    super(source);

    let lineNumber: string | null;
    let lineSource: string;
    if (source == null) {
      lineNumber = null;
      lineSource = '';

      this.getStatus().add(
        new StatusEvent(StatusLevel.critical, StatusEventCode.required, 'line source is not available'));
    } else {
      const split: string[] = source.getTextNormalizedNotTrimmed().split('#', 2);

      if (split.length === 1) {
        lineNumber = null;
        lineSource = split[0];

        this.getStatus().add(new StatusEvent(StatusLevel.critical, StatusEventCode.required,
          'line number is not available'));
      } else {
        lineNumber = split[0];
        lineSource = split[1];

        if (lineNumber.trim().length == 0)
          this.getStatus().add(new StatusEvent(StatusLevel.info, StatusEventCode.empty, 'line number is empty'));
        
        if (lineSource.startsWith('~')) {
			this.setPartPreviousLine();
			lineSource = lineSource.substring(1);
		}
      }
    }

    this.information = new DataInformation(inventoryNumber, paragraphLanguage, linePrefix, lineNumber);
    this.content = StatusLevel.ok == this.getStatus().getLevel() ? new DataContent(lineSource, Data.parseParagraph(paragraphLanguage, lineSource))
      : new DataContent(lineSource, null);

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
   * Parses the line take into consideration paragraphs.
   *
   * @param paragraphLanguage The paragraph language. If null, use default
   *                          language.
   * @param text The text to parse.
   * @return The entities.
   */
  private static parseParagraph(paragraphLanguage: ParagraphLanguageType | null, text: string | null): LineEntity[] {
    if (text == null || text.length == 0)
      return [];
    else {
      let textTrim = text.trim();
      if (textTrim.length == 0)
        return text.length <= 2 ? [] : [new Empty(text.length - 2)];
      else {
        let entities: LineEntity[] = [];

        textTrim = text.trimStart();
        if (textTrim.length + 1 < text.length)
          entities.push(new Empty(text.length - (textTrim.length + 1)));

        textTrim = text.trimEnd();
        const emptyEnd: LineEntity | null = textTrim.length + 1 < text.length ? new Empty(text.length - (textTrim.length + 1)) : null;

        let paragraph: ParagraphSeparator | null = null;
        text = text.trim();
        for (const pattern of ParagraphSeparator.patternDoubles) {
          if (text.endsWith(pattern)) {
            paragraph = new ParagraphSeparator(false);
            text = text.substring(0, text.length - pattern.length);

            break;
          }
        }

        if (paragraph == null)
          for (const pattern of ParagraphSeparator.patternSingles) {
            if (text.endsWith(pattern)) {
              paragraph = new ParagraphSeparator(true);
              text = text.substring(0, text.length - pattern.length);

              break;
            }
          }

        entities = entities.concat(Data.parse(paragraphLanguage, text));

        textTrim = text.trimEnd();
        if (textTrim.length < text.length)
          entities.push(new Empty(text.length - textTrim.length));

        if (paragraph != null)
          entities.push(paragraph);

        if (emptyEnd != null)
          entities.push(emptyEnd);

        return entities;
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
   */
  private static parse(paragraphLanguage: ParagraphLanguageType | null, text: string | null): LineEntity[] {
    if (text == null || text.trim().length == 0)
      return [];
    else {
      if (paragraphLanguage == null)
        paragraphLanguage = defaultParagraphLanguage();

      // escape the tags
      text = text.trim();
      const matches = text.matchAll(Marker.tagPattern);
      let index = 0;
      const buffer: string[] = [];
      for (const match of matches) {
        if (match.index && index < match.index) {
          buffer.push(text.substring(index, match.index));
        }
        
        buffer.push(match[0].replace(/ /g, Data.spaceEscapeCharacter));
        
        if (match.index != null) {
          index = match.index + match[0].length;
        }
      }

      if (index < text.length) {
        buffer.push(text.substring(index));
      }

      return Data.parseSegment(paragraphLanguage, buffer.join(''));
    }
  }

  /**
   * Parses the segment and returns the respective entities.
   *
   * @param paragraphLanguage The paragraph language.
   * @param segment The segment to parse.
   * @return The entities.
   */
  private static parseSegment(paragraphLanguage: ParagraphLanguageType, segment: string): LineEntity[] {
    if (segment.trim().length == 0)
      return [new Empty(segment.length)];
    else {
      /*
	   * escape required spaces to extract words
	   */

      // escape spaces in determinative and glossing
      let matches = segment.matchAll(DegreeSign.pattern);
      let index = 0;
      let buffer: string[] = [];
      for (const match of matches) {
        if (match.index && index < match.index) {
          buffer.push(segment.substring(index, match.index));
        }
        buffer.push(match[0].replace(/ /g, Data.spaceEscapeCharacter));
        if (match.index != null) {
          index = match.index + match[0].length;
        }
      }

      if (index < segment.length) {
        buffer.push(segment.substring(index));
      }

      // escape spaces after Akkadian prepositions if paragraph language is Hethitisch
      if (ParagraphLanguageType.Hit == paragraphLanguage) {
        matches = buffer.join('').matchAll(Akkadogram.patternPreposition);
        index = 0;
        buffer = [];
        for (const match of matches) {
          if (match.index && index < match.index) {
            buffer.push(segment.substring(index, match.index));
          }

          buffer.push(match[0].replace(/ /g, Data.spaceEscapeCharacter));
          if (match.index != null) {
            index = match.index + match[0].length;
          }
        }

        if (index < segment.length) {
          buffer.push(segment.substring(index));
        }
      }

      /*
	   * extract the words, restore spaces and parse
	   */
      const entities: LineEntity[] = [];

      const wordBuffer = buffer.join('');
      matches = wordBuffer.matchAll(Data.spacePattern);
      index = 0;

      for (const match of matches) {
        if (match.index && index < match.index) {
          entities.push(this.getSegmentEntity(paragraphLanguage, wordBuffer.substring(index, match.index)));
        }
        entities.push(new Empty(match[1].length));
        if (match.index != null) {
          index = match.index + match[0].length;
        }
      }

      if (index < wordBuffer.length) {
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
   */
  private static getSegmentEntity(paragraphLanguage: ParagraphLanguageType, text: string): LineEntity {
	if ('\\' == text)
      return new Column();
    else if (':' == text || ';' == text || '|' == text)
      return new WordSeparator(text);
    else
      return Word.normalizeWord(new Word(paragraphLanguage, text.replace(Data.spaceEscapeCharacterPattern, ' ')));
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
   */
  public static parseData(inventoryNumber: InventoryNumber | null, paragraphLanguage: ParagraphLanguageType | null,
                          linePrefix: string, lineNumber: string, text: string): Data {
    const buffer: string[] = [];
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
   */
  public static parseContent(paragraphLanguage: ParagraphLanguageType | null, text: string): DataContent {
    const normalized: string = LineSource.normalize(text);

    return new DataContent(normalized, Data.parse(paragraphLanguage == null ? defaultParagraphLanguage()
      : paragraphLanguage, normalized));
  }

  /**
   * Returns the information.
   *
   * @return The information.
   */
  public getInformation(): DataInformation | null {
    return this.information;
  }

  /**
   * Returns the content.
   *
   * @return The content.
   */
  public getContent(): DataContent | null {
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

    const inventoryNumber: InventoryNumber | null = this.information.getInventoryNumber();
    if (inventoryNumber != null && inventoryNumber.getIdentifiers().length > 0) {
      attributes['txtid'] = inventoryNumber.getIdentifiers()[0] + (inventoryNumber.getIdentifiers().length == 1 ? '' : '+');
    }
    attributes['lnr'] = this.information.getLine().getFormatted();
    
    if (this.information.getParagraphLanguage() == ParagraphLanguageType.Ign)
      attributes['lg'] = 'ign';
    else
      attributes['lg'] = ParagraphLanguageType[this.information.getParagraphLanguage()];

    // create new lineBreak <lb> Node, which contains lineInformation as attributes
    entities.push(xmlElementNode(Data.xmlTag, attributes, []));

    // add lineEntities after <lb> node
    let index = 0;   
    for (const entity of this.content.getEntities()) {
      if (entity instanceof Word) {
        const word: Word = entity as Word;
        if (!word.isLanguageChangeType()) {
          entities.push(word.exportXml());
        }
      } else if (entity instanceof Empty) {
        // spaces of length 1 between words should not be inserted
        if (index == 0 || index == this.content.getEntities().length - 1 || entity.getLength() > 1)
          entities.push(xmlElementNode(Word.xmlTag, {}, [entity.exportXml()]));
      } else {
        entities.push(entity.exportXml());
      }
      
      index++;
    }

    return entities;
  }
}
