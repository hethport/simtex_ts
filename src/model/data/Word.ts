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
import { Content } from './fragment/Content';
import { Collection } from './fragment/Collection';

/**
 * Defines words.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 */
export class Word implements LineEntity {
	
  static readonly xmlTag: string = 'w';
  
  /**
   * The pattern for fragments between degree signs.
   */
  private static readonly surplusPattern:  RegExp = new RegExp('〈〈([^〈]*)〉〉', 'g');
  
  /**
   * The pattern to split by dots.
   */
  static readonly patternSplitDot: RegExp = new RegExp('\\.', 'g');
  
  /**
   * The pattern to split by dots, hyphens and equals.
   */
  static readonly patternSplitDotHyphenDot: RegExp = new RegExp('[\\.\\-=]{1}', 'g');
  
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

    // God determinative
    let godFragments: Fragment[] = [];
    for (let index = 0; index < fragments.length; index++) {
      const fragment = fragments[index];
      
      godFragments.push(fragment);
      
      if (index < fragments.length - 1 && fragment instanceof Determinative && fragment.isGodName()) {
        const godNumber = fragments[index + 1];
        
        if (godNumber instanceof Number && Determinative.isGodNumber(godNumber.getInteger())) {
          index++;
          
          // text is never null, since it is a god number
          const text = godNumber.getText();
          //this.deleriPosition = fragment.getDeleriPosition();
          //console.log('\t\tWord deleri ' + (MetadataPosition.initial == this.deleriPosition ? 'initial' : 'end'));
          godFragments = godFragments.concat(this.getTypeFragments(FragmentBreakdownType.Sumerogram, null, text == null ? '' : text, false ));
        }
      }
    }
    
    // Text evaluation
    let textEvaluationFragments: Fragment[] = [];
    for (let index = 0; index < godFragments.length; index++) {
      const fragment = godFragments[index];

      textEvaluationFragments.push(fragment);

      if (fragment instanceof Breakdown) {
        const breakdown = fragment as Breakdown;
        
       if (breakdown instanceof Glossing) {
          const textEvaluations = breakdown.extractTextEvaluations();
          
          if (textEvaluations.length > 0) {
            if (index + 1 < godFragments.length && godFragments[index + 1] instanceof Breakdown) {
              const moveTextEvaluations = godFragments[index + 1] as Breakdown;
              
              moveTextEvaluations.insertTextEvaluations(textEvaluations);
			} else {
              const  buffer: string[] = [];
              for (const textEvaluation of textEvaluations)
                buffer.push(textEvaluation.getText());
              
              textEvaluationFragments = textEvaluationFragments.concat(this.getTypeFragments(FragmentBreakdownType.Basic, null, buffer.join(''), true));
			}
          }
        } else {
          fragment.normalizeTextEvaluations();
          
          if (breakdown instanceof Determinative) {
			if (index + 1 < godFragments.length && godFragments[index + 1] instanceof Breakdown) {
              const moveTextEvaluations = godFragments[index + 1] as Breakdown;
              
              const textEvaluation = moveTextEvaluations.removeBeginTextEvaluation();
				
              if (textEvaluation != null) {
                fragment.addTextEvaluation(textEvaluation);
              }
			}
          }
        }
      }
    }
    
    // Collections
    let collection: Collection | null = null;
    for (let index = 0; index < textEvaluationFragments.length; index++) {
      const fragment = textEvaluationFragments[index];
      
      if (collection == null) {
        this.fragments.push(fragment);
        
        if (fragment instanceof Collection)
          collection = fragment;
      } else {
        if (fragment instanceof Glossing)
          collection.addElement(fragment);
        else if (fragment instanceof Collection) {
          if (collection.isSameType(fragment))
            collection.addElement(fragment);
          else {
            this.fragments.push(fragment);
            collection = fragment;
          }
        } else {
          this.fragments.push(fragment);
          collection = null;
        }
      }
    }
    
    let deleriPosition = MetadataPosition.initial;
    for (const fragment of this.fragments)
      if (fragment instanceof Breakdown)
        deleriPosition = (fragment as Breakdown).updateDeleriPositions(deleriPosition);
     
    if (MetadataPosition.initial != deleriPosition)
      this.status.add(new StatusEvent(StatusLevel.info, StatusEventCode.required,
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
        return TextEvaluation.escape(Content.escape(text

          .replace(/</g, '〈').replace(/>/g, '〉').replace(/〈-/g, '-〈').replace(/-〉/g, '〉-')

          .replace(/\.\.\./g, '…')
          
          .replace(/\+_/g, '+')
          
          .replace(/°m°°\.°°D°/g, '°m.D°').replace(/°f°°\.°°D°/g, '°f.D°')));
    }
  }

