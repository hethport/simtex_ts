/**
 * File:     Split.ts
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     16.02.2023
 */

import { Content } from './Content';
import { Metadata } from './Metadata';
import { MetadataPosition } from './MetadataPosition';
import { Slice } from './Slice';
import { Status } from '../../Status';
import { StatusEvent } from '../../StatusEvent';
import { StatusEventCode } from '../../StatusEventCode';
import { StatusLevel } from '../../StatusLevel';
import { matchesFullStringRegularExpression, WordConstants } from '../WordConstants';
import {xmlElementNode, xmlTextNode, XmlNode} from 'simple_xml';
import { TextEvaluation } from './TextEvaluation';
import { Surplus } from './Surplus';

/**
 * Defines splits.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 */
export  class Split {
  /**
   * The pattern.
   */
  public static pattern = new RegExp('([\\-=]*[^\\-=]*)', 'g');

  /**
   * The pattern for index.
   */
  private static indexPattern = new RegExp('([' + WordConstants.alphabet + ']+)(\\d+|x)($|\\.)', 'g');

  /**
   * The pattern for index ends of a text.
   */
  private static indexPatternEndText = new RegExp(matchesFullStringRegularExpression('(.*\\D)(\\d+|x)'), 'g');

  /**
   * The pattern for delimiter.
   */
  private static delimiterPattern = new RegExp('([' + WordConstants.delimiterAlphabet + ']{1})', 'g');

  /**
   * The deleri ('*' / erased / Rasur) position.
   */
  private deleriPosition: MetadataPosition;

  /**
   * The main part.
   */
  private readonly mainPart: Slice[];

  /**
   * The subscript.
   */
  private readonly subscript: Slice[] = [];

  /**
   * Creates a split.
   *
   * @param status         The status.
   * @param deleriPosition The deleri ('*' / erased / Rasur) position.
   * @param text           The text.
   */
  public constructor(status: Status, deleriPosition: MetadataPosition, text: string) {
    this.deleriPosition = deleriPosition;

    const  split: string[] = text.split(WordConstants.subscript, 2);
    
    this.mainPart = this.normalize(split[0]);
    
    if (split.length === 1)
      this.subscript = [];
    else {
      if (split[1].includes(WordConstants.subscript))
        status.add(new  StatusEvent(StatusLevel.minor, StatusEventCode.malformed,
          'multiple suffix characters \'' + WordConstants.subscript + '\' available in split \'' + text + '\'.'));

      this.subscript = this.normalize(split[1]);
      let isMetadataWarn = false;
      let isTextEvaluationWarn = false;
      let isSurplusWarn = false;
      for (const slice of this.subscript) {
        if (!isMetadataWarn && slice instanceof Metadata) {
          status.add(new  StatusEvent(StatusLevel.minor, StatusEventCode.malformed,
            'Marks \'' + split[1] + '\' are not allowed in subscript.'));
          
          isMetadataWarn = true;
        } else if (!isTextEvaluationWarn && slice instanceof TextEvaluation) {
          status.add(new  StatusEvent(StatusLevel.minor, StatusEventCode.malformed,
            'Text evaluation \'' + split[1] + '\' are not allowed in subscript.'));
          
          isTextEvaluationWarn = true;
        } else if (!isSurplusWarn && slice instanceof Surplus) {
          status.add(new  StatusEvent(StatusLevel.minor, StatusEventCode.malformed,
            'Surplus \'' + split[1] + '\' are not allowed in subscript.'));
          
          isSurplusWarn = true;
        }
      }
    }
  }

