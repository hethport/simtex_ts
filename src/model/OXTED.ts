/**
 * File:     TLHParser.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core
 *
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     28.02.2023
 */

import {Line} from './Line';
import {TLHParser} from './TLHParser';
import {Status} from './Status';
import {StatusLevel} from './StatusLevel';
import {XmlNode} from 'simple_xml';

/*
 * OXTED is an immutable class that defines TLH dig parser interfaces for OXTED.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 * @since 11
 */
export class OXTED {
  /**
   * The status level.
   */
  private readonly statusLevel: StatusLevel;

  /**
   * The lines.
   */
  private readonly lines: OXTEDLine[] = [];

  /**
   * Creates an interfaces to OXTED.
   *
   * @param parser The TLH dig parser.
   * @since 11
   */
  public constructor(parser: TLHParser) {
    this.statusLevel = parser.getStatus().getLevel();
    
    for (const line of parser.getLines())
      this.lines.push(new OXTEDLine(line));
  }
	
  /**
   * Returns the status level.
   *
   * @return The status level.
   * @since 11
   */
  public getStatusLevel(): StatusLevel {
    return this.statusLevel;
  }
  
  /**
   * Returns the lines.
   *
   * @return The lines.
   * @since 11
   */
  public getLines(): OXTEDLine[] {
    return this.lines;
  }

}

/*
 * OXTEDLine is an immutable class that defines lines for OXTED interfaces.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 * @since 11
 */
export class OXTEDLine {
  /**
   * The status.
   */
  private readonly status: Status = new Status();
  
  /**
   * The status.
   */
  private readonly nodes: XmlNode[];

  /**
   * Creates an interfaces to OXTED.
   *
   * @param line The line.
   * @since 11
   */
  public constructor(line: Line) {
    this.status = line.getStatus();
    
    this.nodes = line.exportXml();
  }
	
  /**
   * Returns the status.
   *
   * @return The status.
   * @since 11
   */
  public getStatus(): Status {
    return this.status;
  }
	
  /**
   * Returns the nodes.
   *
   * @return The nodes.
   * @since 11
   */
  public getNodes(): XmlNode[] {
    return this.nodes;
  }
  
  
}
