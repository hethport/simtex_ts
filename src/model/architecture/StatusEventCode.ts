/**
 * File:     StatusEventCode.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core
 *
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     16.02.2023
 */

export enum StatusEventCode {
	parser,
  required,
  unexpected,
  empty,
  undefined,
  unknown,
  malformed,
  trim,
}
