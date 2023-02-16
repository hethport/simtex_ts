/**
 * File:     Status.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     14.12.2022
 */



import { JavaObject, java } from "../../../../../../../../usr/bin/java";
import { StatusEvent } from "./StatusEvent";
import { StatusLevel } from "./StatusLevel";




/**
 * Status is an immutable class that defines line statuses.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 * @since 11
 */
export  class Status extends JavaObject {

	/**
	 * The level.
	 */
	private level:  StatusLevel | null = StatusLevel.ok;

	/**
	 * The events.
	 */
	private readonly events:  java.util.List<StatusEvent> | null = new  java.util.ArrayList();

	/**
	 * Default constructor for a line status with 'ok' level and no events.
	 * 
	 * @since 11
	 */
	public constructor() {
		super();

	}

	/**
	 * Returns the level.
	 *
	 * @return The level.
	 * @since 11
	 */
	public getLevel():  StatusLevel | null {
		return this.level;
	}

	/**
	 * Returns the events.
	 *
	 * @return The events.
	 * @since 11
	 */
	public getEvents():  java.util.List<StatusEvent> | null {
		return new  java.util.ArrayList(this.events);
	}

	/**
	 * Adds the given even if non null and returns the current level.
	 * 
	 * @param event The event to add.
	 * @return The current level.
	 * @since 11
	 */
	public add(event: StatusEvent| null):  StatusLevel | null {
		if (event !== null) {
			this.events.add(event);

			this.level = StatusLevel.max(event.getLevel(), this.level);
		}

		return this.level;
	}

	/**
	 * Adds the status level of given status if non null and returns the current
	 * one.
	 * 
	 * @param status The status to add the level.
	 * @return The current level.
	 * @since 11
	 */
	public addLevel(status: Status| null):  StatusLevel | null {
		if (status !== null)
			this.level = StatusLevel.max(status.getLevel(), this.level);

		return this.level;
	}
}
