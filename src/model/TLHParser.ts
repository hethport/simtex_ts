/**
 * File:     TLHParser.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core
 *
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     05.12.2022
 */

import {Line} from './Line';
import {LineSource} from './LineSource';
import {Status} from './Status';
import {Data} from './data/Data';
import {ParagraphLanguage} from './metadata/ParagraphLanguage';
import {defaultParagraphLanguage, ParagraphLanguageType} from './metadata/ParagraphLanguageType';
import {InventoryNumber} from './metadata/InventoryNumber';
import {PublicationNumber} from './metadata/PublicationNumber';
import {LinePrefix} from './metadata/LinePrefix';
import {Marker} from './metadata/Marker';
import {XmlNode} from 'simple_xml';
import {StatusLevel} from './StatusLevel';

/**
 * Defines TLH dig parsers.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 * @since 11
 */
export class TLHParser {
  /**
   * The source text.
   */
  private readonly sourceText: string = '';

  /**
   * The current paragraph language.
   */
  private paragraphLanguage: ParagraphLanguageType = defaultParagraphLanguage();

  /**
   * The status.
   */
  private readonly status: Status = new Status();

  /**
	 * The current inventory number.
	 */
  private inventoryNumber: InventoryNumber | null = null;

  /**
   * The current line prefix.
   */
  private linePrefix: string | null = null;

  /**
   * The lines.
   */
  private lines: Line[] = [];

  /**
   * The number.
   */
  private number = 0;

  /**
   * Creates a TLH dig parser.
   *
   * @param sourceText The source text.
   * @since 11
   */
  public constructor(sourceText: string) {

    this.sourceText = sourceText;

    if (sourceText !== null)
      sourceText.replace('\r', '').split('\n').forEach(line => this.addLine(line));

    for (const line of this.lines)
      this.status.addLevel(line.getStatus());
  }

  /**
   * Add the source text line.
   *
   * @param line The source text line to add.
   * @since 11
   */
  private addLine(line: string): void {
    if (line.trim().length == 0)
      ++this.number;
    else {
      const source: LineSource = new LineSource(++this.number, line);

      let prefix: LinePrefix;
      let language: ParagraphLanguage;
      let marker: Marker;
      switch (source.getTextNormalized().substring(0, 1)) {
      case '&':
        /*
         * inventory number
         */
        this.inventoryNumber = new InventoryNumber(source);
        this.lines.push(this.inventoryNumber);

        this.linePrefix = null;

        break;

      case '$':
        /*
         * publication number
         */
        this.lines.push(new PublicationNumber(source));

        this.linePrefix = null;

        break;

      case '%':
        /*
         * line prefix
         */

        prefix = new LinePrefix(source);
        this.lines.push(prefix);

        this.linePrefix = prefix.getPrefix();

        break;

      case '@':
        /*
         * paragraph language
         */
        language = new ParagraphLanguage(source);
        this.lines.push(language);

        // eslint-disable-next-line no-case-declarations
        const planguage = language.getLanguage();
        if (planguage != null)
          this.paragraphLanguage = planguage;

        break;

      case '{':
        /*
         * marker
         */
        marker = new Marker(source);
        this.lines.push(marker);

        break;

      default:
        /*
         * data
         */
        this.lines.push(new Data(source, this.inventoryNumber, this.paragraphLanguage, this.linePrefix));

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
  public getStatus(): Status {
    return this.status;
  }

  /**
   * Returns the source text.
   *
   * @return The source text.
   * @since 11
   */
  public getSourceText(): string | null {
    return this.sourceText;
  }

  /**
   * Returns the lines.
   *
   * @return The lines.
   * @since 11
   */
  public getLines(): Line[] {
    return this.lines;
  }

  public exportXML(): XmlNode[][] {
    const nodes: XmlNode[][] = [];

    for (const line of this.lines) {
      nodes.push(line.exportXml());
    }

    return nodes;
  }
  
  /**
   * Exports the TLH dig parser to OXTED.
   *
   * @return The OXTED interface.
   * @since 11
   */
  public exportOXTED(): OXTED {
    return new OXTED(this);
  }
}

/*
 * OXTED is an immutable class that defines TLH dig parser interfaces for OXTED.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 * @since 11
 */
export class OXTED {
  /**
   * The status level.
   */
  private readonly statusLevel: StatusLevel;

  /**
   * The lines.
   */
  private readonly lines: OXTEDLine[] = [];

  /**
   * Creates an interfaces to OXTED.
   *
   * @param parser The TLH dig parser.
   * @since 11
   */
  public constructor(parser: TLHParser) {
    this.statusLevel = parser.getStatus().getLevel();

    for (const line of parser.getLines())
      this.lines.push(new OXTEDLine(line));
  }

  /**
   * Returns the status level.
   *
   * @return The status level.
   * @since 11
   */
  public getStatusLevel(): StatusLevel {
    return this.statusLevel;
  }

  /**
   * Returns the lines.
   *
   * @return The lines.
   * @since 11
   */
  public getLines(): OXTEDLine[] {
    return this.lines;
  }

}

/*
 * OXTEDLine is an immutable class that defines lines for OXTED interfaces.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 * @since 11
 */
export class OXTEDLine {
  /**
   * The status.
   */
  private readonly status: Status = new Status();
  
  /**
   * The text.
   */
  private readonly text: string;

  /**
   * The status.
   */
  private readonly nodes: XmlNode[];

  /**
   * Creates an interfaces to OXTED.
   *
   * @param line The line.
   * @since 11
   */
  public constructor(line: Line) {
    this.status = line.getStatus();
    this.text = line.getSource().getText();
    this.nodes = line.exportXml();
  }

  /**
   * Returns the status.
   *
   * @return The status.
   * @since 11
   */
  public getStatus(): Status {
    return this.status;
  }

  /**
   * Returns the text.
   *
   * @return The text.
   * @since 11
   */
  public getText(): string {
    return this.text;
  }

  /**
   * Returns the nodes.
   *
   * @return The nodes.
   * @since 11
   */
  public getNodes(): XmlNode[] {
    return this.nodes;
  }


}
