/**
 * File:     WordConstants.ts
 *
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     16.02.2023
 */

export class WordConstants {
  /**
   * The hyphen escape character.
   */
  static readonly hyphenEscapeCharacter: string = '⨬';
  
  /**
   * The equal escape character.
   */
  static readonly equalEscapeCharacter: string = '≑';
  
  /**
   * The ligature.
   */
  static readonly ligature: string = '˽';

  /**
   * The brackets.
   */
  static readonly brackets: string = '〉〈';
  
  /**
   * The alphabet symbols. Unicodes 12039 and 12471.
   */
  static readonly alphabetSymbols: string = '𒀹𒑱';

  /**
   * The alphabet in lower case.
   */
  static readonly alphabetLowerCase: string = 'a-zāáàâēéèêīíìîōôūúùûḫṣšṭġž';

  /**
   * The alphabet in upper case.
   */
  static readonly alphabetUpperCase: string = 'A-ZĀÁÀÂĒÉÈÊĪÍÌÎŌÔŪÚÙÛḪṢŠṬĠŽ';

  /**
   * The alphabet.
   */
  static readonly alphabet: string = WordConstants.alphabetLowerCase + WordConstants.alphabetUpperCase + WordConstants.alphabetSymbols;

  /**
   * The index digits.
   */
  static readonly indexDigits: string = '₀₁₂₃₄₅₆₇₈₉ₓ';

  /**
   * The deleri (erased / Rasur).
   */
  static readonly deleri: string = '*';

  /**
   * The lesion and delete alphabet.
   */
  static readonly lesionDeleteAlphabet: string = '\\[\\]⸢⸣';

  /**
   * The delimiter alphabet.
   */
  static readonly delimiterAlphabet: string = WordConstants.lesionDeleteAlphabet + '\\' + WordConstants.deleri + WordConstants.brackets;

  /**
   * The text evaluation escaped alphabet.
   */
  static readonly textEvaluationAlphabet: string = '⓵⓶⓷⓸';
            
  /**
   * The subscript.
   */
  static readonly subscript: string = '|';

  /**
   * The subscript regular expression.
   */
  static readonly subscriptRegularExpression: string = '(|' + '\\' + WordConstants.subscript + '[\\' + WordConstants.subscript + WordConstants.alphabet
    + '\\d' + WordConstants.indexDigits + WordConstants.delimiterAlphabet + WordConstants.textEvaluationAlphabet + ']*'+ ')';

  /**
   * The pattern for Gods names.
   */
  static readonly patternGodName: RegExp = new RegExp('(°D°)(10|15|20|30|50)', 'g');

  /**
   * The pattern for text with hyphens and escaped hyphens.
   */
  static readonly patternHyphenAndEscape: RegExp = new RegExp('([\\-=' + WordConstants.hyphenEscapeCharacter + WordConstants.equalEscapeCharacter + ']{1})' + '([^\\-=' + WordConstants.hyphenEscapeCharacter + WordConstants.equalEscapeCharacter + ']*)', 'g');

}

export function matchesFullStringRegularExpression(regularExpression: string): string {
  return '^' + regularExpression + '$';
}
	

