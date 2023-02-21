/**
 * File:     Basic.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core.data
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     31.01.2023
 */


import { Word } from './Word';
import { Breakdown } from './fragment/Breakdown';
import { MetadataPosition } from './fragment/MetadataPosition';
import {XmlElementNode, xmlElementNode} from 'simple_xml';


/**
 * Defines delimiters.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 * @since 11
 */
export  class Delimiter extends Breakdown {
  public static readonly xmlTag: string = 'DELIMITER';
  /**
	 * The alphabet.
	 */
  private static readonly alphabet: string = Word.delimiterAlphabet;

  /**
	 * The pattern for delimiters.
	 */
  static readonly pattern:  RegExp = new RegExp('[' + Delimiter.alphabet + ']+' + Word.subscriptRegularExpression);

  /**
	 * Creates a delimiter.
	 * 
	 * @param deleriPosition The deleri ('*' / erased / Rasur) position.
	 * @param text           The text.
	 * @since 11
	 */
  public constructor(deleriPosition: MetadataPosition, text: string) {
    super(deleriPosition, text);
  }

  public exportXml(): XmlElementNode {
    // TODO: implement DELIMITER check in Word.ts
    return xmlElementNode(Delimiter.xmlTag, {}, this.exportNodes());
  }
}
