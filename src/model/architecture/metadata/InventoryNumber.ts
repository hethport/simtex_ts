/**
 * File:     InventoryNumber.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core.metadata
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     06.12.2022
 */


import { Identifier } from './Identifier';
import { LineSource } from '../LineSource';
import {xmlElementNode, XmlNode, xmlTextNode} from 'simple_xml';


/**
 * Defines inventory numbers.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 * @since 11
 */
export class InventoryNumber extends Identifier {
  // TODO: implement correct export
  static readonly xmlTag: string = 'INVENTORY_NUMBER';
  /**
	 * Creates an inventory number.
	 * 
	 * @param source The line source.
	 * @since 11
	 */
  public constructor(source: LineSource) {
    super(source);
  }

  public exportXml(): XmlNode[] {
    return [xmlElementNode(InventoryNumber.xmlTag, {}, [xmlTextNode(this.concatIdentifier())])];
  }
}
