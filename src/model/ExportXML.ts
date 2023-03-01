/**[]
 * File:     ExportXML.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core
 *
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     20.02.2023
 */
import {XmlNode} from 'simple_xml';

/**
 * Defines xml exports.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 * @since 11
 */
export interface ExportXML {
  exportXml:() => XmlNode;
}

/**
 * Encodes the xml element.
 *
 * @param element
 *            The element to be encoded.
 * @return The encoded element.
 */
export function encodeXML(element: string): string {
  return element
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Encodes the xml attribute.
 *
 * @param attribute
 *            The attribute to be encoded.
 * @return The encoded attribute
 */
export function encodeAttributeXML(attribute: string): string {
  return attribute.replace(/"/g, '&quot;');
}

