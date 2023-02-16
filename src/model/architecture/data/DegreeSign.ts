/**
 * File:     DegreeSignSegmentResponse.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core.data
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     13.12.2022
 */



import { java, S } from "../../../../../../../../../usr/bin/java";
import { Breakdown } from "./fragment/Breakdown";
import { MetadataPosition } from "./fragment/MetadataPosition";




/**
 * DegreeSign is an immutable class that defines word fragments between degree
 * signs.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 * @since 11
 */
export  class DegreeSign extends Breakdown {
	/**
	 * The pattern for fragments between degree signs.
	 */
	protected static readonly pattern:  java.util.regex.Pattern | null = java.util.regex.Pattern.compile(S`°([^°]*)°`);

	/**
	 * The segment.
	 */
	private readonly segment:  java.lang.String | null;

	/**
	 * Creates a word fragment between degree signs.
	 * 
	 * @param deleriPosition The deleri ('*' / erased / Rasur) position.
	 * @param segment        The segment.
	 * @param content        The content. Null on troubles.
	 * @since 11
	 */
	public constructor(deleriPosition: MetadataPosition| null, segment: java.lang.String| null, content: java.lang.String| null) {
		super(deleriPosition, content);

		this.segment = segment;
	}

	/**
	 * Returns the segment.
	 *
	 * @return The segment.
	 * @since 11
	 */
	public getSegment():  java.lang.String | null {
		return this.segment;
	}

}
