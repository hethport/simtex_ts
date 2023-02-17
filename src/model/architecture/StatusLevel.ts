/**
 * File:     StatusLevel.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core
 *
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     16.02.2023
 */


export enum  StatusLevel {
  ok, minor, moderate, serious, severe, critical, maximal,
  /**
	 * Returns the level with higher severity.
	 * 
	 * @param level1 The level.
	 * @param level2 The level.
	 * @return The level with higher severity.
	 * @since 11
	 */
}
export function maxStatusLevel(level1: StatusLevel, level2: StatusLevel):  StatusLevel {
  return level1.valueOf() > level2.valueOf() ? level1 : level2;
}
