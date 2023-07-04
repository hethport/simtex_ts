/**
 * File:     Content.ts
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     16.02.2023
 */

import { Slice } from './Slice';

/**
 * Content is an immutable class that defines contents.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 */
export class Content implements Slice {
  /**
   * The text.
   */
  private readonly text:  string;

  /**
   * Creates a content.
   *
   * @param text The text.
   */
  public constructor(text: string) {
    this.text = Content.unescape(text);
  }

  /**
   * Returns the text.
   *
   * @return The text.
   */
  public getText():  string {
    return this.text;
  }
  
  /**
   * Returns the unescaped text.
   *
   * @param text The text to unescape.
   * @return The unescaped text.
   */
  private static unescape(text: string): string {
    return text.replace(/⒩/g, '(n)').replace(/⑴/g, '(+n)').replace(/⑵/g, '(n+)').replace(/⒳/g, '(x)').replace(/⒠/g, '(=)').replace(/⒣/g, '(-)');
  }

}
