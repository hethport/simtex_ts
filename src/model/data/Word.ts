/**
 * File:     Word.ts
 *
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     19.12.2022
 */

import {Akkadogram} from './Akkadogram';
import {Basic} from './Basic';
import {DegreeSign} from './DegreeSign';
import {Delimiter} from './Delimiter';
import {Determinative} from './Determinative';
import {FractionNumber} from './FractionNumber';
import {Glossing} from './Glossing';
import {LanguageChange} from './LanguageChange';
import {convertToAbbreviation, LanguageChangeType} from './LanguageChangeType';
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
import {XmlElementNode, xmlElementNode, XmlNode, xmlTextNode} from 'simple_xml';
import {ParagraphLanguageType , defaultParagraphLanguage} from '../metadata/ParagraphLanguageType';
import {WordConstants} from './WordConstants';
import { Ligature } from './Ligature';
import { Gap } from './Gap';
import { TextEvaluation } from './fragment/TextEvaluation';
import { PrefixSuffix } from './PrefixSuffix';
import { Marker } from '../metadata/Marker';
import { Tag } from '../metadata/Tag';
import { TagType } from '../metadata/TagType';

/**
 * Defines words.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 */
export class Word implements LineEntity {
  static readonly xmlTag: string = 'w';
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
  private readonly fragments: Fragment[] = [];

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
   */
  public constructor(paragraphLanguage: ParagraphLanguageType | null, word: string) {
    this.text = word;
    this.normalizedText = Word.normalize(this.text);
    
    this.paragraphLanguage = paragraphLanguage == null ? defaultParagraphLanguage()
      : paragraphLanguage;
					
    const fragments = this.parse(this.normalizedText);
    const processedFragments: Fragment[] = [];

    for (let index = 0; index < fragments.length; index++) {
      const fragment = fragments[index];
      
      processedFragments.push(fragment);
      
      if (index < fragments.length - 1 && fragment instanceof Determinative && fragment.isGodName()) {
        const godNumber = fragments[index + 1];
        
        if (godNumber instanceof Number && Determinative.isGodNumber(godNumber.getInteger())) {
          index++;
          
          // text is never null, since it is a god number
          const text = godNumber.getText();
          processedFragments.push(this.getFragment(FragmentBreakdownType.Sumerogram, null, text == null ? '' : text ));
        }
      }
    }
    
    // Text evaluation
    for (let index = 0; index < processedFragments.length; index++) {
      const fragment = processedFragments[index];

      this.fragments.push(fragment);

      if (fragment instanceof Breakdown) {
        const breakdown = fragment as Breakdown;
        
       console.log('\t--> HB type Glossing ' + (breakdown instanceof Glossing));
       if (breakdown instanceof Glossing) {
          const textEvaluations = breakdown.extractTextEvaluations();
          
          if (textEvaluations.length > 0) {
            if (index + 1 < processedFragments.length && processedFragments[index + 1] instanceof Breakdown) {
              const moveTextEvaluations = processedFragments[index + 1] as Breakdown;
              
              moveTextEvaluations.insertTextEvaluations(textEvaluations);
			} else {
              const  buffer: string[] = [];
              for (const textEvaluation of textEvaluations)
                buffer.push(textEvaluation.getText());
              
              this.fragments.push(this.getFragment(FragmentBreakdownType.Basic, null, buffer.join('')));
			}
          }
        } else {
          fragment.normalizeTextEvaluations();
          
          if (breakdown instanceof Determinative) {
			if (index + 1 < processedFragments.length && processedFragments[index + 1] instanceof Breakdown) {
              const moveTextEvaluations = processedFragments[index + 1] as Breakdown;
              
              const textEvaluation = moveTextEvaluations.removeBeginTextEvaluation();
				
              if (textEvaluation != null) {
                fragment.addTextEvaluation(textEvaluation);
              }
			}
          }
        }
      }
    }

    if (MetadataPosition.initial != this.deleriPosition)
      this.status.add(new StatusEvent(StatusLevel.moderate, StatusEventCode.required,
        'missed final deleri (\'*\' / erased / Rasur).'));
     
  }

