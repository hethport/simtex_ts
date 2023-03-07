/**
 * File:     Surplus.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core.data.fragment
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     07.03.2023
 */


import { Slice } from './Slice';


/**
 * Content is an immutable class that defines surplus.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 * @since 11
 */
export class Surplus implements Slice {
  /**
	 * The text.
	 */
  private readonly text:  string;

  /**
   * Creates a surplus.
   *
   * @param text The text.
   * @since 11
   */
  public constructor(text: string) {
    this.text = text;
  }

  /**
   * Returns the text.
   *
   * @return The text.
   * @since 11
   */
  public getText():  string {
    return this.text;
  }
}
