/**
 * File:     LineSource.ts
 *
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     16.02.2023
 */

/**
 * Defines source for lines.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 */
export class LineSource {

  /**
   * The trimmed normalized text.
   */
  private readonly textNormalized: string;

  /**
   * The non trimmed normalized text
   */
  private readonly textNormalizedNotTrimmed: string;

  /**
   * Creates a source for a line.
   *
   * @param number The number.
   * @param text   The text.
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
    this.textNormalizedNotTrimmed = LineSource.normalizeNotTrimmed(text);
    this.textNormalized = this.textNormalizedNotTrimmed.trim();
  }

  /**
   * Normalizes the text, but does not trim it.
   *
   * @param text The text to normalize.
   * @return The normalized source text.
   */
  public static normalizeNotTrimmed(text: string): string {
    return text
      .replace(/ŝ/g, 'š')
      .replace(/Ŝ/g, 'Š')
      .replace(/┌/g, '⸢')
      .replace(/┐/g, '⸣')
      .replace(/⌈/g, '⸢')
      .replace(/⌉/g, '⸣')
      .replace(/ĸ/g, '{K:}');
  }

  /**
   * Normalizes the text and trim it.
   *
   * @param text The text to normalize.
   * @return The normalized source text.
   */
  public static normalize(text: string): string {
    return this.normalizeNotTrimmed(text).trim();
  }

  /**
   * Returns the number.
   *
   * @return The number.
   */
  public getNumber(): number {
    return this.number;
  }

  /**
   * Returns the text.
   *
   * @return The text.
   */
  public getText(): string {
    return this.text;
  }

  /**
   * Returns the non trimmed normalized text.
   *
   * @return The non trimmed normalized text.
   */
  public getTextNormalizedNotTrimmed(): string {
    return this.textNormalizedNotTrimmed;
  }

  /**
   * Returns the trimmed normalized text.
   *
   * @return The trimmed normalized text.
   */
  public getTextNormalized(): string {
    return this.textNormalized;
  }
}
