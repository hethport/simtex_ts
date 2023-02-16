/**
 * File:     MetadataType.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core.data.fragment
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     16.02.2023
 */



import { java, S } from "../../../../../../../../../../usr/bin/java";
import { Word } from "../Word";


 class  MetadataType extends java.lang.Enum<MetadataType> {
	public static readonly deletum: MetadataType = new class extends MetadataType {
}(S`[`, S`]`,S`deletum`, 0); public static readonly laedi: MetadataType = new class extends MetadataType {
}(S`⸢`, S`⸣`,S`laedi`, 1); public static readonly deleri: MetadataType = new class extends MetadataType {
}(Word.deleri,S`deleri`, 2); public static readonly undefined: MetadataType = new class extends MetadataType {
}(S`undefined`, 3);

	/**
	 * The symbol.
	 */
	private readonly symbols:  java.util.Set<java.lang.String> | null = new  java.util.HashSet();

	/**
	 * Creates a type.
	 * 
	 * @param symbols The symbols.
	 * @since 11
	 */
	private constructor(...symbols: java.lang.String| null[], $name$: java.lang.String, $index$: number) {
		super($name$, $index$);
for (let symbol of this.symbols)
			this.symbols.add(symbol);
	}

	/**
	 * Returns the label.
	 *
	 * @return The label.
	 * @since 11
	 */
	public getLabel():  java.lang.String | null {
		return this.name();
	}

	/**
	 * Returns true if the given symbol belong to the type.
	 *
	 * @return True if the given symbol belong to the type.
	 * @since 11
	 */
	public isSymbol(symbol: java.lang.String| null):  boolean {
		return symbol !== null && this.symbols.contains(symbol);
	}

	/**
	 * Returns the type for given symbol.
	 * 
	 * @param symbol The symbol.
	 * @return The type. On troubles, returns undefined.
	 * @since 11
	 */
	public static getType(symbol: java.lang.String| null):  MetadataType | null {
		if (symbol !== null && !symbol.isBlank()) {
			symbol = symbol.trim();

			for (let type of MetadataType.values())
				if (type.isSymbol(symbol))
					return type;
		}

		return MetadataType.undefined;
	}
}