  /**
   * Normalizes the text.
   *
   * @param text The text to normalize.
   * @return The normalized text.
   */
  private normalize(/* final */  text: string): Slice[] {
    let  slice: Slice[] = [];

    if (text.length > 0) {
      /*
	  * convert index digits and unknown reading (the delimiters are removed)
	  */

      let plainText = text.replace(new RegExp('[' + WordConstants.delimiterAlphabet + ']', 'g'), '');
      
      let matches = plainText.matchAll(Split.indexPattern);
      let index = 0;
      const buffer: string[] = [];
      for (const match of matches) {
        if (match.index && index < match.index) {
          buffer.push(plainText.substring(index, match.index));
        }
        
        buffer.push(match[1] + Split.convertToIndex(match[2]) + match[3]);
        
        if (match.index != null) {  index = match.index + match[0].length;  }
      }

      if(index < plainText.length) {
        buffer.push(plainText.substring(index));
      }

      /*
	   * create the slices take into account the delimiters
	   */
      plainText = buffer.join('');

      let lastContentIndex = -1;
      let lastContent : Content | null = null;
      
      matches = text.matchAll(Split.delimiterPattern);
      
      let indexBegin = 0;
      index = 0;
      for (const match of matches) {
        if (match.index && index < match.index) {
          const indexEnd =  indexBegin + (match.index - index);
          
          lastContent = new Content(plainText.substring(indexBegin, indexEnd));
          lastContentIndex = slice.length;
          
          slice.push(lastContent);

          indexBegin = indexEnd;
        }

        const  delimiter: string = match[1];
        if (WordConstants.deleri == delimiter) {
          slice.push(new Metadata(delimiter, this.deleriPosition));

          this.deleriPosition = MetadataPosition.initial == this.deleriPosition ? MetadataPosition.end
            : MetadataPosition.initial;
        } else
          slice.push(new  Metadata(delimiter, null));

        if (match.index != null) {  index = match.index + match[0].length; }
      }

      if(indexBegin < plainText.length) {
        lastContent = new Content(plainText.substring(indexBegin));
        lastContentIndex = slice.length;
        
        slice.push(lastContent);
      }
      
      /*
       * Search for text evaluation
       */
      if (lastContent != null && lastContent.getText().match(TextEvaluation.pattern)) {
        const  tmpSlice: Slice[] = slice;
        slice = [];
        
        index = 0;
        for (const part of tmpSlice) {
          if (index == lastContentIndex) {
            matches = lastContent.getText().matchAll(TextEvaluation.pattern);
            for (const match of matches) {
              if (match.index && match.index > 0) {
                slice.push(new Content(Split.convertToIndexEndText(lastContent.getText().substring(0, match.index))));
              }
              
              slice.push(new TextEvaluation(match[1]));
            }
          } else
            slice.push(part);
          index++;
        }
      }
       
      /*
       * Search for surplus: 〈〈text〉〉
       */
      const surplus: number[][] = [];
       
      for (index = 0; index < slice.length - 4; index++) {
        let part = slice[index];
  
        if (part instanceof Metadata) {
          if (part.getSymbol() == '〈') {
            part = slice[index + 1];
            
            if (part instanceof Metadata) {
              if (part.getSymbol() == '〈') {
                part = slice[index + 2];
                
                const content: number = (part instanceof Content) ? 1 : 0;
                
                if (index < slice.length - (3 + content)) {
                  part = slice[index + 2 + content];
                
                  if (part instanceof Metadata) {
                    if (part.getSymbol() == '〉') {
                      part = slice[index + 3 + content];
                      
                      if (part instanceof Metadata) {
                        if (part.getSymbol() == '〉') {
                          surplus.push([index, index + 3 + content]);
                          index += 3 + content;
                        }
                      }
                    }
                  }
                }
              }
            } 
          }
        } 
      }
      
      if (surplus.length > 0) {
        const  tmpSlice: Slice[] = slice;
        slice = [];
        
        index = 0;
        for (const tuple of surplus) {
          for (; index < tuple[0]; index++)
            slice.push(tmpSlice[index]);
          
          const part = tmpSlice[tuple[0] + 2];
          
          slice.push(new Surplus(part instanceof Content ? part.getText() : ''));
            
          index = tuple[1] + 1;
        }
        
        for (; index < tmpSlice.length; index++)
          slice.push(tmpSlice[index]);
      }      
    }

    return slice;
  }
  
