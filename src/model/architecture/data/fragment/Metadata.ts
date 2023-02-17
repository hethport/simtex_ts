/**
 * File:     Metadata.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core.data.fragment
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     16.02.2023
 */


import {MetadataPosition} from './MetadataPosition';
import {Slice} from './Slice';
import {MetadataType} from './MetadataType';
import {Word} from '../Word';


/**
 * Metadata is an immutable class that defines metadata.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 * @since 11
 */
export  class Metadata implements Slice {

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
	 * @since 11
	 */
  public constructor(text: string | null, position: MetadataPosition | null) {
    this.symbol = text;

    if (text != null && text.trim().length > 0) {
      text = text.trim();
      if ('[' == text || ']' == text)
        this.type = MetadataType.deletum;
      else if ('⸢' == text || '⸣' == text)
        this.type = MetadataType.laedi;
      else if (Word.deleri == text)
        this.type = MetadataType.deleri;
      else
        this.type = MetadataType.undefined;
    } else {
      this.type = MetadataType.undefined;
    }

    if ('[' == this.symbol || '⸢' == this.symbol)
      this.position = MetadataPosition.initial;
    else if (']' == this.symbol || '⸣' == this.symbol)
      this.position = MetadataPosition.end;
    else
      this.position = position == null ? MetadataPosition.unknown : position;
  }


  /**
	 * Returns the symbol.
	 *
	 * @return The symbol.
	 * @since 11
	 */
  public getSymbol():  string | null {
    return this.symbol;
  }

  /**
	 * Returns the type.
	 *
	 * @return The type.
	 * @since 11
	 */
  public getType():  MetadataType | null {
    return this.type;
  }

  /**
	 * Returns the position.
	 *
	 * @return The position.
	 * @since 11
	 */
  public getPosition():  MetadataPosition | null {
    return this.position;
  }

}
