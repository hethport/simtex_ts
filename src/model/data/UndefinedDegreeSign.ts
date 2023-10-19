/**
 * File:     UndefinedDegreeSign.ts
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     13.12.2022
 */

import { DegreeSign } from './DegreeSign';
import {XmlElementNode, xmlElementNode} from 'simple_xml';

/**
 * UndefinedDegreeSign is an immutable class that defines unidentified word
 * fragments between degree signs.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 */
export  class UndefinedDegreeSign extends DegreeSign {
  static readonly xmlTag: string = 'UNDEFINED_DEGREE_SIGN';
  /**
   * Creates an unidentified degree sign segment.
   *
   * @param segment        The segment.
   * @param text           The text.
   */
  public constructor(segment: string| null, text: string) {
    super(segment, text);
  }

  public exportXml(): XmlElementNode {
    // TODO: implement UNDEFINED_DEGREE_SIGN check in Word.ts
    return xmlElementNode(UndefinedDegreeSign.xmlTag, {}, this.exportNodes());
  }
}
