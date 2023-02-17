/**
 * File:     FractionNumber.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core.data
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     21.12.2022
 */


import { Fragment } from './fragment/Fragment';


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
  private static readonly alphabet:  string = '\\d';

  /**
	 * The pattern for numbers.
	 */
  static readonly pattern:  RegExp = new RegExp('(' + FractionNumber.alphabet + ')/(' + FractionNumber.alphabet + ')');

  /**
	 * The available glyphs.
	 */
  static readonly availableGlyphs:  string = '½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞';

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
	 * @param text        The text.
	 * @param numerator   The numerator.
	 * @param denominator The denominator.
	 * @since 11
	 */
  constructor(text: string, numerator: string, denominator: string) {
    super(text);

    this.numerator = parseInt(numerator);
    this.denominator = parseInt(denominator);
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
  public getGlyph():  string | null {
    switch (this.denominator) {
    case 2:
      return this.numerator === 1 ? '½' : null;

    case 3:
      switch (this.numerator) {
      case 1:
        return '⅓';

      case 2:
        return '⅔';

      default:
        return null;
      }

    case 4:
      switch (this.numerator) {
      case 1:
        return '¼';

      case 3:
        return '¾';

      default:
        return null;
      }

    case 5:
      switch (this.numerator) {
      case 1:
        return '⅕';

      case 2:
        return '⅖';

      case 3:
        return '⅗';

      case 4:
        return '⅘';

      default:
        return null;
      }

    case 6:
      switch (this.numerator) {
      case 1:
        return '⅙';

      case 5:
        return '⅚';

      default:
        return null;
      }

    case 8:
      switch (this.numerator) {
      case 1:
        return '⅛';

      case 3:
        return '⅜';

      case 5:
        return '⅝';

      case 7:
        return '⅞';

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
  public static getFractionNumber(glyph: string):  FractionNumber | null {
    if (glyph.length != 1)
      return null;
    else
      switch (glyph) {
      case '½':
        return new  FractionNumber('1/2', '1', '2');

      case '⅓':
        return new  FractionNumber('1/3', '1', '3');

      case '⅔':
        return new  FractionNumber('2/3', '2', '3');

      case '¼':
        return new  FractionNumber('1/4', '1', '4');

      case '¾':
        return new  FractionNumber('3/4', '3', '4');

      case '⅕':
        return new  FractionNumber('1/5', '1', '5');

      case '⅖':
        return new  FractionNumber('2/5', '2', '5');

      case '⅗':
        return new  FractionNumber('3/5', '3', '5');

      case '⅘':
        return new  FractionNumber('4/5', '4', '5');

      case '⅙':
        return new  FractionNumber('1/6', '1', '6');

      case '⅚':
        return new  FractionNumber('5/6', '5', '6');

      case '⅛':
        return new  FractionNumber('1/8', '1', '8');

      case '⅜':
        return new  FractionNumber('3/8', '3', '8');

      case '⅝':
        return new  FractionNumber('5/8', '5', '8');

      case '⅞':
        return new  FractionNumber('7/8', '7', '8');

      default:
        return null;
      }
  }
}
