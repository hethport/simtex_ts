/**
 * File:     UndefinedDegreeSign.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core.data
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     13.12.2022
 */



import { java } from "../../../../../../../../../usr/bin/java";
import { DegreeSign } from "./DegreeSign";
import { MetadataPosition } from "./fragment/MetadataPosition";




/**
 * UndefinedDegreeSign is an immutable class that defines unidentified word
 * fragments between degree signs.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 * @since 11
 */
export  class UndefinedDegreeSign extends DegreeSign {

	/**
	 * Creates an unidentified degree sign segment.
	 * 
	 * @param deleriPosition The deleri ('*' / erased / Rasur) position.
	 * @param segment        The segment.
	 * @since 11
	 */
	public constructor(deleriPosition: MetadataPosition| null, segment: java.lang.String| null) {
		super(deleriPosition, segment, null);
	}

}
