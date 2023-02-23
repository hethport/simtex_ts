/**
 * File:     LinePrefix.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core.metadata
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     06.12.2022
 */


import { Metadata } from './Metadata';
import { LineSource } from '../LineSource';
import {xmlElementNode, XmlNode, xmlTextNode} from 'simple_xml';


/**
 * Define line prefixes.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 * @since 11
 */
export  class LinePrefix extends Metadata {
  // TODO: implement correct export
  static readonly xmlTag: string = 'LINE_PREFIX';

  /**
	 * The prefix.
	 */
  private readonly prefix:  string | null;

  /**
	 * Creates a line prefix.
	 * 
	 * @param source The line source.
	 * @since 11
	 */
  public constructor(source: LineSource) {
    super(source);

    const  characters: string = source.getTextNormalized().trim().length == 0 ? '' : source.getTextNormalized().substring(1);

    this.prefix = characters.trim().length == 0 ? null : characters.trim();
  }

  /**
	 * Returns true if the prefix are set.
	 *
	 * @return True if the prefix are set.
	 * @since 11
	 */
  public isPrefixSet():  boolean {
    return this.prefix !== null;
  }

  /**
	 * Returns the prefix.
	 *
	 * @return The prefix.
	 * @since 11
	 */
  public getPrefix():  string | null {
    return this.prefix;
  }

  public exportXml(): XmlNode[] {
    return [xmlElementNode(LinePrefix.xmlTag, {}, [xmlTextNode(this.prefix == null ? '' : this.prefix)])];
  }
}
