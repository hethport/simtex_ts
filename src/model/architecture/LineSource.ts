/**
 * File:     LineSource.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core
 *
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     16.02.2023
 */


/**
 * Defines source for lines.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 * @since 11
 */
export class LineSource {

  /**
   * The normalized text.
   */
  private readonly textNormalized: string;

  /**
   * Creates a source for a line.
   *
   * @param number The number.
   * @param text   The text.
   * @since 11
   */
  public constructor(
    /**
     * The number.
     */
    private readonly number: number,
    /**
     * The text.
     */
    private readonly text: string
  ) {
    this.textNormalized = LineSource.normalize(text);
  }

  /**
   * Normalizes the text.
   *
   * @param text The text to normalize.
   * @return The normalized source text.
   * @since 11
   */
  public static normalize(text: string): string {
    return text
      .replace('ŝ', 'š')
      .replace('Ŝ', 'Š')
      .replace('┌', '⸢')
      .replace('┐', '⸣')
      .replace('⌈', '⸢')
      .replace('⌉', '⸣')
      .replace('ĸ', '{K:}')
      .trim();
  }

  /**
   * Returns the number.
   *
   * @return The number.
   * @since 11
   */
  public getNumber(): number {
    return this.number;
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
   * Returns the normalized text.
   *
   * @return The normalized text.
   * @since 11
   */
  public getTextNormalized(): string {
    return this.textNormalized;
  }
}
