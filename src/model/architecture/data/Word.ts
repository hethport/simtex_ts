/**
 * File:     Word.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core.data
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     19.12.2022
 */



import { JavaObject, java, S } from "../../../../../../../../../usr/bin/java";
import { AkkadianPreposition } from "./AkkadianPreposition";
import { Akkadogram } from "./Akkadogram";
import { Basic } from "./Basic";
import { Data } from "./Data";
import { DegreeSign } from "./DegreeSign";
import { Delimiter } from "./Delimiter";
import { Determinative } from "./Determinative";
import { FractionNumber } from "./FractionNumber";
import { Glossing } from "./Glossing";
import { LanguageChange } from "./LanguageChange";
import { NotImplemented } from "./NotImplemented";
import { Sumerogram } from "./Sumerogram";
import { UndefinedDegreeSign } from "./UndefinedDegreeSign";
import { LineEntity } from "../LineEntity";
import { LineSource } from "../LineSource";
import { Status } from "../Status";
import { StatusEvent } from "../StatusEvent";
import { StatusEventCode } from "../StatusEventCode";
import { StatusLevel } from "../StatusLevel";
import { Breakdown } from "./fragment/Breakdown";
import { Fragment } from "./fragment/Fragment";
import { FragmentBreakdownType } from "./fragment/FragmentBreakdownType";
import { MetadataPosition } from "./fragment/MetadataPosition";




/**
 * Defines words.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 * @since 11
 */
export  class Word extends JavaObject implements LineEntity {
	/**
	 * The hyphen escape character.
	 */
	private static readonly hyphenEscapeCharacter:  java.lang.String | null = Data.spaceEscapeCharacter;

	/**
	 * The alphabet in lower case.
	 */
	protected static readonly alphabetLowerCase:  java.lang.String | null = S`a-záàéèíìúùṣṭšḫ`;

	/**
	 * The alphabet in upper case.
	 */
	protected static readonly alphabetUpperCase:  java.lang.String | null = S`A-ZÁÀÉÈÍÌÚÙṢṬŠḪ`;

	/**
	 * The alphabet.
	 */
	public static readonly alphabet:  java.lang.String | null = Word.alphabetLowerCase + Word.alphabetUpperCase;

	/**
	 * The index digits.
	 */
	protected static readonly indexDigits:  java.lang.String | null = S`₀₁₂₃₄₅₆₇₈₉ₓ`;

	/**
	 * The deleri (erased / Rasur).
	 */
	public static readonly deleri:  java.lang.String | null = S`*`;

	/**
	 * The delimiter alphabet.
	 */
	public static readonly delimiterAlphabet:  java.lang.String | null = S`\\[\\]⸢⸣〉〈\\` + Word.deleri;

	/**
	 * The subscript.
	 */
	public static readonly subscript:  java.lang.String | null = S`|`;

	/**
	 * The subscript regular expression.
	 */
	protected static readonly subscriptRegularExpression:  java.lang.String | null = S`(|` + S`\\` + Word.subscript + S`[\\` + Word.subscript + Word.alphabet
			+ S`\\d` + Word.indexDigits + Word.delimiterAlphabet + S`]*` + S`)`;

	/**
	 * The pattern for Gods names.
	 */
	protected static readonly godsNamepattern:  java.util.regex.Pattern | null = java.util.regex.Pattern.compile(S`(°D°)(10|30)`);

	/**
	 * The pattern for text with hyphens and escaped hyphens.
	 */
	private static readonly patternHyphenAndEscape:  java.util.regex.Pattern | null = java.util.regex.Pattern
			.compile(S`([\\-` + Word.hyphenEscapeCharacter + S`]{1})` + S`([^\\-` + Word.hyphenEscapeCharacter + S`]*)`);

	/**
	 * The status.
	 */
	private readonly status:  Status | null = new  Status();

	/**
	 * The text.
	 */
	private readonly text:  java.lang.String | null;

