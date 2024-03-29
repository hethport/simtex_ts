/**
 * File:     Line.ts
 *
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     05.12.2022
 */

import {LineSource} from './LineSource';
import {Status} from './Status';
import {XmlNode} from 'simple_xml';

/**
 * Defines TLH dig parser lines.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 */
export abstract class Line {
  /**
   * The line status. The default status is 'ok'.
   */
  private readonly status: Status = new Status();

  /**
   * The line source.
   */
  private readonly source: LineSource;
  
  /**
   * True if this line is a part of the previous one.
   */
  private isPreviousLine = false;
  
  /**
   * Creates a TLH dig parser line.
   *
   * @param source The line source.
   */
  public constructor(source: LineSource) {
    this.source = source;
  }

  /**
   * Returns the line status.
   *
   * @return The line status.
   */
  public getStatus(): Status {
    return this.status;
  }

  /**
   * Returns the line source.
   *
   * @return The line source.
   */
  public getSource(): LineSource {
    return this.source;
  }

  /**
   * Set as part of previous line.
   */
  protected setPartPreviousLine() {
    this.isPreviousLine = true;
  }
 
  /**
   * Returns true if this line is a part of the previous one.
   *
   * @return True if this line is a part of the previous one.
   */
  public isPartPreviousLine(): boolean {
    return this.isPreviousLine;
  }

  /**
   * Returns a lineBreak <lb/> node with lineEntities after it
   *
   * @return The content.
   */
  public abstract exportXml(): XmlNode[];
}
