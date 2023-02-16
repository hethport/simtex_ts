/**
 * File:     DataContent.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core.data
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     16.02.2023
 */



import { JavaObject, java } from "../../../../../../../../../usr/bin/java";
import { LineEntity } from "../LineEntity";




/**
 * Content is an immutable class that defines content for data lines.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 * @since 11
 */
export  class DataContent extends JavaObject {
	/**
	 * The source.
	 */
	private readonly source:  java.lang.String | null;

	/**
	 * The entities.
	 */
	private readonly entities:  java.util.List<LineEntity> | null;

	/**
	 * Creates a content for a data line without entities.
	 * 
	 * @param source The source.
	 * @since 11
	 */
	/* eslint-disable constructor-super, @typescript-eslint/no-unsafe-call */
public constructor(source: java.lang.String| null);

	/**
	 * Creates a content for a data line.
	 * 
	 * @param source   The source.
	 * @param entities The entities.
	 * @since 11
	 */
	public constructor(source: java.lang.String| null, entities: java.util.List<LineEntity>| null);
public constructor(source: java.lang.String | null, entities?: java.util.List<LineEntity> | null) {
const $this = (source: java.lang.String | null, entities?: java.util.List<LineEntity> | null): void => {
if (entities === undefined) {
		$this(source, null);
	}
 else  {
		super();

		this.source = source;
		this.entities = entities === null ? new  java.util.ArrayList() : entities;
	}
};

$this(source, entities);

}
/* eslint-enable constructor-super, @typescript-eslint/no-unsafe-call */

	/**
	 * Returns the source.
	 *
	 * @return The source.
	 * @since 11
	 */
	public getSource():  java.lang.String | null {
		return this.source;
	}

	/**
	 * Returns the entities.
	 *
	 * @return The entities.
	 * @since 11
	 */
	public getEntities():  java.util.List<LineEntity> | null {
		return this.entities;
	}

}
