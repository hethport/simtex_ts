/**
 * File:     ParagraphSeparator.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core.data
 *
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     06.03.2023
 */


import {LineEntity} from '../LineEntity';
import {XmlElementNode, xmlElementNode} from 'simple_xml';

/**
 * Defines paragraph separators.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 * @since 11
 */
export class ParagraphSeparator implements LineEntity {
  static readonly xmlTag_single: string = 'parsep';
  static readonly xmlTag_double: string = 'parsep_dbl';
  
  /**
   * The pattern for single paragraph separators.
   */
  public static readonly patternSingles = ['§', '¬¬¬'];

  /**
   * The pattern for double paragraph separators.
   */
  public static readonly patternDoubles = ['§§', '==='];

  /**
   * True if the paragraph separator is single. Otherwise it is double.
   */
  private readonly isSingle: boolean;
  
  /**
	 * Creates a paragraph separator.
	 * 
	 * @param isSingle True if the paragraph separator is simple.
	 * @since 11
	 */
  public constructor(isSingle: boolean) {
    this.isSingle = isSingle;
  }

  public exportXml(): XmlElementNode {
    return xmlElementNode(this.isSingle ? ParagraphSeparator.xmlTag_single : ParagraphSeparator.xmlTag_double, {}, []);
  }
}
