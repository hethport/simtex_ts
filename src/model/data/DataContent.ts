/**
 * File:     DataContent.ts
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     16.02.2023
 */

import { LineEntity } from '../LineEntity';
import { Word } from './Word';

/**
 * Content is an immutable class that defines content for data lines.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
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
   */

  public constructor(source: string | null, entities: LineEntity[] | null) {

    this.source = source;
    this.entities = entities == null ? [] : entities;

  }

  /**
   * Returns the source.
   *
   * @return The source.
   */
  public getSource():  string | null{
    return this.source;
  }

  /**
   * Returns the entities.
   *
   * @return The entities.
   */
  public getEntities():  LineEntity[] {
    return this.entities;
  }
  
  /**
   * Returns the words.
   *
   * @return The words.
   */
  public getWords(): Word[] {
    const words : Word[] = [];
    for (const entity of this.entities)
      if (entity instanceof Word)
        words.push(entity);
			
    return words;
  }

}
