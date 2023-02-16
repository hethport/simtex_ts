/**
 * File:     Fragment.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core.data.fragment
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     16.02.2023
 */



import { JavaObject, java } from "../../../../../../../../../../usr/bin/java";
import { Status } from "../../Status";




/**
 * Fragment is an immutable class that defines fragments.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 * @since 11
 */
export  class Fragment extends JavaObject {
	/**
	 * The entity status. The default status is 'ok'.
	 */
	private readonly status:  Status | null = new  Status();

	/**
	 * The text.
	 */
	private readonly text:  java.lang.String | null;

	/**
	 * Creates a fragment.
	 * 
	 * @param text The content.
	 * @since 11
	 */
	public constructor(text: java.lang.String| null) {
		super();

		this.text = text;
	}

	/**
	 * Returns the status.
	 *
	 * @return The status.
	 * @since 11
	 */
	public getStatus():  Status | null {
		return this.status;
	}

	/**
	 * Returns the text.
	 *
	 * @return The text.
	 * @since 11
	 */
	public getText():  java.lang.String | null {
		return this.text;
	}

}
