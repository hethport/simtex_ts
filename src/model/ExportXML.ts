/**
 * File:     ExportXML.ts
 *
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     20.02.2023
 */

import {XmlNode} from 'simple_xml';

interface NotIgnored<T> {
  _type: 'NotIgnored';
  value: T;
}

interface Ignored<T> {
  _type: 'Ignored';
  value: T;
}

export type MaybeIgnored<T> = Ignored<T> | NotIgnored<T>;

/**
 * Defines xml exports.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 */
export interface ExportXML {
  exportXml: () => XmlNode;
  // newExportXml: () => MaybeIgnored<XmlNode>;
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