	/**
	 * The normalized text.
	 */
	private readonly normalizedText:  java.lang.String | null;

	/**
	 * The fragments.
	 */
	private readonly fragments:  java.util.List<Fragment> | null;

	/**
	 * The deleri ('*' / erased / Rasur) position.
	 */
	private deleriPosition:  MetadataPosition | null = MetadataPosition.initial;

	/**
	 * Creates a word.
	 * 
	 * @param word The word.
	 * @since 11
	 */
	public constructor(word: java.lang.String| null) {
		super();

		this.text = word;
		this.normalizedText = Word.normalize(this.text);

		this.fragments = this.parse(this.normalizedText);

		for (let fragment of this.fragments)
			this.status.addLevel(fragment.getStatus());

		if (!MetadataPosition.initial.equals(this.deleriPosition))
			this.status.add(new  StatusEvent(StatusLevel.moderate, StatusEventCode.required,
					S`missed final deleri ('*' / erased / Rasur).`));
	}

	/**
	 * Returns the normalized text.
	 * 
	 * @param text The text to normalize.
	 * @return The normalized text.
	 * @since 11
	 */
	private static normalize(text: java.lang.String| null):  java.lang.String | null {
		if (text === null)
			return null;
		else if (text.isBlank())
			return S``;
		else {
			text = text.trim();

			if (S`><`.equals(text))
				return S`\u12270`;
			if (text.matches(S`^[` + FractionNumber.availableGlyphs + S`]{1}$`))
				// the parser does not expect glyphs for fractions
				return FractionNumber.getFractionNumber(text).getText();
			else
				return text.replaceAll(S`=`, S`⸗`)

						.replaceAll(S`h`, S`ḫ`).replaceAll(S`H`, S`Ḫ`)

						.replaceAll(S`<`, S`〈`).replaceAll(S`>`, S`〉`).replaceAll(S`〈-`, S`-〈`).replaceAll(S`-〉`, S`〉-`)

						.replaceAll(S`;`, S`\u12039`).replaceAll(S`:`, S`\u12471`)

						.replaceAll(S`§§`, S`===`).replaceAll(S`§`, S`¬¬¬`);
		}
	}

