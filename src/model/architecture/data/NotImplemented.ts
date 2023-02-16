/**
 * File:     NotImplemented.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core.data
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     22.12.2022
 */



import { java } from "../../../../../../../../../usr/bin/java";
import { Fragment } from "./fragment/Fragment";




/**
 * Defines not implemented word fragments.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 * @since 11
 */
export  class NotImplemented extends Fragment {
	/**
	 * Creates a not implemented word fragments.
	 * 
	 * @param text The text.
	 * @since 11
	 */
	public constructor(text: java.lang.String| null) {
		super(text);
	}

}
