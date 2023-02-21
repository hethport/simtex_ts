/**
 * File:     Column.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core.data
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     30.01.2023
 */


import { LineEntity } from '../LineEntity';
import {XmlElement, xmlElementNode} from '../../../xmlModel';


/**
 * Defines columns for tables.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 * @since 11
 */
export  class Column implements LineEntity {
  static readonly xmlTag: string = 'cl';
  /**
	 * Creates a column for a table.
	 *
	 * @since 11
	 */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public constructor() {

  }

  public exportXml(): XmlElement {
    return xmlElementNode(Column.xmlTag, {}, []);
  }
}
