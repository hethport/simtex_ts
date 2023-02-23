/**
 * File:     Word.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core.data
 *
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     19.12.2022
 */

import {AkkadianPreposition} from './AkkadianPreposition';
import {Akkadogram} from './Akkadogram';
import {Basic} from './Basic';
import {Data} from './Data';
import {DegreeSign} from './DegreeSign';
import {Delimiter} from './Delimiter';
import {Determinative} from './Determinative';
import {FractionNumber} from './FractionNumber';
import {Glossing} from './Glossing';
import {LanguageChange} from './LanguageChange';
import {LanguageChangeType} from './LanguageChangeType';
import {NotImplemented} from './NotImplemented';
import {Sumerogram} from './Sumerogram';
import {UndefinedDegreeSign} from './UndefinedDegreeSign';
import {LineEntity} from '../LineEntity';
import {LineSource} from '../LineSource';
import {Status} from '../Status';
import {StatusEvent} from '../StatusEvent';
import {StatusEventCode} from '../StatusEventCode';
import {StatusLevel} from '../StatusLevel';
import {Breakdown} from './fragment/Breakdown';
import {Fragment} from './fragment/Fragment';
import {FragmentBreakdownType} from './fragment/FragmentBreakdownType';
import {MetadataPosition} from './fragment/MetadataPosition';
import {Number} from './Number';
import {XmlElementNode, xmlElementNode, XmlNode} from 'simple_xml';
import {ParagraphLanguageType , defaultParagraphLanguage} from '../metadata/ParagraphLanguageType';

/**
 * Defines words.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 * @since 11
 */
export class Word implements LineEntity {
  static readonly xmlTag: string = 'w';
  /**
   * The hyphen escape character.
   */
  private static readonly hyphenEscapeCharacter: string = Data.spaceEscapeCharacter;

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
  public static readonly alphabet: string = Word.alphabetLowerCase + Word.alphabetUpperCase;

  /**
   * The index digits.
   */
  static readonly indexDigits: string | null = '₀₁₂₃₄₅₆₇₈₉ₓ';

  /**
   * The deleri (erased / Rasur).
   */
  public static readonly deleri: string | null = '*';

  /**
   * The delimiter alphabet.
   */
  public static readonly delimiterAlphabet: string = '\\[\\]⸢⸣〉〈\\' + Word.deleri;

  /**
   * The subscript.
   */
  public static readonly subscript: string = '|';

  /**
   * The subscript regular expression.
   */
  static readonly subscriptRegularExpression: string = '(|' + '\\' + Word.subscript + '[\\' + Word.subscript + Word.alphabet
    + '\\d' + Word.indexDigits + Word.delimiterAlphabet + ']*' + ')';

  /**
   * The pattern for Gods names.
   */
  protected static readonly godsNamepattern: RegExp = new RegExp('(°D°)(10|30)');

  /**
   * The pattern for text with hyphens and escaped hyphens.
   */
  private static readonly patternHyphenAndEscape: RegExp = new RegExp('([\\-' + Word.hyphenEscapeCharacter + ']{1})' + '([^\\-' + Word.hyphenEscapeCharacter + ']*)');

  /**
   * The status.
   */
  private readonly status: Status = new Status();

  /**
   * The paragraph language.
   */
  private readonly paragraphLanguage:  ParagraphLanguageType;

  /**
   * The text.
   */
  private readonly text: string;

  /**
   * The normalized text.
   */
  private readonly normalizedText: string;

  /**
   * The fragments.
   */
  private readonly fragments: Fragment[];

  /**
   * The deleri ('*' / erased / Rasur) position.
   */
  private deleriPosition: MetadataPosition = MetadataPosition.initial;

  /**
	 * The language change.
	 */
  private languageChange: LanguageChangeType | null = null;
	
  /**
   * Creates a word.
   *
   * @param paragraphLanguage The paragraph language. If null, use default
   *                          language.
   * @param word The word.
   * @since 11
   */
  public constructor(paragraphLanguage: ParagraphLanguageType | null, word: string) {
    this.text = word;
    this.normalizedText = Word.normalize(this.text);

    this.paragraphLanguage = paragraphLanguage == null ? defaultParagraphLanguage()
      : paragraphLanguage;
					
    this.fragments = this.parse(this.normalizedText);

    for (const fragment of this.fragments)
      this.status.addLevel(fragment.getStatus());

    if (MetadataPosition.initial != this.deleriPosition)
      this.status.add(new StatusEvent(StatusLevel.moderate, StatusEventCode.required,
        'missed final deleri (\'*\' / erased / Rasur).'));
  }

