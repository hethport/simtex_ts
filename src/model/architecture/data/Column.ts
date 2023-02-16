/**
 * File:     Column.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core.data
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     30.01.2023
 */



import { JavaObject, java } from "../../../../../../../../../usr/bin/java";
import { LineEntity } from "../LineEntity";




/**
 * Defines columns for tables.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 * @since 11
 */
export  class Column extends JavaObject implements LineEntity {
	/**
	 * Creates a column for a table.
	 * 
	 * @param separator The separator.
	 * @since 11
	 */
	public constructor(separator: java.lang.String| null) {
		super();
	}

}
