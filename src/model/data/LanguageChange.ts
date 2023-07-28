/**
 * File:     LanguageChange.ts
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     20.12.2022
 */

import {LanguageChangeType} from './LanguageChangeType';
import {StatusEvent} from '../StatusEvent';
import {StatusEventCode} from '../StatusEventCode';
import {StatusLevel} from '../StatusLevel';
import {Fragment} from './fragment/Fragment';
import {xmlElementNode, XmlElementNode} from 'simple_xml';

/**
 * Define language changes.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 */
export  class LanguageChange extends Fragment {
  // TODO: implement correct export
  public static readonly xmlTag: string = 'LANGUAGE_CHANGE';
  
  /**
   * The language.
   */
  private readonly language:  LanguageChangeType | null;

  /**
   * Creates a language change.
   *
   * @param text The text.
   */
  public constructor(text: string) {
    super(text);

    let  language: LanguageChangeType|null = null;

    const  name: string = text.length === 1 ? '' : text.substring(1);
    if (name.trim().length == 0)
      this.getStatus().add(
        new  StatusEvent(StatusLevel.info, StatusEventCode.undefined, 'no language change defined'));
    else
      try {
        language = LanguageChangeType[name as keyof typeof LanguageChangeType];
      } catch (e) {
        this.getStatus().add(new  StatusEvent(StatusLevel.critical, StatusEventCode.unknown, 'language change \'' + name + '\' is unknown'));

      }

    this.language = language;
  }

  /**
   * Returns true if the language is set.
   *
   * @return True if the language is set.
   */
  public isLanguageSet():  boolean {
    return this.language !== null;
  }

  /**
   * Returns the language. Null if not set.
   *
   * @return The language.
   */
  public getLanguage():  LanguageChangeType | null {
    return this.language;
  }
  
  public exportXml(): XmlElementNode {
    return xmlElementNode(LanguageChange.xmlTag, {}, []);
  }
}