  /**
   * Returns the normalized text. Furthermore, it is escaped for text evaluation.
   *
   * @param text The text to normalize.
   * @return The normalized text.
   */
  private static normalize(text: string): string {
    if (text.trim().length == 0)
      return '';
    else {
      text = text.trim();

      if (text.match('^[' + FractionNumber.availableGlyphs + ']{1}$')) {
        const fractionNumber = FractionNumber.getFractionNumber(text);
        // the parser does not expect glyphs for fractions
        let fractionNumberText = null;
        if (fractionNumber != null) {
          fractionNumberText = fractionNumber.getText();
        }
        return fractionNumberText == null ? '' : fractionNumberText;
      } else
        return TextEvaluation.escape(text.replace(/h/g, 'ḫ').replace(/H/g, 'Ḫ')

          .replace(/</g, '〈').replace(/>/g, '〉').replace(/〈-/g, '-〈').replace(/-〉/g, '〉-')

          // Unicodes 12039
          .replace(/;/g, '𒀹')
          
          .replace(/\.\.\./g, '…')
          
          .replace(/\+_/g, '+')
          
          .replace(/°m°°\.°°D°/g, '°m.D°').replace(/°f°°\.°°D°/g, '°f.D°'));
    }
  }

  /**
   * Parses the text and returns the fragments.
   *
   * @param text The text to parse.
   * @return The fragments.
   */
  private parse(text: string): Fragment[] {
    let fragments: Fragment[] = [];
    
    if (text.trim().length > 0) {
      // test for language changes
      if (text.startsWith('@'))
        fragments.push(new LanguageChange(text));
      else if (text.match(Gap.pattern))
        fragments.push(new Gap(text));
      else  if (text.match(TextEvaluation.patternWord))
        fragments.push(this.getFragment(FragmentBreakdownType.Basic, null, text));
      else {
        // test for fraction numbers
        const match = text.match(FractionNumber.pattern);
        if (match) {
          const split: string[] = text.split('/');
          fragments.push(new FractionNumber(text, split[0], split[1]));
        } else {
          /*
           * extract the tags, and recursively the remainder fragments
           */
          const matches = text.matchAll(Marker.tagPattern);
          let index = 0;
          for (const match of matches) {
            if (match.index && index < match.index) {
              // Unicodes 12471
              fragments = fragments.concat(this.parseDeterminativeGlossing(text.substring(index, match.index).replace(/:/g, '𒑱')));
            }
            fragments.push(new Tag(false, match[0], match[1], match[2]));
            if (match.index != null) {
              index = match.index + match[0].length;
            }
          }

          if (index < text.length) {
           // Unicodes 12471
           fragments = fragments.concat(this.parseDeterminativeGlossing(text.substring(index).replace(/:/g, '𒑱')));
          }
        }
      }
    }

    return fragments;
  }

