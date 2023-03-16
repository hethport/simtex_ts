/**
 * File:     StatusEvent.ts
 *
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     16.02.2023
 */

import {StatusEventCode} from './StatusEventCode';
import {StatusLevel} from './StatusLevel';

/**
 * Event is an immutable class that defines events for line statuses.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 */
export class StatusEvent {

  /**
   * Creates an event for a line status.
   *
   * @param level   The level.
   * @param code    The code.
   * @param message The message.
   */
  public constructor(
    /**
     * The level.
     */
    private readonly level: StatusLevel,
    /**
     * The code.
     */
    private readonly code: StatusEventCode,
    /**
     * The message.
     */
    private readonly message: string
  ) {
  }

  /**
   * Returns the level.
   *
   * @return The level.
   */
  public getLevel(): StatusLevel {
    return this.level;
  }

  /**
   * Returns the code.
   *
   * @return The code.
   */
  public getCode(): StatusEventCode {
    return this.code;
  }

  /**
   * Returns the message.
   *
   * @return The message.
   */
  public getMessage(): string {
    return this.message;
  }
}