  /**
   * Returns the normalized text.
   *
   * @param text The text to normalize.
   * @return The normalized text.
   * @since 11
   */
  private static normalize(text: string): string {
    if (text.trim().length == 0)
      return '';
    else {
      text = text.trim();

      if ('><' == text)
        return '\u12270';
      if (text.match('^[' + FractionNumber.availableGlyphs + ']{1}$')) {
        const fractionNumber = FractionNumber.getFractionNumber(text);
        // the parser does not expect glyphs for fractions
        let fractionNumberText = null;
        if (fractionNumber != null) {
          fractionNumberText = fractionNumber.getText();
        }
        return fractionNumberText == null ? '' : fractionNumberText;
      } else
        return text.replace('=', '⸗')

          .replace('h', 'ḫ').replace('H', 'Ḫ')

          .replace('<', '〈').replace('>', '〉').replace('〈-', '-〈').replace('-〉', '〉-')

          .replace(';', '\u12039').replace(':', '\u12471')

          .replace('§§', '===').replace('§', '¬¬¬');
    }
  }

  /**
   * Parses the text and returns the fragments.
   *
   * @param text The text to parse.
   * @return The fragments.
   * @since 11
   */
  private parse(text: string): Fragment[] {
    let fragments: Fragment[] = [];

    if (text.trim().length > 0) {
      // test for language changes
      if (text.startsWith('@'))
        fragments.push(new LanguageChange(text));
      else {
        // test for fraction numbers
        const match = text.match(FractionNumber.pattern);
        if (match) {
          fragments.push(new FractionNumber(text, match[1], match[2]));
        } else {
          /*
		   * extract the determinative and glossing, and recursively the remainder
		   * fragments
		   */
          const matches = text.matchAll(DegreeSign.pattern);
          let index = 0;
          for (const match of matches) {
            if (match.index && index < match.index) {
              fragments = fragments.concat(this.parseSegment(text.substring(index, match.index)));
            }
            fragments.push(this.getDeterminativeGlossing(match[0], match[1]));
            if (match.index != null) {
              index = match.index + match[0].length;
            }
          }
	
          if (index < text.length) {
            fragments = fragments.concat(this.parseSegment(text.substring(index, text.length - 1)));
          }
        }
      }
    }

    return fragments;
  }

  /**
   * Returns the determinative/glossing fragment depending on the content. On
   * troubles returns an
   *
   * @param segment The segment.
   * @param content The content.
   * @return The fragment.
   * @since 11
   */
  private getDeterminativeGlossing(segment: string, content: string): Fragment {
    let fragment: Fragment;

    if (content.trim().length == 0 || content.includes(' ')) {
      fragment = this.getFragment(FragmentBreakdownType.UndefinedDegreeSign, null, segment);

      fragment.getStatus()
        .add(new StatusEvent(StatusLevel.serious, StatusEventCode.undefined, 'degree sign segment \''
          + segment + '\' contains ' + (content.length == 0 ? 'an empty string' : 'space') + '.'));
    } else if (content == 'm' || content == 'm.D' || content == 'f' || content == 'f.D'
      || content.match(Determinative.pattern))
      fragment = this.getFragment(FragmentBreakdownType.Determinative, segment, content);
    else if (content.match(Glossing.pattern))
      fragment = this.getFragment(FragmentBreakdownType.Glossing, segment, content);
    else {
      fragment = this.getFragment(FragmentBreakdownType.UndefinedDegreeSign, null, segment);

      fragment.getStatus().add(new StatusEvent(StatusLevel.serious, StatusEventCode.malformed,
        'degree sign segment \'' + segment + '\' is malformed.'));
    }

    return fragment;
  }

  /**
   * Parses the segment.
   *
   * @param segment The segment to parse.
   * @return The fragments.
   * @since 11
   */
  private parseSegment(segment: string): Fragment[] {
    let fragments: Fragment[] = [];

    /*
	   * extract the prepositions, and recursively the remainder fragments
	   */
    const matches = segment.matchAll(AkkadianPreposition.pattern);
    let index = 0;
    for (const match of matches) {
      if (match.index && index < match.index) {
        fragments = fragments.concat(this.parseText(segment.substring(index, match.index)));
      }
      fragments.push(new AkkadianPreposition(match[0]));
      if (match.index != null) {
        index = match.index + match[0].length;
      }
    }

    if (index < segment.length) {
      fragments = fragments.concat(this.parseText(segment.substring(index, segment.length - 1)));
    }

    return fragments;
  }

