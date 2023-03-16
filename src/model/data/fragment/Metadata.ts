/**
 * File:     Metadata.ts
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     16.02.2023
 */

import {MetadataPosition} from './MetadataPosition';
import {Slice} from './Slice';
import {MetadataType} from './MetadataType';
import {XmlElementNode, xmlElementNode} from 'simple_xml';
import {WordConstants} from '../WordConstants';

/**
 * Metadata is an immutable class that defines metadata.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 */
export  class Metadata implements Slice {
  public static readonly xmlTag: string = 'METADATA';

  /**
   * The symbol.
   */
  private readonly symbol:  string | null;

  /**
   * The type.
   */
  private readonly type:  MetadataType;

  /**
   * The position.
   */
  private readonly position:  MetadataPosition;
  
  /**
   * Creates a metadata.
   *
   * @param text     The text.
   * @param position The position.
   */
  public constructor(text: string | null, position: MetadataPosition | null) {
    this.symbol = text;

    if (text != null && text.trim().length > 0) {
      text = text.trim();
      if ('[' == text || ']' == text)
        this.type = MetadataType.deletum;
      else if ('⸢' == text || '⸣' == text)
        this.type = MetadataType.laedi;
      else if ('〈' == text || '〉' == text)
        this.type = MetadataType.add;
      else if (WordConstants.deleri == text)
        this.type = MetadataType.deleri;
      else
        this.type = MetadataType.undefined;
    } else {
      this.type = MetadataType.undefined;
    }
    
    if ('[' == this.symbol || '⸢' == this.symbol || '〈' == this.symbol)
      this.position = MetadataPosition.initial;
    else if (']' == this.symbol || '⸣' == this.symbol || '〉' == this.symbol)
      this.position = MetadataPosition.end;
    else
      this.position = position == null ? MetadataPosition.unknown : position; 
  }


  /**
   * Returns the symbol.
   *
   * @return The symbol.
   */
  public getSymbol():  string {
    return this.symbol == null ? '' : this.symbol;
  }

  /**
   * Returns the type.
   *
   * @return The type.
   */
  public getType():  MetadataType | null {
    return this.type;
  }

  /**
   * Returns the position.
   *
   * @return The position.
   */
  public getPosition():  MetadataPosition | null {
    return this.position;
  }

  public exportXml(): XmlElementNode {
    let tag = '';
    switch (this.type) {
    case MetadataType.deletum:
      tag = this.position == MetadataPosition.initial ? 'del_in' : 'del_fin';
      
      break;
    case MetadataType.laedi:
      tag = this.position == MetadataPosition.initial ? 'laes_in' : 'laes_fin';
      
      break;
    case MetadataType.deleri:
      tag = this.position == MetadataPosition.initial ? 'ras_in' : 'ras_fin';
      
      break;
    case MetadataType.add:
      tag = this.position == MetadataPosition.initial ? 'add_in' : 'add_fin';
      
      break;
    default:
      // Tag undefined/MetadataType unknown is checked in Split.ts
      tag = Metadata.xmlTag;
      break;
    }

    return xmlElementNode(tag, {}, []);
  }
}
