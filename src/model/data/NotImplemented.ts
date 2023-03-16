/**
 * File:     NotImplemented.ts
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     22.12.2022
 */

import { Fragment } from './fragment/Fragment';
import {XmlElementNode, xmlElementNode, xmlTextNode} from 'simple_xml';

/**
 * Defines not implemented word fragments.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 */
export  class NotImplemented extends Fragment {
  // TODO: How to express parser ERROR?
  public static readonly xmlTag: string = 'PARSER_ERROR';
  
  /**
   * Creates a not implemented word fragments.
   *
   * @param text The text.
   */
  public constructor(text: string) {
    super(text);
  }

  public exportXml(): XmlElementNode {
    const text: string| null = this.getText();
    return xmlElementNode(NotImplemented.xmlTag, {}, (text == null ? [] : [xmlTextNode(text)]));
  }
}
