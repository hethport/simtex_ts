/**
 * File:     Metadata.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core.metadata
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     06.12.2022
 */



import { Line } from '../Line';
import { LineSource } from '../LineSource';




/**
 * Defines metadata for the TLH dig parser lines.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 * @since 11
 */
export  class Metadata extends Line {

  /**
	 * Creates a metadata for the TLH dig parser line.
	 * 
	 * @param source The line source.
	 * @since 11
	 */
  public constructor(source: LineSource) {
    super(source);
  }

}
