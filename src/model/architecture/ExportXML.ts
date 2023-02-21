/**[]
 * File:     ExportXML.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     20.02.2023
 */
import {XmlElement} from '../../xmlModel';

/**
 * Defines xml exports.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 * @since 11
 */
export interface ExportXML {
  exportXml:() => XmlElement;
}

/**
 * Encodes the xml element.
 * 
 * @param element
 *            The element to be encoded.
 * @return The encoded element.
 */
export function encodeXML(element: string): string {
  return element.replace('&', '&amp;').replace('"', '&quot;').replace('\'', '&apos;').replace('<', '&lt;')
    .replace('>', '&gt;');
}

/**
 * Encodes the xml attribute.
 * 
 * @param attribute
 *            The attribute to be encoded.
 * @return The encoded attribute
 */
export function encodeAttributeXML(attribute: string): string {
  return attribute.replace('"', '&quot;');
}

