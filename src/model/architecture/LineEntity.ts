/**
 * File:     LineEntity.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core
 *
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     16.02.2023
 */

import {XmlElementNode} from 'simple_xml';
import {ExportXML} from './ExportXML';

/**
 * Define line entities.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 * @since 11
 */
export interface LineEntity extends ExportXML{
  exportXml(): XmlElementNode;
}
