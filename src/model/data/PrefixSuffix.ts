/**
 * File:     PrefixSuffix.ts
 *
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     09.06.2023
 */

/**
 * Defines prefix and suffixes.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 */
export class PrefixSuffix {
  /**
   * The prefix.
   */
  private readonly prefix: string [] = [];

  /**
   * The suffix.
   */
  private readonly suffix: string [] = [];

  /**
   * Adds the prefix.
   *
   * @param prefix The prefix to add.
   */
  public addPrefix(prefix: string) {
    this.prefix.push(prefix);
  }

  /**
   * Returns the prefix.
   *
   * @return The prefix.
   */
  public getPrefix(): string [] {
    return this.prefix;
  }

  /**
   * Adds the suffix.
   *
   * @param suffix The suffix to add.
   */
  public addSuffix(suffix: string) {
    this.suffix.push(suffix);
  }

  /**
   * Returns the suffix.
   *
   * @return The suffix.
   */
  public getSuffix(): string [] {
    return this.suffix;
  }
}
