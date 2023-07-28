/**
 * File:     ParagraphLanguage.ts
 *
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     06.12.2022
 */

import {Metadata} from './Metadata';
import {defaultParagraphLanguage, ParagraphLanguageType} from './ParagraphLanguageType';
import {LineSource} from '../LineSource';
import {StatusEvent} from '../StatusEvent';
import {StatusEventCode} from '../StatusEventCode';
import {StatusLevel} from '../StatusLevel';
import {xmlElementNode, XmlNode, xmlTextNode} from 'simple_xml';

/**
 * Define paragraph languages.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 */
export class ParagraphLanguage extends Metadata {

  // TODO: implement correct export
  static readonly xmlTag: string = 'PARAGRAPH_LANGUAGE';

  /**
   * The language.
   */
  private readonly language: ParagraphLanguageType | null;

  /**
   * Creates a paragraph language.
   *
   * @param source The line source.
   */
  public constructor(source: LineSource) {
    super(source);

    let language: ParagraphLanguageType | null = null;

    const name: string = source.getTextNormalized().length == 1 ? '' : source.getTextNormalized().substring(1);
    if (name.trim().length == 0)
      this.getStatus().add(
        new StatusEvent(StatusLevel.info, StatusEventCode.undefined, 'no paragraph language defined'));
    else
      try {
        language = ParagraphLanguageType[name as keyof typeof ParagraphLanguageType];
      } catch (e) {
        this.getStatus().add(new StatusEvent(StatusLevel.critical, StatusEventCode.unknown, 'paragraph language \'' + name + '\' is unknown'));
      }

    this.language = language;
  }

  /**
   * Returns true if the language is set.
   *
   * @return True if the language is set.
   */
  public isLanguageSet(): boolean {
    return this.language !== null;
  }

  /**
   * Returns the language. Null if not set.
   *
   * @return The language.
   */
  public getLanguage(): ParagraphLanguageType | null {
    return this.language;
  }

  public exportXml(): XmlNode[] {
    const lang: ParagraphLanguageType = this.language == null ? defaultParagraphLanguage() : this.language;
    return [xmlElementNode(ParagraphLanguage.xmlTag, {}, [xmlTextNode(ParagraphLanguageType[lang])])];
  }
}
