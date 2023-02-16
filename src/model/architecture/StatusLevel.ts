/**
 * File:     StatusLevel.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     16.02.2023
 */

import { java, S } from "../../../../../../../../usr/bin/java";


 class  StatusLevel extends java.lang.Enum<StatusLevel> {
	public static readonly ok: StatusLevel = new class extends StatusLevel {
}('ok', 0); public static readonly minor: StatusLevel = new class extends StatusLevel {
}('minor', 1); public static readonly moderate: StatusLevel = new class extends StatusLevel {
}('moderate', 2); public static readonly serious: StatusLevel = new class extends StatusLevel {
}('serious', 3); public static readonly severe: StatusLevel = new class extends StatusLevel {
}('severe', 4); public static readonly critical: StatusLevel = new class extends StatusLevel {
}('critical', 5); public static readonly maximal: StatusLevel = new class extends StatusLevel {
}('maximal', 6);

	/**
	 * Returns the level with higher severity.
	 * 
	 * @param level1 The level.
	 * @param level2 The level.
	 * @return The level with higher severity.
	 * @since 11
	 */
	public static max(level1: StatusLevel| null, level2: StatusLevel| null):  StatusLevel | null {
		return level1 === null ? level2
				: (level2 === null ? null : (level1.ordinal() > level2.ordinal() ? level1 : level2));
	}
}
