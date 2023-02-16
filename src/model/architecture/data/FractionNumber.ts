/**
 * File:     FractionNumber.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core.data
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     21.12.2022
 */



import { java, S } from "../../../../../../../../../usr/bin/java";
import { Fragment } from "./fragment/Fragment";




/**
 * Defines fraction numbers.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 * @since 11
 */
export  class FractionNumber extends Fragment {
	/**
	 * The alphabet.
	 */
	private static readonly alphabet:  java.lang.String | null = S`\\d`;

	/**
	 * The pattern for numbers.
	 */
	protected static readonly pattern:  java.util.regex.Pattern | null = java.util.regex.Pattern.compile(S`(` + FractionNumber.alphabet + S`)/(` + FractionNumber.alphabet + S`)`);

	/**
	 * The available glyphs.
	 */
	protected static readonly availableGlyphs:  java.lang.String | null = S`½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞`;

	/**
	 * The numerator.
	 */
	private readonly numerator:  number;

	/**
	 * The denominator.
	 */
	private readonly denominator:  number;

	/**
	 * Creates a fraction number.
	 * 
	 * @param numerator   The numerator.
	 * @param denominator The denominator.
	 * @since 11
	 */
	/* eslint-disable constructor-super, @typescript-eslint/no-unsafe-call */
private constructor(numerator: java.lang.String| null, denominator: java.lang.String| null);

	/**
	 * Creates a fraction number.
	 * 
	 * @param text        The text.
	 * @param numerator   The numerator.
	 * @param denominator The denominator.
	 * @since 11
	 */
	public constructor(text: java.lang.String| null, numerator: java.lang.String| null, denominator: java.lang.String| null);
private constructor(numeratorOrText: java.lang.String | null, denominatorOrNumerator: java.lang.String | null, denominator?: java.lang.String | null) {
const $this = (numeratorOrText: java.lang.String | null, denominatorOrNumerator: java.lang.String | null, denominator?: java.lang.String | null): void => {
if (denominator === undefined) {
		$this(numerator + S`/` + denominator, numerator, denominator);
	}
 else  {
let text = numeratorOrText as java.lang.String;
let numerator = denominatorOrNumerator as java.lang.String;
		super(text);

		this.numerator = java.lang.Integer.parseInt(numerator);
		this.denominator = java.lang.Integer.parseInt(denominator);
	}
};

$this(numeratorOrText, denominatorOrNumerator, denominator);

}
/* eslint-enable constructor-super, @typescript-eslint/no-unsafe-call */

	/**
	 * Returns the numerator.
	 *
	 * @return The numerator.
	 * @since 11
	 */
	public getNumerator():  number {
		return this.numerator;
	}

	/**
	 * Returns the denominator.
	 *
	 * @return The denominator.
	 * @since 11
	 */
	public getDenominator():  number {
		return this.denominator;
	}

	/**
	 * Returns the glyph.
	 * 
	 * @return The glyph. Null if not available.
	 * @since 11
	 */
	public getGlyph():  java.lang.String | null {
		switch (this.denominator) {
		case 2:
			return this.numerator === 1 ? S`½` : null;

		case 3:
			switch (this.numerator) {
			case 1:
				return S`⅓`;

			case 2:
				return S`⅔`;

			default:
				return null;
			}

		case 4:
			switch (this.numerator) {
			case 1:
				return S`¼`;

			case 3:
				return S`¾`;

			default:
				return null;
			}

		case 5:
			switch (this.numerator) {
			case 1:
				return S`⅕`;

			case 2:
				return S`⅖`;

			case 3:
				return S`⅗`;

			case 4:
				return S`⅘`;

			default:
				return null;
			}

		case 6:
			switch (this.numerator) {
			case 1:
				return S`⅙`;

			case 5:
				return S`⅚`;

			default:
				return null;
			}

		case 8:
			switch (this.numerator) {
			case 1:
				return S`⅛`;

			case 3:
				return S`⅜`;

			case 5:
				return S`⅝`;

			case 7:
				return S`⅞`;

			default:
				return null;
			}

		default:
			return null;

		}
	}

	/**
	 * Returns the fraction number for given glyph.
	 * 
	 * @param glyph The glyph.
	 * @return The fraction number for given glyph. Null if not available.
	 * @since 11
	 */
	public static getFractionNumber(glyph: java.lang.String| null):  FractionNumber | null {
		if (glyph === null || glyph.length() !== 1)
			return null;
		else
			switch (glyph) {
			case S`½`:
				return new  FractionNumber(S`1`, S`2`);

			case S`⅓`:
				return new  FractionNumber(S`1`, S`3`);

			case S`⅔`:
				return new  FractionNumber(S`2`, S`3`);

			case S`¼`:
				return new  FractionNumber(S`1`, S`4`);

			case S`¾`:
				return new  FractionNumber(S`3`, S`4`);

			case S`⅕`:
				return new  FractionNumber(S`1`, S`5`);

			case S`⅖`:
				return new  FractionNumber(S`2`, S`5`);

			case S`⅗`:
				return new  FractionNumber(S`3`, S`5`);

			case S`⅘`:
				return new  FractionNumber(S`4`, S`5`);

			case S`⅙`:
				return new  FractionNumber(S`1`, S`6`);

			case S`⅚`:
				return new  FractionNumber(S`5`, S`6`);

			case S`⅛`:
				return new  FractionNumber(S`1`, S`8`);

			case S`⅜`:
				return new  FractionNumber(S`3`, S`8`);

			case S`⅝`:
				return new  FractionNumber(S`5`, S`8`);

			case S`⅞`:
				return new  FractionNumber(S`7`, S`8`);

			default:
				return null;
			}
	}
}
