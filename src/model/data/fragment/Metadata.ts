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
  private position:  MetadataPosition;
  
  /**
   * Creates a metadata.
   *
   * @param text     The text.
   */
  public constructor(text: string | null) {
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
      this.position = MetadataPosition.unknown; 
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

  /**
   * Set the deleri position.
   *
   * @param position The position.
   * @return True if the type is deleri and consequently the position was set.
   */
  public setDeleriPosition(position: MetadataPosition):  boolean {
    if (this.type == MetadataType.deleri) {
      this.position = position;
      return true;
	} else
      return false;
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
      switch (this.position) {
      case MetadataPosition.initial:
        tag = 'ras_in';
      
        break;
      case MetadataPosition.end:
        tag = 'ras_fin';
      
        break;
      default:
        tag = 'ras_unknown';
      
        break;
      }
       
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
