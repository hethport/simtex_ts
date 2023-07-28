/**
 * File:     StatusLevel.ts
 *
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     16.02.2023
 */

export enum StatusLevel {
  ok, info, error, critical,
}

/**
 * Returns the level with higher severity.
 *
 * @param level1 The level.
 * @param level2 The level.
 * @return The level with higher severity.
 */
export function maxStatusLevel(level1: StatusLevel, level2: StatusLevel): StatusLevel {
  return level1.valueOf() > level2.valueOf() ? level1 : level2;
}
