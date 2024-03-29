/**
 * File:     LineInformation.ts
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     16.02.2023
 */

/**
 * LineInformation is an immutable class that defines line information for data
 * lines.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 */
export  class LineInformation {
  /**
   * The prefix.
   */
  private readonly prefix:  string | null;

  /**
   * The number.
   */
  private readonly number:  string;

  /**
   * Creates a line information.
   *
   * @param prefix The prefix.
   * @param number The number.
   */
  public constructor(prefix: string| null, number: string | null) {
    this.prefix = prefix;
    this.number = LineInformation.normalizeNumber(number);
  }

  /**
   * Normalizes the line number.
   *
   * @param number The line number to normalize.
   * @return The normalized line number.
   */
  public static normalizeNumber(number: string | null):  string {

    return number == null ? '' : number.replace(/'/g, '′')
      .replace(/’/g, '′')
      .replace(/ʹʹʹʹ/g, '⁗')
      .replace(/ʹʹʹ/g, '‴')
      .replace(/ʹʹ/g, '″')
      .replace(/ʹ/g, '′')
      .trim();
  }

  /**
   * Returns true if the prefix is set.
   *
   * @return True if the prefix is set.
   */
  public isPrefixSet():  boolean {
    return this.prefix !== null;
  }

  /**
   * Returns the prefix.
   *
   * @return The prefix.
   */
  public getPrefix():  string | null {
    return this.prefix;
  }

  /**
   * Returns true if the number is set.
   *
   * @return True if the number is set.
   */
  public isNumberSet():  boolean {
    return this.number !== null;
  }

  /**
   * Returns the number.
   *
   * @return The number.
   */
  public getNumber():  string | null {
    return this.number;
  }

  public getFormatted(): string {
    return (this.prefix == null ? '' : this.prefix) + (this.number == null ? '' : this.number);
  }
}
