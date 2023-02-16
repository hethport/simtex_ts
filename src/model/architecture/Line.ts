/**
 * File:     Line.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     05.12.2022
 */

import { JavaObject } from "../../../../../../../../usr/bin/java";
import { LineSource } from "./LineSource";
import { Status } from "./Status";




/**
 * Defines TLH dig parser lines.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 * @since 11
 */
export  class Line extends JavaObject {
	/**
	 * The line status. The default status is 'ok'.
	 */
	private readonly status:  Status | null = new  Status();

	/**
	 * The line source.
	 */
	private readonly source:  LineSource | null;

	/**
	 * Creates a TLH dig parser line.
	 * 
	 * @param source The line source.
	 * @since 11
	 */
	public constructor(source: LineSource| null) {
		super();

		this.source = source;
	}

	/**
	 * Returns the line status.
	 *
	 * @return The line status.
	 * @since 11
	 */
	public getStatus():  Status | null {
		return this.status;
	}

	/**
	 * Returns the line source.
	 *
	 * @return The line source.
	 * @since 11
	 */
	public getSource():  LineSource | null {
		return this.source;
	}

}
