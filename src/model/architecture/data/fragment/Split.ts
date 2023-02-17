/**
 * File:     Split.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core.data.fragment
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
import { Word } from '../Word';
import {Tag} from '../../metadata/Tag';




/**
 * Defines splits.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 * @since 11
 */
export  class Split {
  /**
	 * The pattern.
	 */
  public static pattern = new RegExp('([\\-]*[^\\-]*)');

  /**
	 * The pattern for index.
	 */
  private static indexPattern = new RegExp('([' + Word.alphabet + ']+)(\\d+|x)($|\\.)');

  /**
	 * The pattern for delimiter.
	 */
  private static delimiterPattern = new RegExp('([' + Word.delimiterAlphabet + ']{1})');

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
	 * @since 11
	 */
  public constructor(status: Status, deleriPosition: MetadataPosition, text: string) {
    
    this.deleriPosition = deleriPosition;

    const  split: string[] = text.split('\\' + Word.subscript, 2);

    this.mainPart = this.normalize(split[0]);

    if (split.length === 1)
      this.subscript = [];
    else {
      if (split[1].includes(Word.subscript))
        status.add(new  StatusEvent(StatusLevel.minor, StatusEventCode.malformed,
          'multiple suffix characters \'' + Word.subscript + '\' available in split \'' + text + '\'.'));

      this.subscript = this.normalize(split[1]);
    }
  }

  /**
	 * Normalizes the text.
	 * 
	 * @param text The text to normalize.
	 * @return The normalized text.
	 * @since 11
	 */
  private normalize(/* final */  text: string): Slice[] {
    const  slice: Slice[] = [];

    if (text.length > 0) {
      /*
	  * convert index digits and unknown reading (the delimiters are removed)
	  */

      let plainText = text.replace('[' + Word.delimiterAlphabet + ']+', '');
      let  matches = plainText.matchAll(Split.indexPattern);
      let index = 0;
      const buffer: string[] = [];
      for (const match of matches) {
        buffer.push(match[1] + Split.convertToIndex(match[2]) + match[3]);
        if (match.index != null) {  index = match.index + match[0].length;  }
      }

      if(index < text.length) {
        buffer.push(text.substring(index, text.length - 1));
      }

      /*
	  * create the slices take into account the delimiters
	  */
      plainText = buffer.join('');


      matches = text.matchAll(Split.delimiterPattern);
      let indexBegin = 0;
      index = 0;
      for (const match of matches) {
        if (match.index && indexBegin < match.index) {
          const indexEnd =  indexBegin + (match.index - indexBegin);

          slice.push(new Content(plainText.substring(indexBegin, indexEnd)));

          indexBegin = indexEnd;
        }

        const  delimiter: string = match[1];
        if (Word.deleri == delimiter) {
          slice.push(new Metadata(null, this.deleriPosition));

          this.deleriPosition = MetadataPosition.initial == this.deleriPosition ? MetadataPosition.end
            : MetadataPosition.initial;
        } else
          slice.push(new  Metadata(delimiter, null));

        if (match.index != null) {  index = match.index + match[0].length;  }
      }

      if(index < text.length) {
        slice.push(plainText.substring(indexBegin, indexBegin + (text.length - index)));
      }
    }

    return slice;
  }

  /**
	 * Converts to index.
	 * 
	 * @param text The text to convert to index.
	 * @return The index digits.
	 * @since 11
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
	 * @since 11
	 */
  public getDeleriPosition(): MetadataPosition {
    return this.deleriPosition;
  }

  /**
	 * Returns the main part.
	 *
	 * @return The main part.
	 * @since 11
	 */
  public getMainPart():  Slice[] {
    return this.mainPart;
  }

  /**
	 * Returns the main part plain text.
	 *
	 * @return The main part plain text.
	 * @since 11
	 */
  public getMainPartPlainText():  string {
    return Split.getPlainText(this.mainPart);
  }

  /**
	 * Returns the subscript.
	 *
	 * @return The subscript.
	 * @since 11
	 */
  public getSubscript(): Slice[] {
    return this.subscript;
  }

  /**
	 * Returns the subscript plain text.
	 *
	 * @return The subscript plain text.
	 * @since 11
	 */
  public getSubscriptPlainText(): string | null {
    return Split.getPlainText(this.subscript);
  }

  /**
	 * Returns the plain text of given slices.
	 * 
	 * @param slices The slices.
	 * @return The plain text.
	 * @since 11
	 */
  private static getPlainText(slices: Slice[]): string {
    const  buffer: string[] = [];

    for (const slice of slices)
      if (slice instanceof Content)
        buffer.push(( slice as Content).getText());

    return buffer.join('');
  }

}
