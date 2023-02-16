/**
 * File:     Metadata.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core.data.fragment
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     16.02.2023
 */



import { JavaObject, java, S } from "../../../../../../../../../../usr/bin/java";
import { MetadataPosition } from "./MetadataPosition";
import { MetadataType } from "./MetadataType";
import { Slice } from "./Slice";
import { Word } from "../Word";




/**
 * Metadata is an immutable class that defines metadata.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 * @since 11
 */
export  class Metadata extends JavaObject implements Slice {

	/**
	 * The symbol.
	 */
	private readonly symbol:  java.lang.String | null;

	/**
	 * The type.
	 */
	private readonly type:  MetadataType | null;

	/**
	 * The position.
	 */
	private readonly position:  MetadataPosition | null;

	/**
	 * Creates a metadata for types deletum ('[', ']' / delete, omit, erase /
	 * Abgebrochen) or Laedi ('⸢', '⸣' / lesion / Beschädigt).
	 * 
	 * @param text The text.
	 * @since 11
	 */
	/* eslint-disable constructor-super, @typescript-eslint/no-unsafe-call */
public constructor(text: java.lang.String| null);

	/**
	 * Creates a metadata for type deleri ('*' / erased / Rasur).
	 * 
	 * @param position The position.
	 * @since 11
	 */
	public constructor(position: MetadataPosition| null);

	/**
	 * Creates a metadata.
	 * 
	 * @param text     The text.
	 * @param position The position.
	 * @since 11
	 */
	private constructor(text: java.lang.String| null, position: MetadataPosition| null);
public constructor(textOrPosition: java.lang.String | MetadataPosition | null, position?: MetadataPosition | null) {
const $this = (textOrPosition: java.lang.String | MetadataPosition | null, position?: MetadataPosition | null): void => {
if (textOrPosition instanceof java.lang.String && position === undefined) {
const text = textOrPosition as java.lang.String;
		$this(text, null);
	}
 else if (textOrPosition instanceof MetadataPosition && position === undefined) {
const position = textOrPosition as MetadataPosition;
		$this(Word.deleri, position);
	}
 else  {
let text = textOrPosition as java.lang.String;
		super();

		this.symbol = text;
		this.type = MetadataType.getType(text);

		if (S`[`.equals(this.symbol) || S`⸢`.equals(this.symbol))
			this.position = MetadataPosition.initial;
		else if (S`]`.equals(this.symbol) || S`⸣`.equals(this.symbol))
			this.position = MetadataPosition.end;
		else
			this.position = position === null ? MetadataPosition.unknown : position;
	}
};

$this(textOrPosition, position);

}
/* eslint-enable constructor-super, @typescript-eslint/no-unsafe-call */

	/**
	 * Returns the symbol.
	 *
	 * @return The symbol.
	 * @since 11
	 */
	public getSymbol():  java.lang.String | null {
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
