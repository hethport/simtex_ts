export class WordConstants {
  /**
   * The hyphen escape character.
   */
  static readonly hyphenEscapeCharacter: string = '⊕';
  /**
   * The alphabet in lower case.
   */
  static readonly alphabetLowerCase: string = 'a-záàéèíìúùṣṭšḫ';

  /**
   * The alphabet in upper case.
   */
  static readonly alphabetUpperCase: string = 'A-ZÁÀÉÈÍÌÚÙṢṬŠḪ';

  /**
   * The alphabet.
   */
  static readonly alphabet: string = WordConstants.alphabetLowerCase + WordConstants.alphabetUpperCase;

  /**
   * The index digits.
   */
  static readonly indexDigits: string | null = '₀₁₂₃₄₅₆₇₈₉ₓ';

  /**
   * The deleri (erased / Rasur).
   */
  static readonly deleri: string | null = '*';

  /**
   * The delimiter alphabet.
   */
  static readonly delimiterAlphabet: string = '\\[\\]⸢⸣〉〈\\' + WordConstants.deleri;

  /**
   * The subscript.
   */
  static readonly subscript: string = '|';

  /**
   * The subscript regular expression.
   */
  static readonly subscriptRegularExpression: string = '(|' + '\\' + WordConstants.subscript + '[\\' + WordConstants.subscript + WordConstants.alphabet
    + '\\d' + WordConstants.indexDigits + WordConstants.delimiterAlphabet + ']*' + ')';

  /**
   * The pattern for Gods names.
   */
  static readonly godsNamepattern: RegExp = new RegExp('(°D°)(10|30)', 'g');

  /**
   * The pattern for text with hyphens and escaped hyphens.
   */
  static readonly patternHyphenAndEscape: RegExp = new RegExp('([\\-' + WordConstants.hyphenEscapeCharacter + ']{1})' + '([^\\-' + WordConstants.hyphenEscapeCharacter + ']*)', 'g');

}

export function matchesFullStringRegularExpression(regularExpression: string): string {
  return '^' + regularExpression + '$';
}
	