  /**
   * Returns the unescaped text.
   *
   * @param text The text to unescape.
   * @return The unescaped text.
   */
  private static unescape(text: string): string {
    return TextEvaluation.unescape(Content.unescape(text));
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
        fragments = fragments.concat(this.getTypeFragments(FragmentBreakdownType.Basic, null, text, true));
      else {
          /*
           * extract the tags, and recursively the remainder fragments
           */
          const matches = text.matchAll(Marker.tagPattern);
          let index = 0;
          for (const match of matches) {
            if (match.index && index < match.index) {
              fragments = fragments.concat(this.parseDeterminativeGlossing(text.substring(index, match.index)));
            }
            
            // tag S can not be empty and can not contain spaces
            const tag = new Tag(false, match[0], match[1], match[2]);
            
            if (tag.isTypeS()) {
              const content = tag.getContent();
              
              if (content != null) {
                 const split: string[] = content.split(' ');
                 
                if (split.length < 2)
                  fragments.push(tag);
                else {
                  for (let part of split) {
                    part = part.trim();
                    
                    if (part.length > 0)
                      fragments.push(new Tag(false, match[0], match[1], part));
                  }
                }
              }
            } else
              fragments.push(tag);
              
            if (match.index != null) {
              index = match.index + match[0].length;
            }
          }

          if (index < text.length) {
           fragments = fragments.concat(this.parseDeterminativeGlossing(text.substring(index)));
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
    //  escape required text characters that do not belong to a tag
    text = text.replace(/h/g, 'ḫ').replace(/H/g, 'Ḫ')

          // Unicodes 12471
          .replace(/:/g, '𒑱')
          
          // Unicodes 12039
          .replace(/;/g, '𒀹');
 
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
      const determinativeGlossingFragments = this.getDeterminativeGlossing(match[0], match[1], prefixSuffix);
      
      prefixText = suffixGlossing.concat(prefixText, prefixSuffix.getPrefix().join(''));     
      if (prefixText != '')
        fragments = fragments.concat(this.parseLigature(prefixText));
      
      fragments = fragments.concat(determinativeGlossingFragments);
      
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
   * Returns the determinative/glossing fragments depending on the content. On
   * troubles returns an
   *
   * @param segment The segment.
   * @param content The content.
   * @return The fragment.
   */
  private getDeterminativeGlossing(segment: string, content: string, prefixSuffix: PrefixSuffix): Fragment[] {
    let fragments: Fragment[];

    if (content.trim().length == 0 || content.includes(' ')) {
      fragments = this.getTypeFragments(FragmentBreakdownType.UndefinedDegreeSign, segment, content, true);

      if (fragments.length > 0)
        fragments[0].getStatus()
          .add(new StatusEvent(StatusLevel.error, StatusEventCode.undefined, 'degree sign segment \''
            + Word.unescape(segment) + '\' contains ' + (content.length == 0 ? 'an empty string' : 'space') + '.'));
    } else if (content.match(Determinative.pattern))
      fragments = this.getTypeFragments(FragmentBreakdownType.Determinative, segment, content, true);
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

      fragments = this.getTypeFragments(FragmentBreakdownType.Glossing, segment, content, true);
    } else {
      fragments = this.getTypeFragments(FragmentBreakdownType.UndefinedDegreeSign, segment, content, true);

      if (fragments.length > 0)
        fragments[0].getStatus().add(new StatusEvent(StatusLevel.error, StatusEventCode.malformed,
          'degree sign segment \'' + Word.unescape(segment) + '\' is malformed.'));
    }

    return fragments;
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
   * Returns the text with escaped special characters for surplus.
   *
   * @param text The text to escape.
   * @return The text with escaped special characters for surplus.
   */
  private escapeSurplus(text: string): string {
    const matches = text.matchAll(Word.surplusPattern);
    
    let index = 0;
    const buffer: string[] = [];
      for (const match of matches) {
        if (match.index && index < match.index) {
          buffer.push(text.substring(index, match.index));
        }
        
        buffer.push(match[0].replace(/-/g, WordConstants.surplusEscapeHyphen));
        
        if (match.index != null) {  index = match.index + match[0].length;  }
      }

      if(index < text.length) {
        buffer.push(text.substring(index));
      }
    
    return buffer.join('');
  }
  
  /**
   * Returns the text with escaped begin n= pattern.
   *
   * @param text The text to escape.
   * @return The text with escaped begin n= pattern.
   */
  private escapeBeginNEqual(text: string): string {
    if (text.startsWith('n='))
      return WordConstants.beginEscapeNEqual + (text.length < 3 ? '' : text.substring(2));
    else
      return text;
  }
  
  /**
   * Parses the text.
   *
   * @param text The text to parse.
   * @return The fragments.
   */
  private parseText(text: string): Fragment[] {
    let fragments: Fragment[] = [];
    
    // test for fraction numbers
    const match = text.match(FractionNumber.pattern);
    if (match) {
      const split: string[] = text.split('/');
      
      fragments.push(new FractionNumber(text, split[0], split[1]));
    } else {			
      text = this.escapeBeginNEqual(this.escapeSurplus(text));
    
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
            fragments = fragments.concat(this.getTypeFragments(FragmentBreakdownType.NotImplemented, null, part, true));
        } else if (Word.isDelimiterType(part))
          fragments = fragments.concat(this.getTypeFragments(FragmentBreakdownType.Delimiter, null, part, true));
        else if (Word.isNumberType(part))
          fragments = fragments.concat(this.getTypeFragments(FragmentBreakdownType.Number, null, part, true));
        else if (Word.isSumerogramType(part)) {
          type = FragmentBreakdownType.Sumerogram;

          buffer.push(part);
        } else if (Word.isBasicType(part)) {
          type = FragmentBreakdownType.Basic;

          buffer.push(part);
        } else 
          fragments = fragments.concat(this.getTypeFragments(FragmentBreakdownType.NotImplemented, null, part, true));
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
                fragments = fragments.concat(this.getTypeFragments(type, null, buffer.join(''), true));
                buffer = [];
              }

              type = FragmentBreakdownType.Sumerogram;

              buffer.push((WordConstants.hyphenEscapeCharacter == match[1] ? '-' : '=') + match[2]);
            } else {
              fragments = fragments.concat(this.getTypeFragments(FragmentBreakdownType.NotImplemented, null, (WordConstants.hyphenEscapeCharacter == match[1] ? '--' : '==') + match[2], true));
            }
          } else if (Word.isDelimiterType(match[2])) {
            if (type != null) {
              fragments = fragments.concat(this.getTypeFragments(type, null, buffer.join(''), true));
              type = null;
              buffer = [];
            }

            fragments = fragments.concat(this.getTypeFragments(FragmentBreakdownType.Delimiter, null, match[1] + match[2], true));
          } else if (Word.isNumberType(match[2])) {
            if (type != null) {
              fragments = fragments.concat(this.getTypeFragments(type, null, buffer.join(''), true));

              type = null;
              buffer = [];
            }

            fragments = fragments.concat(this.getTypeFragments(FragmentBreakdownType.Number, null, match[1] + match[2], true));
          } else if (Word.isAkkadogramType(match[2])) {
            if (type != null && FragmentBreakdownType.Akkadogram != type) {
              fragments = fragments.concat(this.getTypeFragments(type, null, buffer.join(''), true));
              buffer = [];
            }

            type = FragmentBreakdownType.Akkadogram;

            buffer.push(match[1] + match[2]);
          } else if (Word.isBasicType(match[2])) {
            if (type != null && FragmentBreakdownType.Basic != type) {
              fragments = fragments.concat(this.getTypeFragments(type, null, buffer.join(''), true));
              buffer = [];
            }

            type = FragmentBreakdownType.Basic;

            buffer.push(match[1] + match[2]);
          } else {
            if (type != null) {
              fragments = fragments.concat(this.getTypeFragments(type, null, buffer.join(''), true));
              buffer = [];
            }
          
            fragments = fragments.concat(this.getTypeFragments(FragmentBreakdownType.NotImplemented, null, match[1] + match[2], true));
          }
        }
      }
   
      if (type !== null)
        fragments = fragments.concat(this.getTypeFragments(type, null, buffer.join(''), true));
    }

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
   * Returns the fragments for given text type without segment.
   *
   * @param type   The text type.
   * @param segment The Segment.
   * @param text The text.
   * @param isExtractNumbers True if extract numbers. Only used by Akkadograms and Sumerograms.
   * @return The fragments.
   */
  private getTypeFragments(type: FragmentBreakdownType, segment: string | null, text: string, isExtractNumbers: boolean): Fragment[] {
    let fragments: Breakdown[] = [];

    switch (type) {
    case FragmentBreakdownType.Determinative:
      fragments.push(new Determinative(segment, text));
      break;

    case FragmentBreakdownType.Glossing:
      fragments.push(new Glossing(segment, text));
      break;

    case FragmentBreakdownType.UndefinedDegreeSign:
      fragments.push( new UndefinedDegreeSign(segment, text));
      break;

    case FragmentBreakdownType.Delimiter:
      fragments.push(new Delimiter(text));
      break;

    case FragmentBreakdownType.Number:
      fragments.push(new Number(text));
      break;

    case FragmentBreakdownType.Basic:
      fragments.push(new Basic(text));
      break;

    case FragmentBreakdownType.Akkadogram:
      if (isExtractNumbers)
        fragments = fragments.concat(this.getAkkadogramSumerogramFragmentsWinthNumber(FragmentBreakdownType.Akkadogram, text));
      else
        fragments = fragments.concat(new Akkadogram(text));
      break;

    case FragmentBreakdownType.Sumerogram:
      if (isExtractNumbers)
        fragments = fragments.concat(this.getAkkadogramSumerogramFragmentsWinthNumber(FragmentBreakdownType.Sumerogram, text));
      else
        fragments = fragments.concat(new Sumerogram(text));
      break;

    case FragmentBreakdownType.NotImplemented:
    default:
      text = Word.unescape(text);
      
      this.getStatus().add(new StatusEvent(StatusLevel.critical, StatusEventCode.parser, 'the word part \'' + text + '\' cannot be parsed.'));
      
      return [new NotImplemented(text)];
    }

    return fragments;
  }


  /**
   * Returns the Akkadogram and Sumerogram fragments with numbers.
   *
   * @param type   The text type. It is either Akkadogram or Sumerogram.
   * @param text The text.
   * @return The fragments.
   */
  private getAkkadogramSumerogramFragmentsWinthNumber(type: FragmentBreakdownType, text: string): Breakdown[] {
  
    const fragments: Breakdown[] = [];
    
    let buffer: string [] = [];
    
    const matches = text.matchAll(Word.patternSplitDotHyphenDot);
    let index = 0;
    for (const match of matches) {
      if (match.index && index < match.index) {
        const part = text.substring(index, match.index);
        
        if (Word.isNumberType(part)) {
          if (buffer.length > 0) {
            switch (type) {
            case FragmentBreakdownType.Akkadogram:
              fragments.push(new Akkadogram(buffer.join('')));
               break;

            case FragmentBreakdownType.Sumerogram:
              fragments.push(new Sumerogram(buffer.join('')));
              break;
            }
            
            buffer = [];
          }
          
          fragments.push(new Number(part));
		} else
          buffer.push(part);
      }
      
      buffer.push(match[0]);
       
      if (match.index != null) {
        index = match.index + match[0].length;
      }
    }

    if (index < text.length) {
        const part = text.substring(index);
        
        if (Word.isNumberType(part)) {
          if (buffer.length > 0) {
            switch (type) {
            case FragmentBreakdownType.Akkadogram:
              fragments.push(new Akkadogram(buffer.join('')));
               break;

            case FragmentBreakdownType.Sumerogram:
              fragments.push(new Sumerogram(buffer.join('')));
              break;
            }
            
            buffer = [];
          }
          
          fragments.push(new Number(part));
		} else
          buffer.push(part);
    }
    
    if (buffer.length > 0) {
        switch (type) {
        case FragmentBreakdownType.Akkadogram:
          fragments.push(new Akkadogram(buffer.join('')));
          break;

        case FragmentBreakdownType.Sumerogram:
          fragments.push(new Sumerogram(buffer.join('')));
          break;
         }
    }
    
    return fragments;
  }
  
  /**
   * Etracts from the text the number parts between dots and returns it.
   *
   * @param text The text.
   * @return The text without number parts between dots.
   */
  private static extractNumberBetweenDots(text: string): string {
    const buffer: string [] = [];
    
    const matches = text.matchAll(Word.patternSplitDot);
    let index = 0;
    for (const match of matches) {
      if (match.index && index < match.index) {
        const part = text.substring(index, match.index);
        
        if (!Word.isNumberType(part))
          buffer.push(part);
      }
      
      buffer.push('.');
      
      if (match.index != null) {
        index = match.index + match[0].length;
      }
    }

    if (index < text.length) {
        const part = text.substring(index);
        
        if (!Word.isNumberType(part))
          buffer.push(part);
    }

    return buffer.join('');
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
    return Word.extractNumberBetweenDots(text).match(Akkadogram.pattern) ? true : false;
  }

  /**
   * Returns true if the given text is of type Sumerogram.
   *
   * @param text The text.
   * @return True if the given text is of type Sumerogram.
   */
  private static isSumerogramType(text: string): boolean {
    return Word.extractNumberBetweenDots(text).match(Sumerogram.pattern) ? true : false;
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
                 .add(new StatusEvent(StatusLevel.error, StatusEventCode.unexpected, 'marker \''
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
