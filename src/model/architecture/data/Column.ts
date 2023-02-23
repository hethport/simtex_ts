/**
 * File:     Column.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core.data
 *
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     30.01.2023
 */


import {LineEntity} from '../LineEntity';
import {XmlElementNode, xmlElementNode} from 'simple_xml';


/**
 * Defines columns for tables.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 * @since 11
 */
export class Column implements LineEntity {
  static readonly xmlTag: string = 'cl';

  public exportXml(): XmlElementNode {
    return xmlElementNode(Column.xmlTag, {}, []);
  }
}
