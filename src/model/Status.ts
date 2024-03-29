/**
 * File:     Status.ts
 *
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     14.12.2022
 */

import {StatusEvent} from './StatusEvent';
import {maxStatusLevel, StatusLevel} from './StatusLevel';

/**
 * Status is an immutable class that defines line statuses.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 */
export class Status {

  /**
   * The level.
   */
  private level: StatusLevel = StatusLevel.ok;

  /**
   * The events.
   */
  private readonly events: StatusEvent[] = [];

  /**
   * Returns the level.
   *
   * @return The level.
   */
  public getLevel(): StatusLevel {
    return this.level;
  }

  /**
   * Returns the events.
   *
   * @return The events.
   */
  public getEvents(): StatusEvent[] {
    return this.events;
  }

  /**
   * Adds the given even if non-null and returns the current level.
   *
   * @param event The event to add.
   * @return The current level.
   */
  public add(event: StatusEvent): StatusLevel {
    this.events.push(event);
    this.level = maxStatusLevel(event.getLevel(), this.level);

    return this.level;
  }

  /**
   * Adds the status level of given status if non-null and returns the current
   * one.
   *
   * @param status The status to add the level.
   * @return The current level.
   */
  public addLevel(status: Status): StatusLevel {
    this.level = maxStatusLevel(status.getLevel(), this.level);

    return this.level;
  }
}
