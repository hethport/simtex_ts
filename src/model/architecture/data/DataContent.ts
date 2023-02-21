/**
 * File:     DataContent.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core.data
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     16.02.2023
 */


import { LineEntity } from '../LineEntity';


/**
 * Content is an immutable class that defines content for data lines.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 * @since 11
 */
export  class DataContent {
  /**
	 * The source.
	 */
  private readonly source:  string | null;

  /**
	 * The entities.
	 */
  private readonly entities:  LineEntity[];

  /**
	 * Creates a content for a data line without entities.
	 *
	 * @param source The source.
	 * @since 11
	 */

  public constructor(source: string | null, entities: LineEntity[] | null) {

    this.source = source;
    this.entities = entities == null ? [] : entities;

  }

  /**
	 * Returns the source.
	 *
	 * @return The source.
	 * @since 11
	 */
  public getSource():  string | null{
    return this.source;
  }

  /**
	 * Returns the entities.
	 *
	 * @return The entities.
	 * @since 11
	 */
  public getEntities():  LineEntity[] {
    return this.entities;
  }
}
