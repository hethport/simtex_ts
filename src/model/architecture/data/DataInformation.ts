/**
 * File:     DataInformation.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core.data
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     16.02.2023
 */


import { LineInformation } from './LineInformation';
import { ParagraphLanguageType } from '../metadata/ParagraphLanguageType';


/**
 * Information is an immutable class that defines information for data lines.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 * @since 11
 */
export  class DataInformation {
  /**
   * The paragraph language.
   */
  private readonly paragraphLanguage:  ParagraphLanguageType;

  /**
   * The line information.
   */
  private readonly line:  LineInformation;

  /**
   * Creates an information for a data line.
   *
   * @param paragraphLanguage The paragraph language.
   * @param linePrefix        The line prefix.
   * @param lineNumber        The line number.
   * @since 11
   */
  public constructor(paragraphLanguage: ParagraphLanguageType, linePrefix: string| null, lineNumber: string| null) {
    this.paragraphLanguage = paragraphLanguage;
    this.line = new  LineInformation(linePrefix, lineNumber);
  }

  /**
   * Returns true if the paragraph language is set.
   *
   * @return True if the paragraph language is set.
   * @since 11
   */
  public isParagraphLanguageSet():  boolean {
    return this.paragraphLanguage != null;
  }

  /**
   * Returns the paragraph language.
   *
   * @return The paragraph language.
   * @since 11
   */
  public getParagraphLanguage():  ParagraphLanguageType {
    return this.paragraphLanguage;
  }

  /**
   * Returns the line.
   *
   * @return The line.
   * @since 11
   */
  public getLine():  LineInformation {
    return this.line;
  }
}