  /**
   * Converts the end of the text to indexes if required.
   *
   * @param text The text to convert to index.
   * @return The text with index digits.
   */
  private static convertToIndexEndText(text: string): string {
    const matches = text.matchAll(Split.indexPatternEndText);
    let index = 0;
    const buffer: string[] = [];
    for (const match of matches) {
      if (match.index && index < match.index) {
        buffer.push(text.substring(index, match.index));
      }
        
      buffer.push(match[1] + Split.convertToIndex(match[2]));
        
      if (match.index != null) {  index = match.index + match[0].length;  }
    }

    if(index < text.length) {
      buffer.push(text.substring(index));
    }
	
    return buffer.join('');
  } 

  /**
   * Converts to index.
   *
   * @param text The text to convert to index.
   * @return The index digits.
   */
  private static convertToIndex(text: string): string {
    const  buffer: string[] = [];

    for (let  i = 0; i < text.length; i++) {
      switch (text.charAt(i)) {
      case '0':
        buffer.push('₀');
        break;

      case '1':
        buffer.push('₁');
        break;

      case '2':
        buffer.push('₂');
        break;

      case '3':
        buffer.push('₃');
        break;

      case '4':
        buffer.push('₄');
        break;

      case '5':
        buffer.push('₅');
        break;

      case '6':
        buffer.push('₆');
        break;

      case '7':
        buffer.push('₇');
        break;

      case '8':
        buffer.push('₈');
        break;

      case '9':
        buffer.push('₉');
        break;

      case 'x':
        buffer.push('ₓ');
        break;

      default:

      }
    }

    return buffer.join('');
  }

  /**
   * Returns the deleri ('*' / erased / Rasur) position.
   *
   * @return The deleri ('*' / erased / Rasur) position.
   */
  public getDeleriPosition(): MetadataPosition {
    return this.deleriPosition;
  }

  /**
   * Returns the main part.
   *
   * @return The main part.
   */
  public getMainPart():  Slice[] {
    return this.mainPart;
  }

  /**
   * Returns the main part plain text.
   *
   * @return The main part plain text.
   */
  public getMainPartPlainText():  string {
    return Split.getPlainText(this.mainPart);
  }

  /**
   * Returns the subscript.
   *
   * @return The subscript.
   */
  public getSubscript(): Slice[] {
    return this.subscript;
  }

  /**
   * Returns the subscript plain text.
   *
   * @return The subscript plain text.
   */
  public getSubscriptPlainText(): string | null {
    return Split.getPlainText(this.subscript);
  }

  /**
   * Returns the plain text of given slices.
   *
   * @param slices The slices.
   * @return The plain text.
   */
  private static getPlainText(slices: Slice[]): string {
    const  buffer: string[] = [];

    for (const slice of slices)
      if (slice instanceof Content)
        buffer.push(( slice as Content).getText());

    return buffer.join('');
  }

  public exportNodes(): XmlNode[] {
    const nodes: XmlNode[] = [];

    for (const slice of this.mainPart)
      if (slice instanceof Content) {
        nodes.push(xmlTextNode((slice as Content).getText()));
      } else if (slice instanceof Metadata) {
        nodes.push((slice as Metadata).exportXml());
      } else if (slice instanceof TextEvaluation) {
        nodes.push((slice as TextEvaluation).exportXml());
      } else if (slice instanceof Surplus) {
        nodes.push((slice as Surplus).exportXml());
      }

    const  buffer: string[] = [];
    for (const slice of this.subscript) {
      if (slice instanceof Content) {
        buffer.push((slice as Content).getText());
      } else if (slice instanceof Metadata) {
        nodes.push((slice as Metadata).exportXml());
      } else if (slice instanceof TextEvaluation) {
        nodes.push((slice as TextEvaluation).exportXml());
      } else if (slice instanceof Surplus) {
        nodes.push((slice as Surplus).exportXml());
      }
    }
    
    if (buffer.length > 0) {
      nodes.push(xmlElementNode('subscr', {'c': buffer.join('')}, []));
    }
    return nodes;
  }
}