  /**
   * Parses the text.
   *
   * @param text The text to parse.
   * @return The fragments.
   * @since 11
   */
  private parseText(text: string): Fragment[] {
    const fragments: Fragment[] = [];
    const hyphenFirstIndex: number = text.indexOf('-');

    let type: FragmentBreakdownType | null = null;
    let buffer: string [] = [];

    // The text does not start with hyphen
    if (hyphenFirstIndex != 0) {
      const part: string = hyphenFirstIndex === -1 ? text : text.substring(0, hyphenFirstIndex);

      if (part.startsWith('_')) {
        if (Word.isAkkadogramType(part.substring(1))) {
          type = FragmentBreakdownType.Akkadogram;

          buffer.push(part.substring(1));
        } else
          fragments.push(this.getFragment(FragmentBreakdownType.NotImplemented, null, part));
      } else if (Word.isDelimiterType(part))
        fragments.push(this.getFragment(FragmentBreakdownType.Delimiter, null, part));
      else if (Word.isNumberType(part))
        fragments.push(this.getFragment(FragmentBreakdownType.Number, null, part));
      else if (Word.isSumerogramType(part)) {
        type = FragmentBreakdownType.Sumerogram;

        buffer.push(part);
      } else if (Word.isBasicType(part)) {
        type = FragmentBreakdownType.Basic;

        buffer.push(part);
      } else
        fragments.push(this.getFragment(FragmentBreakdownType.NotImplemented, null, part));
    }

    // The text parts after hyphens
    if (hyphenFirstIndex >= 0) {
      // escape required hyphens
      text = text.replace('--', Word.hyphenEscapeCharacter);

      const parseText = hyphenFirstIndex == 0 ? text : text.substring(hyphenFirstIndex);
      const matches = parseText.matchAll(Word.patternHyphenAndEscape);

      for (const match of matches) {
        if (Word.hyphenEscapeCharacter == match[1]) {
          if (Word.isSumerogramType(match[2])) {
            if (type !== null && FragmentBreakdownType.Sumerogram != type) {
              fragments.push(this.getFragment(type, null, buffer.join('')));
              buffer = [];
            }

            type = FragmentBreakdownType.Sumerogram;

            buffer.push('-' + match[2]);
          } else {
            fragments.push(this.getFragment(FragmentBreakdownType.NotImplemented, null, '--' + match[2]));
          }
        } else if (Word.isDelimiterType(match[2])) {
          if (type != null) {
            fragments.push(this.getFragment(type, null, buffer.join('')));
            type = null;
            buffer = [];
          }

          fragments.push(this.getFragment(FragmentBreakdownType.Delimiter, null, '-' + match[2]));
        } else if (Word.isNumberType(match[2])) {
          if (type != null) {
            fragments.push(this.getFragment(type, null, buffer.join('')));

            type = null;
            buffer = [];
          }

          fragments.push(this.getFragment(FragmentBreakdownType.Number, null, '-' + match[2]));
        } else if (Word.isAkkadogramType(match[2])) {
          if (type != null && FragmentBreakdownType.Akkadogram != type) {
            fragments.push(this.getFragment(type, null, buffer.join('')));
            buffer = [];
          }

          type = FragmentBreakdownType.Akkadogram;

          buffer.push('-' + match[2]);
        } else if (Word.isBasicType(match[2])) {
          if (type != null && FragmentBreakdownType.Basic != type) {
            fragments.push(this.getFragment(type, null, buffer.join('')));
            buffer = [];
          }

          type = FragmentBreakdownType.Basic;

          buffer.push('-' + match[2]);
        } else {
          fragments.push(this.getFragment(FragmentBreakdownType.NotImplemented, null, '-' + match[2]));
        }
      }

    }

    if (type !== null)
      fragments.push(this.getFragment(type, null, buffer.join('')));

    return fragments;
  }

  /**
   * Returns the paragraph language.
   *
   * @return The paragraph language.
   * @since 11
   */
  public getParagraphLanguage():  ParagraphLanguageType {
    return this.paragraphLanguage;
  }

  /**
	 * Returns true if the word is of type language change.
	 * 
	 * @return True if the word is of type language change.
	 * @since 11
	 */
  public isLanguageChangeType(): boolean {
    return this.fragments.length == 1 && (this.fragments[0] instanceof LanguageChange);
  }

  /**
	 * Returns the language change.
	 *
	 * @return The language change.
	 * @since 11
	 */
  public getLanguageChangeType() : LanguageChangeType | null {
    const languageChange: LanguageChange | null = (this.fragments[0] instanceof LanguageChange) ?
		this.fragments[0] as LanguageChange : null;
		
    return languageChange == null ? null : languageChange.getLanguage();
  }

  /**
	 * Returns true if the language change is set.
	 *
	 * @return True if the language change is set.
	 * @since 11
	 */
  public  isLanguageChangeSet() : boolean {
    return this.languageChange != null;
  }

  /**
	 * Returns the language change.
	 *
	 * @return The language change.
	 * @since 11
	 */
  public getLanguageChange(): LanguageChangeType | null {
    return this.languageChange;
  }