	/**
	 * Parses the text and returns the fragments.
	 * 
	 * @param text The text to parse.
	 * @return The fragments.
	 * @since 11
	 */
	private parse(text: java.lang.String| null):  java.util.List<Fragment> | null {
		let  fragments: java.util.List<Fragment> = new  java.util.ArrayList();

		if (text !== null && !text.isEmpty()) {
			// test for fraction numbers
			let  matcherFractionNumber: java.util.regex.Matcher = FractionNumber.pattern.matcher(text);
			if (matcherFractionNumber.matches())
				fragments.add(new  FractionNumber(text, matcherFractionNumber.group(1), matcherFractionNumber.group(2)));
			else {
				/*
				 * extract the determinative and glossing, and recursively the remainder
				 * fragments
				 */
				let  matcher: java.util.regex.Matcher = DegreeSign.pattern.matcher(text);

				let  buffer: java.lang.StringBuffer;
				while (matcher.find()) {
					buffer = new  java.lang.StringBuffer();

					matcher.appendReplacement(buffer, S``);

					if (buffer.length() > 0)
						fragments.addAll(this.parseSegment(buffer.toString()));

					fragments.add(this.getDeterminativeGlossing(matcher.group(0), matcher.group(1)));
				}

				buffer = new  java.lang.StringBuffer();
				matcher.appendTail(buffer);
				if (buffer.length() > 0)
					fragments.addAll(this.parseSegment(buffer.toString()));
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
	private getDeterminativeGlossing(segment: java.lang.String| null, content: java.lang.String| null):  Fragment | null {
		let  fragment: Fragment;

		if (content.isEmpty() || content.contains(S` `)) {
			fragment = this.getFragment(FragmentBreakdownType.UndefinedDegreeSign, segment);

			fragment.getStatus()
					.add(new  StatusEvent(StatusLevel.serious, StatusEventCode.undefined, S`degree sign segment '`
							+ segment + S`' contains ` + (content.isEmpty() ? S`an empty string` : S`spaces`) + S`.`));
		} else if (content.equals(S`m`) || content.equals(S`m.D`) || content.equals(S`f`) || content.equals(S`f.D`)
				|| Determinative.pattern.matcher(content).matches())
			fragment = this.getFragment(FragmentBreakdownType.Determinative, segment, content);
		else if (Glossing.pattern.matcher(content).matches())
			fragment = this.getFragment(FragmentBreakdownType.Glossing, segment, content);
		else {
			fragment = this.getFragment(FragmentBreakdownType.UndefinedDegreeSign, segment);

			fragment.getStatus().add(new  StatusEvent(StatusLevel.serious, StatusEventCode.malformed,
					S`degree sign segment '` + segment + S`' is malformed.`));
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
	private parseSegment(segment: java.lang.String| null):  java.util.List<Fragment> | null {
		let  fragments: java.util.List<Fragment> = new  java.util.ArrayList();

		// test for language changes
		if (segment.startsWith(S`@`))
			fragments.add(new  LanguageChange(segment));
		else {
			/*
			 * extract the prepositions, and recursively the remainder fragments
			 */
			let  matcher: java.util.regex.Matcher = AkkadianPreposition.pattern.matcher(segment);

			let  buffer: java.lang.StringBuffer;
			while (matcher.find()) {
				buffer = new  java.lang.StringBuffer();

				matcher.appendReplacement(buffer, S``);

				if (buffer.length() > 0)
					fragments.addAll(this.parseText(buffer.toString()));

				fragments.add(new  AkkadianPreposition(matcher.group(0)));
			}

			buffer = new  java.lang.StringBuffer();
			matcher.appendTail(buffer);
			if (buffer.length() > 0)
				fragments.addAll(this.parseText(buffer.toString()));
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
	private parseText(text: java.lang.String| null):  java.util.List<Fragment> | null {
		let  fragments: java.util.List<Fragment> = new  java.util.ArrayList();

		 let  hyphenFirstIndex: number = text.indexOf(S`-`);

		let  type: FragmentBreakdownType = null;
		let  buffer: java.lang.StringBuffer = new  java.lang.StringBuffer();

		// The text does not start with hyphen
		if (hyphenFirstIndex !== 0) {
			let  part: java.lang.String = hyphenFirstIndex === -1 ? text : text.substring(0, hyphenFirstIndex);

			if (part.startsWith(S`_`)) {
				if (Word.isAkkadogramType(part.substring(1))) {
					type = FragmentBreakdownType.Akkadogram;

					buffer.append(part.substring(1));
				} else
					fragments.add(this.getFragment(FragmentBreakdownType.NotImplemented, part));
			} else if (Word.isDelimiterType(part))
				fragments.add(this.getFragment(FragmentBreakdownType.Delimiter, part));
			else if (Word.isNumberType(part))
				fragments.add(this.getFragment(FragmentBreakdownType.Number, part));
			else if (Word.isSumerogramType(part)) {
				type = FragmentBreakdownType.Sumerogram;

				buffer.append(part);
			} else if (Word.isBasicType(part)) {
				type = FragmentBreakdownType.Basic;

				buffer.append(part);
			} else
				fragments.add(this.getFragment(FragmentBreakdownType.NotImplemented, part));
		}

		// The text parts after hyphens
		if (hyphenFirstIndex >= 0) {
			// escape required hyphens
			text = text.replaceAll(S`--`, Word.hyphenEscapeCharacter);

			let  matcher: java.util.regex.Matcher = Word.patternHyphenAndEscape
					.matcher(hyphenFirstIndex === 0 ? text : text.substring(hyphenFirstIndex));
			while (matcher.find()) {
				if (Word.hyphenEscapeCharacter.equals(matcher.group(1))) {
					if (Word.isSumerogramType(matcher.group(2))) {
						if (type !== null && !FragmentBreakdownType.Sumerogram.equals(type)) {
							fragments.add(this.getFragment(type, buffer));
							buffer = new  java.lang.StringBuffer();
						}

						type = FragmentBreakdownType.Sumerogram;

						buffer.append(S`-` + matcher.group(2));
					} else
						fragments.add(this.getFragment(FragmentBreakdownType.NotImplemented, S`--` + matcher.group(2)));
				} else if (Word.isDelimiterType(matcher.group(2))) {
					if (type !== null) {
						fragments.add(this.getFragment(type, buffer));

						type = null;
						buffer = new  java.lang.StringBuffer();
					}

					fragments.add(this.getFragment(FragmentBreakdownType.Delimiter, S`-` + matcher.group(2)));
				} else if (Word.isNumberType(matcher.group(2))) {
					if (type !== null) {
						fragments.add(this.getFragment(type, buffer));

						type = null;
						buffer = new  java.lang.StringBuffer();
					}

					fragments.add(this.getFragment(FragmentBreakdownType.Number, S`-` + matcher.group(2)));
				} else if (Word.isAkkadogramType(matcher.group(2))) {
					if (type !== null && !FragmentBreakdownType.Akkadogram.equals(type)) {
						fragments.add(this.getFragment(type, buffer));
						buffer = new  java.lang.StringBuffer();
					}

					type = FragmentBreakdownType.Akkadogram;

					buffer.append(S`-` + matcher.group(2));
				} else if (Word.isBasicType(matcher.group(2))) {
					if (type !== null && !FragmentBreakdownType.Basic.equals(type)) {
						fragments.add(this.getFragment(type, buffer));
						buffer = new  java.lang.StringBuffer();
					}

					type = FragmentBreakdownType.Basic;

					buffer.append(S`-` + matcher.group(2));
				} else
					fragments.add(this.getFragment(FragmentBreakdownType.NotImplemented, S`-` + matcher.group(2)));
			}
		}

		if (type !== null)
			fragments.add(this.getFragment(type, buffer));

		return fragments;
	}

	/**
	 * Returns the fragment for given text type without segment.
	 * 
	 * @param type   The text type.
	 * @param buffer The text.
	 * @return The fragment.
	 * @since 11
	 */
	private getFragment(type: FragmentBreakdownType| null, buffer: java.lang.StringBuffer| null):  Fragment | null;

	/**
	 * Returns the fragment with breakdowns for given text type without segment.
	 * 
	 * @param type The text type.
	 * @param text The text.
	 * @return The fragment.
	 * @since 11
	 */
	private getFragment(type: FragmentBreakdownType| null, text: java.lang.String| null):  Fragment | null;

	/**
	 * Returns the fragment with breakdowns for given text type.
	 * 
	 * @param type    The text type.
	 * @param segment The segment.
	 * @param text    The text.
	 * @return The fragment.
	 * @since 11
	 */
	private getFragment(type: FragmentBreakdownType| null, segment: java.lang.String| null, text: java.lang.String| null):  Fragment | null;


	/**
	 * Returns the fragment for given text type without segment.
	 * 
	 * @param type   The text type.
	 * @param buffer The text.
	 * @return The fragment.
	 * @since 11
	 */
	private getFragment(type: FragmentBreakdownType | null, bufferOrTextOrSegment: java.lang.StringBuffer | java.lang.String | null, text?: java.lang.String | null):  Fragment | null {
if (bufferOrTextOrSegment instanceof java.lang.StringBuffer && text === undefined) {
const buffer = bufferOrTextOrSegment as java.lang.StringBuffer;
		return this.getFragment(type, buffer.toString());
	}
 else if (bufferOrTextOrSegment instanceof java.lang.String && text === undefined) {
const text = bufferOrTextOrSegment as java.lang.String;
		return this.getFragment(type, null, text);
	}
 else  {
let segment = bufferOrTextOrSegment as java.lang.String;
		let  fragment: Breakdown;

		switch (type) {
		case Determinative:
			fragment = new  Determinative(this.deleriPosition, segment, text);
			break;

		case Glossing:
			fragment = new  Glossing(this.deleriPosition, segment, text);
			break;

		case UndefinedDegreeSign:
			fragment = new  UndefinedDegreeSign(this.deleriPosition, text);
			break;

		case Delimiter:
			fragment = new  Delimiter(this.deleriPosition, text);
			break;

		case java.lang.Number:
			fragment = new  java.lang.Number(this.deleriPosition, text);
			break;

		case Basic:
			fragment = new  Basic(this.deleriPosition, text);
			break;

		case Akkadogram:
			fragment = new  Akkadogram(this.deleriPosition, text);
			break;

		case Sumerogram:
			fragment = new  Sumerogram(this.deleriPosition, text);
			break;

		case NotImplemented:
		default:
			return new  NotImplemented(text);
		}

		this.deleriPosition = fragment.getDeleriPosition();

		return fragment;
	}

}


	/**
	 * Returns true if the given text is of type number.
	 * 
	 * @param text The text.
	 * @return True if the given text is of type number.
	 * @since 11
	 */
	private static isNumberType(text: java.lang.String| null):  boolean {
		return java.lang.Number.pattern.matcher(text).matches();
	}

	/**
	 * Returns true if the given text is of type delimiter.
	 * 
	 * @param text The text.
	 * @return True if the given text is of type delimiter.
	 * @since 11
	 */
	private static isDelimiterType(text: java.lang.String| null):  boolean {
		return Delimiter.pattern.matcher(text).matches();
	}

	/**
	 * Returns true if the given text is of type basic.
	 * 
	 * @param text The text.
	 * @return True if the given text is of type basic.
	 * @since 11
	 */
	private static isBasicType(text: java.lang.String| null):  boolean {
		return Basic.pattern.matcher(text).matches();
	}

	/**
	 * Returns true if the given text is of type Akkadogram.
	 * 
	 * @param text The text.
	 * @return True if the given text is of type Akkadogram.
	 * @since 11
	 */
	private static isAkkadogramType(text: java.lang.String| null):  boolean {
		return Akkadogram.pattern.matcher(text).matches();
	}

	/**
	 * Returns true if the given text is of type Sumerogram.
	 * 
	 * @param text The text.
	 * @return True if the given text is of type Sumerogram.
	 * @since 11
	 */
	private static isSumerogramType(text: java.lang.String| null):  boolean {
		return Sumerogram.pattern.matcher(text).matches();
	}

	/**
	 * Parses the word.
	 * 
	 * @param text The text to parse.
	 * @return The word.
	 * @since 11
	 */
	public static parseWord(text: java.lang.String| null):  Word | null {
		 let  normalized: java.lang.String = LineSource.normalize(text);

		return new  Word(normalized);
	}

	/**
	 * Returns the status.
	 * 
	 * @return The status.
	 * @since 11
	 */
	public getStatus():  Status | null {
		return this.status;
	}

	/**
	 * Returns the text.
	 *
	 * @return The text.
	 * @since 11
	 */
	public getText():  java.lang.String | null {
		return this.text;
	}

	/**
	 * Returns the normalized text.
	 *
	 * @return The normalized text.
	 * @since 11
	 */
	public getNormalizedText():  java.lang.String | null {
		return this.normalizedText;
	}

	/**
	 * Returns the fragments.
	 *
	 * @return The fragments.
	 * @since 11
	 */
	public getFragments():  java.util.List<Fragment> | null {
		return this.fragments;
	}


}