  /**
   * Parses the determinative/glossing.
   *
   * @param text The text to parse.
   * @return The fragments.
   */
  private parseDeterminativeGlossing(text: string): Fragment[] {
    let fragments: Fragment[] = [];

    /*
     * extract the determinative and glossing, and recursively the remainder
     * fragments
     */
    const matches = text.matchAll(DegreeSign.pattern);
    let index = 0;
    let suffixGlossing = '';
    for (const match of matches) {
      let prefixText = '';
      if (match.index && index < match.index) {
        prefixText = text.substring(index, match.index);
      }
      const prefixSuffix : PrefixSuffix = new PrefixSuffix();
      const fragment = this.getDeterminativeGlossing(match[0], match[1], prefixSuffix);
      
      prefixText = suffixGlossing.concat(prefixText, prefixSuffix.getPrefix().join(''));     
      if (prefixText != '')
        fragments = fragments.concat(this.parseLigature(prefixText));
      
      fragments.push(fragment);
      
      suffixGlossing = prefixSuffix.getSuffix().join('');
         
      if (match.index != null) {
        index = match.index + match[0].length;
      }
    }
    
    if (index < text.length) {
      suffixGlossing = suffixGlossing.concat(text.substring(index));
    }
	
    if (suffixGlossing != '') {
      fragments = fragments.concat(this.parseLigature(suffixGlossing));
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
   */
  private getDeterminativeGlossing(segment: string, content: string, prefixSuffix: PrefixSuffix): Fragment {
    let fragment: Fragment;

    if (content.trim().length == 0 || content.includes(' ')) {
      fragment = this.getFragment(FragmentBreakdownType.UndefinedDegreeSign, segment, content);

      fragment.getStatus()
        .add(new StatusEvent(StatusLevel.serious, StatusEventCode.undefined, 'degree sign segment \''
          + TextEvaluation.unescape(segment) + '\' contains ' + (content.length == 0 ? 'an empty string' : 'space') + '.'));
    } else if (content.match(Determinative.pattern))
      fragment = this.getFragment(FragmentBreakdownType.Determinative, segment, content);
    else if (content.match(Glossing.pattern)) {
      const bufferContent: string [] = [];     
      const bufferDotLesionDelete: string [][] = [];
           
      const matches = content.matchAll(Glossing.patternDotLesionDelete);
      for (const match of matches) {
        if (match[1] != '')
           bufferContent.push(match[1]);
        if (match[2] != '')
           bufferDotLesionDelete.push([match[2],bufferContent.join('')]);
      }
      
      if (bufferDotLesionDelete.length > 0) {
         content = bufferContent.join('');
         
         const isDi = content == 'di';
         let isLesionInFin = false;
         
         for(let i=0; i<bufferDotLesionDelete.length; i++){
           if ('.' == bufferDotLesionDelete[i][0])
              prefixSuffix.addSuffix('.');
           else {
             if (isDi) {
               if ('⸢' == bufferDotLesionDelete[i][0])
                 prefixSuffix.addPrefix(bufferDotLesionDelete[i][0]);
               else if ('⸣' == bufferDotLesionDelete[i][0])
                 prefixSuffix.addSuffix(bufferDotLesionDelete[i][0]);
               else {
                 // Case [ and ]
                 if ('' == bufferDotLesionDelete[i][1])
                   prefixSuffix.addPrefix(bufferDotLesionDelete[i][0]);
                 else if ('di' == bufferDotLesionDelete[i][1])
                   prefixSuffix.addSuffix(bufferDotLesionDelete[i][0]);
                 else {
                   // Case between d and i
                   if ('[' == bufferDotLesionDelete[i][0])
                     prefixSuffix.addSuffix(bufferDotLesionDelete[i][0]);
                   else
                     prefixSuffix.addPrefix(bufferDotLesionDelete[i][0]);
                     
                   isLesionInFin = true;
                 }
               }
             } else {
               if ('[' == bufferDotLesionDelete[i][0] || ']' == bufferDotLesionDelete[i][0]) {
                 isLesionInFin = true;
                 
                 if ('[' == bufferDotLesionDelete[i][0])
                   prefixSuffix.addSuffix(bufferDotLesionDelete[i][0]);
                 else
                   prefixSuffix.addPrefix(bufferDotLesionDelete[i][0]);
               } else {
                 if ('⸢' == bufferDotLesionDelete[i][0])
                   prefixSuffix.addPrefix(bufferDotLesionDelete[i][0]);
                 else
                   prefixSuffix.addSuffix(bufferDotLesionDelete[i][0]);
               }
             }
           }
         }
         
         if (isLesionInFin) {
           prefixSuffix.addPrefix('⸢');
           prefixSuffix.getSuffix().unshift('⸣');
         }
      }

      fragment = this.getFragment(FragmentBreakdownType.Glossing, segment, content);
    } else {
      fragment = this.getFragment(FragmentBreakdownType.UndefinedDegreeSign, segment, content);

      fragment.getStatus().add(new StatusEvent(StatusLevel.serious, StatusEventCode.malformed,
        'degree sign segment \'' + TextEvaluation.unescape(segment) + '\' is malformed.'));
    }

    return fragment;
  }

  /**
   * Parses the ligature.
   *
   * @param text The text to parse.
   * @return The fragments.
   */
  private parseLigature(text: string): Fragment[] {
    let fragments: Fragment[] = [];

    /*
     * extract the ligatures, and recursively the remainder fragments
     */
    const matches = text.matchAll(Ligature.pattern);
    let index = 0;
    for (const match of matches) {
      if (match.index && index < match.index) {
        fragments = fragments.concat(this.parseText(text.substring(index, match.index)));
      }
      
      fragments.push(new Ligature(match[0]));
      
      if (match.index != null) {
        index = match.index + match[0].length;
      }
    }

    if (index < text.length) {
      fragments = fragments.concat(this.parseText(text.substring(index)));
    }
    
    return fragments;
  }
  
  /**
   * Parses the text.
   *
   * @param text The text to parse.
   * @return The fragments.
   */
  private parseText(text: string): Fragment[] {
    const fragments: Fragment[] = [];
    const hyphenFirstIndex: number = text.indexOf('-');
    const equalFirstIndex: number = text.indexOf('=');
    const tagFirstIndex = hyphenFirstIndex < 0 ? equalFirstIndex : (equalFirstIndex < 0 ? hyphenFirstIndex : Math.min(hyphenFirstIndex, equalFirstIndex));

    let type: FragmentBreakdownType | null = null;
    let buffer: string [] = [];
    
    // The text does not start with hyphen/equal
    if (tagFirstIndex != 0) {
      const part: string = tagFirstIndex === -1 ? text : text.substring(0, tagFirstIndex);
      
      if (part.match(Akkadogram.patternStartingUnderscore)) {
        const akkadogram: string = part.replace('_', '');
		
        if (Word.isAkkadogramType(akkadogram)) {
          type = FragmentBreakdownType.Akkadogram;

          buffer.push(akkadogram);
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

    // The text parts after hyphens/equals
    if (tagFirstIndex >= 0) {
      // escape required hyphens
      text = text.replace(/--/g, WordConstants.hyphenEscapeCharacter).replace(/==/g, WordConstants.equalEscapeCharacter);

      const parseText = tagFirstIndex == 0 ? text : text.substring(tagFirstIndex);
      const matches = parseText.matchAll(WordConstants.patternHyphenAndEscape);

      for (const match of matches) {
        if (match[2] == '') {
          if (type == null)
            type = FragmentBreakdownType.Basic;

          buffer.push(match[1] == '-' || WordConstants.hyphenEscapeCharacter == match[1] ? '-' : '=');
        } else if (WordConstants.hyphenEscapeCharacter == match[1] || WordConstants.equalEscapeCharacter == match[1]) {
          if (Word.isSumerogramType(match[2])) {
            if (type !== null && FragmentBreakdownType.Sumerogram != type) {
              fragments.push(this.getFragment(type, null, buffer.join('')));
              buffer = [];
            }

            type = FragmentBreakdownType.Sumerogram;

            buffer.push((WordConstants.hyphenEscapeCharacter == match[1] ? '-' : '=') + match[2]);
          } else {
            fragments.push(this.getFragment(FragmentBreakdownType.NotImplemented, null, (WordConstants.hyphenEscapeCharacter == match[1] ? '--' : '==') + match[2]));
          }
        } else if (Word.isDelimiterType(match[2])) {
          if (type != null) {
            fragments.push(this.getFragment(type, null, buffer.join('')));
            type = null;
            buffer = [];
          }

          fragments.push(this.getFragment(FragmentBreakdownType.Delimiter, null, match[1] + match[2]));
        } else if (Word.isNumberType(match[2])) {
          if (type != null) {
            fragments.push(this.getFragment(type, null, buffer.join('')));

            type = null;
            buffer = [];
          }

          fragments.push(this.getFragment(FragmentBreakdownType.Number, null, match[1] + match[2]));
        } else if (Word.isAkkadogramType(match[2])) {
          if (type != null && FragmentBreakdownType.Akkadogram != type) {
            fragments.push(this.getFragment(type, null, buffer.join('')));
            buffer = [];
          }

          type = FragmentBreakdownType.Akkadogram;

          buffer.push(match[1] + match[2]);
        } else if (Word.isBasicType(match[2])) {
          if (type != null && FragmentBreakdownType.Basic != type) {
            fragments.push(this.getFragment(type, null, buffer.join('')));
            buffer = [];
          }

          type = FragmentBreakdownType.Basic;

          buffer.push(match[1] + match[2]);
        } else {
          if (type != null) {
            fragments.push(this.getFragment(type, null, buffer.join('')));
            buffer = [];
          }
          
          fragments.push(this.getFragment(FragmentBreakdownType.NotImplemented, null, match[1] + match[2]));
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
   */
  public getParagraphLanguage():  ParagraphLanguageType {
    return this.paragraphLanguage;
  }

  /**
   * Returns true if the word is of type language change.
   * 
   * @return True if the word is of type language change.
   */
  public isLanguageChangeType(): boolean {
    return this.fragments.length == 1 && (this.fragments[0] instanceof LanguageChange);
  }

  /**
   * Returns the language change.
   *
   * @return The language change.
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
   */
  public  isLanguageChangeSet() : boolean {
    return this.languageChange != null;
  }

  /**
   * Returns the language change.
   *
   * @return The language change.
   */
  public getLanguageChange(): LanguageChangeType | null {
    return this.languageChange;
  }

  /**
   * Set the language change.
   *
   * @param language The language to set.
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
      fragment = new UndefinedDegreeSign(this.deleriPosition, segment, text);
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
      text = TextEvaluation.unescape(text);
      
      this.getStatus().add(new StatusEvent(StatusLevel.critical, StatusEventCode.parser, 'the word part \'' + text + '\' cannot be parsed.'));

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
   */
  private static isNumberType(text: string): boolean {
    return text.match(Number.pattern) ? true : false;
  }

  /**
   * Returns true if the given text is of type delimiter.
   *
   * @param text The text.
   * @return True if the given text is of type delimiter.
   */
  private static isDelimiterType(text: string): boolean {
    return text.match(Delimiter.pattern) ? true : false;
  }

  /**
   * Returns true if the given text is of type basic.
   *
   * @param text The text.
   * @return True if the given text is of type basic.
   */
  private static isBasicType(text: string): boolean {
    return text.match(Basic.pattern) ? true : false;
  }

  /**
   * Returns true if the given text is of type Akkadogram.
   *
   * @param text The text.
   * @return True if the given text is of type Akkadogram.
   */
  private static isAkkadogramType(text: string): boolean {
    return text.match(Akkadogram.pattern) ? true : false;
  }

  /**
   * Returns true if the given text is of type Sumerogram.
   *
   * @param text The text.
   * @return True if the given text is of type Sumerogram.
   */
  private static isSumerogramType(text: string): boolean {
    return text.match(Sumerogram.pattern) ? true : false;
  }
  
  /**
   * Returns the normalized word.
   *
   * @param word The word to normalize.
   * @return The normalized word.
   */
  public static normalizeWord(word: Word): LineEntity {
      if (word.getFragments().length == 1 && word.getFragments()[0] instanceof Tag) {
        const tag = word.getFragments()[0] as Tag;
        
        return tag.isTypeS() ? word : tag;
      }
      
      for (const fragment of word.getFragments()) {
        if (fragment instanceof Tag) {
          const tag = fragment as Tag;
        
          if (tag.getType() != null)
            switch(tag.getType()) {
              case TagType.K:
              case TagType.Mbegin:
              case TagType.Mend:
               tag.getStatus()
                 .add(new StatusEvent(StatusLevel.serious, StatusEventCode.unexpected, 'marker \''
                   + tag.getText() + '\' is not allowed in a word.'));
            }
        }
      }
      
     for (const fragment of word.getFragments())
      word.getStatus().addLevel(fragment.getStatus());
      
     return word;
  }

  /**
   * Parses the word.
   *
   * @param paragraphLanguage The paragraph language. If null, use default
   *                          language.
   * @param text The text to parse.
   * @return The word.
   */
  public static parseWord(paragraphLanguage: ParagraphLanguageType | null, text: string): LineEntity {
    const normalized: string = LineSource.normalize(text);
    
    return Word.normalizeWord(new Word(paragraphLanguage, normalized));
  }

  /**
   * Returns the status.
   *
   * @return The status.
   */
  public getStatus(): Status {
    return this.status;
  }

  /**
   * Returns the text.
   *
   * @return The text.
   */
  public getText(): string {
    return this.text;
  }

  /**
   * Returns the normalized text.
   *
   * @return The normalized text.
   */
  public getNormalizedText(): string {
    return this.normalizedText;
  }

  /**
   * Returns the fragments.
   *
   * @return The fragments.
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
      case Ligature.xmlTag:
        children = children.concat(element.children);
        
        break;
      case Gap.xmlTag:
        children.push(xmlTextNode(Gap.gap));
        
        break;
      default:
        children.push(element);
        
        break;
      }
    }

    return xmlElementNode(Word.xmlTag, (this.languageChange == null) ? {} : {'lg': convertToAbbreviation(this.languageChange)}, children);
  }
}
