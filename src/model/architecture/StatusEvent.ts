/**
 * File:     StatusEvent.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     16.02.2023
 */

import { StatusEventCode } from './StatusEventCode';
import { StatusLevel } from './StatusLevel';




/**
 * Event is an immutable class that defines events for line statuses.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 * @since 11
 */
export  class StatusEvent {

  /**
	 * The level.
	 */
  private readonly level:  StatusLevel;

  /**
	 * The code.
	 */
  private readonly code:  StatusEventCode;

  /**
	 * The message.
	 */
  private readonly message:  string;

  /**
	 * Creates an event for a line status.
	 * 
	 * @param level   The level.
	 * @param code    The code.
	 * @param message The message.
	 * @since 11
	 */
  public constructor(level: StatusLevel, code: StatusEventCode, message: string) {

    this.level = level;
    this.code = code;
    this.message = message;
  }

  /**
	 * Returns the level.
	 *
	 * @return The level.
	 * @since 11
	 */
  public getLevel():  StatusLevel {
    return this.level;
  }

  /**
	 * Returns the code.
	 *
	 * @return The code.
	 * @since 11
	 */
  public getCode():  StatusEventCode {
    return this.code;
  }

  /**
	 * Returns the message.
	 *
	 * @return The message.
	 * @since 11
	 */
  public getMessage():  string {
    return this.message;
  }
}