  /**
	 * Set the language change.
	 *
	 * @param language The language to set.
	 * @since 11
	 */
  public setLanguageChange(language: LanguageChangeType | null) {
    this.languageChange = language;
  }

  /**
   * Returns the fragment for given text type without segment.
   *
   * @param type   The text type.
   * @param segment The Segment.
   * @param buffer The text.
   * @return The fragment.
   * @since 11
   */
  private getFragment(type: FragmentBreakdownType, segment: string | null, text: string): Fragment {
    let fragment: Breakdown;

    switch (type) {
    case FragmentBreakdownType.Determinative:
      fragment = new Determinative(this.deleriPosition, segment, text);
      break;

    case FragmentBreakdownType.Glossing:
      fragment = new Glossing(this.deleriPosition, segment, text);
      break;

    case FragmentBreakdownType.UndefinedDegreeSign:
      fragment = new UndefinedDegreeSign(this.deleriPosition, text);
      break;

    case FragmentBreakdownType.Delimiter:
      fragment = new Delimiter(this.deleriPosition, text);
      break;

    case FragmentBreakdownType.Number:
      fragment = new Number(this.deleriPosition, text);
      break;

    case FragmentBreakdownType.Basic:
      fragment = new Basic(this.deleriPosition, text);
      break;

    case FragmentBreakdownType.Akkadogram:
      fragment = new Akkadogram(this.deleriPosition, text);
      break;

    case FragmentBreakdownType.Sumerogram:
      fragment = new Sumerogram(this.deleriPosition, text);
      break;

    case FragmentBreakdownType.NotImplemented:
    default:
      this.getStatus().add(new  StatusEvent(StatusLevel.critical, StatusEventCode.parser, 'the word \'' + text + '\' can not be parsed.'));

      return new NotImplemented(text);
    }

    this.deleriPosition = fragment.getDeleriPosition();

    return fragment;
  }


  /**
   * Returns true if the given text is of type number.
   *
   * @param text The text.
   * @return True if the given text is of type number.
   * @since 11
   */
  private static isNumberType(text: string): boolean {
    return text.match(Number.pattern) ? true : false;
  }

  /**
   * Returns true if the given text is of type delimiter.
   *
   * @param text The text.
   * @return True if the given text is of type delimiter.
   * @since 11
   */
  private static isDelimiterType(text: string): boolean {
    return text.match(Delimiter.pattern) ? true : false;
  }

  /**
   * Returns true if the given text is of type basic.
   *
   * @param text The text.
   * @return True if the given text is of type basic.
   * @since 11
   */
  private static isBasicType(text: string): boolean {
    return text.match(Basic.pattern) ? true : false;
  }

  /**
   * Returns true if the given text is of type Akkadogram.
   *
   * @param text The text.
   * @return True if the given text is of type Akkadogram.
   * @since 11
   */
  private static isAkkadogramType(text: string): boolean {
    return text.match(Akkadogram.pattern) ? true : false;
  }

  /**
   * Returns true if the given text is of type Sumerogram.
   *
   * @param text The text.
   * @return True if the given text is of type Sumerogram.
   * @since 11
   */
  private static isSumerogramType(text: string): boolean {
    return text.match(Sumerogram.pattern) ? true : false;
  }

  /**
   * Parses the word.
   *
   * @param paragraphLanguage The paragraph language. If null, use default
   *                          language.
   * @param text The text to parse.
   * @return The word.
   * @since 11
   */
  public static parseWord(paragraphLanguage: ParagraphLanguageType | null, text: string): Word {
    const normalized: string = LineSource.normalize(text);
    
    return new Word(paragraphLanguage, normalized);
  }

  /**
   * Returns the status.
   *
   * @return The status.
   * @since 11
   */
  public getStatus(): Status {
    return this.status;
  }

  /**
   * Returns the text.
   *
   * @return The text.
   * @since 11
   */
  public getText(): string {
    return this.text;
  }

  /**
   * Returns the normalized text.
   *
   * @return The normalized text.
   * @since 11
   */
  public getNormalizedText(): string {
    return this.normalizedText;
  }

  /**
   * Returns the fragments.
   *
   * @return The fragments.
   * @since 11
   */
  public getFragments(): Fragment[] {
    return this.fragments;
  }

  public exportXml(): XmlElementNode {
    let children: XmlNode[] = [];

    for (const fragment of this.fragments) {
      const element: XmlNode = fragment.exportXml();
      switch (element.tagName) {
      case Delimiter.xmlTag:
      case Basic.xmlTag:
        children = children.concat(element.children);
        break;
      case UndefinedDegreeSign.xmlTag:
        // ignore tag
        break;
      default:
        children.push(element);
        break;
      }
    }

    return xmlElementNode(Word.xmlTag, {}, children);
  }
}
