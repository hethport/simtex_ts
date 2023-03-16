/**
 * File:     DataInformation.ts
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     16.02.2023
 */

import { LineInformation } from './LineInformation';
import { ParagraphLanguageType, defaultParagraphLanguage } from '../metadata/ParagraphLanguageType';
import { InventoryNumber } from '../metadata/InventoryNumber';

/**
 * Information is an immutable class that defines information for data lines.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 */
export  class DataInformation {
  /**
   * The inventory number.
   */
  private readonly inventoryNumber: InventoryNumber | null;

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
   * @param inventoryNumber   The inventory number.
   * @param paragraphLanguage The paragraph language.
   * @param linePrefix        The line prefix.
   * @param lineNumber        The line number.
   */
  public constructor(inventoryNumber: InventoryNumber | null, paragraphLanguage: ParagraphLanguageType| null, linePrefix: string| null, lineNumber: string| null) {
    this.inventoryNumber = inventoryNumber;
    this.paragraphLanguage = paragraphLanguage == null ? defaultParagraphLanguage()
      : paragraphLanguage;
    this.line = new  LineInformation(linePrefix, lineNumber);
  }

  /**
   * Returns the inventory number.
   *
   * @return The inventory number.
   */
  public getInventoryNumber(): InventoryNumber | null {
    return this.inventoryNumber;
  }

  /**
   * Returns the paragraph language.
   *
   * @return The paragraph language.
   */
  public getParagraphLanguage():  ParagraphLanguageType {
    return this.paragraphLanguage;
  }

  /**
   * Returns the line.
   *
   * @return The line.
   */
  public getLine():  LineInformation {
    return this.line;
  }
}
