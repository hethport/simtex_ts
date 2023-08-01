/**
 * File:     Content.ts
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     16.02.2023
 */

import { WordConstants } from '../WordConstants';
import { Slice } from './Slice';

/**
 * Content is an immutable class that defines contents.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 */
export class Content implements Slice {
  /**
   * The parenthesis charachter for escape.
   */
  static readonly escapeCharacter: string = '⒪';
  
  /**
   * The escape pattern.
   */
  private static readonly patternEscape: RegExp = new RegExp('\\(([' + WordConstants.alphabet + '])\\)', 'g');

  /**
   * The unescape pattern.
   */
  private static readonly patternUnescape: RegExp = new RegExp(Content.escapeCharacter + '([' + WordConstants.alphabet + '])', 'g');

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
   * Returns the escaped text.
   *
   * @param text The text to escape.
   * @return The escaped text.
   */
  public static escape(text: string): string {
    text = text.replace(/\+\(n\)/g, '⑴').replace(/\(\+n\)/g, '⑴').replace(/\(n\)\+/g, '⑵').replace(/\(n\+\)/g, '⑵').replace(/\(n\)/g, '⒩')
          .replace(/\(x\)/g, '⒳').replace(/\(\.\)/g, '⒫')
          .replace(/\(-\)/g, '⒣').replace(/\(=\)/g, '⒠');
    
    const matches = text.matchAll(Content.patternEscape);
    let index = 0;
    const buffer: string[] = [];
    for (const match of matches) {
      if (match.index && index < match.index) {
        buffer.push(text.substring(index, match.index));
      }
      
      buffer.push(Content.escapeCharacter + match[1]);
      
      if (match.index != null) {  index = match.index + match[0].length;  }
    }

    if(index < text.length) {
      buffer.push(text.substring(index));
    }
    
    return buffer.join('');
  }
  
  /**
   * Returns the unescaped text.
   *
   * @param text The text to unescape.
   * @return The unescaped text.
   */
  public static unescape(text: string): string {
    text = text.replace(/⒩/g, '(n)').replace(/⑴/g, '(+n)').replace(/⑵/g, '(n+)').replace(/⒳/g, '(x)').replace(/⒫/g, '(.)').replace(/⒠/g, '(=)').replace(/⒣/g, '(-)')
    
    // WordConstants.surplusEscapeHyphen -> Ⓗ
    .replace(/Ⓗ/g, '-')
    
     // WordConstants.beginEscapeNEqual -> ⓝ
    .replace(/ⓝ/g, 'n=');
    
    const matches = text.matchAll(Content.patternUnescape);
    let index = 0;
    const buffer: string[] = [];
    for (const match of matches) {
      if (match.index && index < match.index) {
        buffer.push(text.substring(index, match.index));
      }
      
      buffer.push('(' + match[1] + ')');
      
      if (match.index != null) {  index = match.index + match[0].length;  }
    }

    if(index < text.length) {
      buffer.push(text.substring(index));
    }
    
    return buffer.join('');
  }

}
