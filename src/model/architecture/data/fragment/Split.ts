/**
 * File:     Split.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core.data.fragment
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     16.02.2023
 */



import { JavaObject, java, S } from "../../../../../../../../../../usr/bin/java";
import { Content } from "./Content";
import { Metadata } from "./Metadata";
import { MetadataPosition } from "./MetadataPosition";
import { Slice } from "./Slice";
import { Status } from "../../Status";
import { StatusEvent } from "../../StatusEvent";
import { StatusEventCode } from "../../StatusEventCode";
import { StatusLevel } from "../../StatusLevel";
import { Word } from "../Word";




/**
 * Defines splits.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 * @since 11
 */
export  class Split extends JavaObject {
	/**
	 * The pattern.
	 */
	public static pattern:  java.util.regex.Pattern | null = java.util.regex.Pattern.compile(S`([\\-]*[^\\-]*)`);

	/**
	 * The pattern for index.
	 */
	private static indexPattern:  java.util.regex.Pattern | null = java.util.regex.Pattern.compile(S`([` + Word.alphabet + S`]+)(\\d+|x)($|\\.)`);

	/**
	 * The pattern for delimiter.
	 */
	private static delimiterPattern:  java.util.regex.Pattern | null = java.util.regex.Pattern.compile(S`([` + Word.delimiterAlphabet + S`]{1})`);

	/**
	 * The deleri ('*' / erased / Rasur) position.
	 */
	private deleriPosition:  MetadataPosition | null;

	/**
	 * The main part.
	 */
	private readonly mainPart:  java.util.List<Slice> | null;

	/**
	 * The subscript.
	 */
	private readonly subscript:  java.util.List<Slice> | null;

	/**
	 * Creates a split.
	 * 
	 * @param status         The status.
	 * @param deleriPosition The deleri ('*' / erased / Rasur) position.
	 * @param text           The text.
	 * @since 11
	 */
	public constructor(status: Status| null, deleriPosition: MetadataPosition| null, text: java.lang.String| null) {
		super();

		this.deleriPosition = deleriPosition;

		let  split: java.lang.String[] = text.split(S`\\` + Word.subscript, 2);

		this.mainPart = this.normalize(split[0]);

		if (split.length === 1)
			this.subscript = new  java.util.ArrayList();
		else {
			if (split[1].contains(Word.subscript))
				status.add(new  StatusEvent(StatusLevel.minor, StatusEventCode.malformed,
						S`multiple suffix characters '` + Word.subscript + S`' available in split '` + text + '.'));

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
	private normalize(/* final */  text: java.lang.String| null):  java.util.List<Slice> | null {
		let  slice: java.util.List<Slice> = new  java.util.ArrayList();

		if (!text.isEmpty()) {
			/*
			 * convert index digits and unknown reading (the delimiters are removed)
			 */
			let  matcher: java.util.regex.Matcher = Split.indexPattern.matcher(text.replaceAll(S`[` + Word.delimiterAlphabet + S`]+`, S``));
			let  buffer: java.lang.StringBuffer = new  java.lang.StringBuffer();
			while (matcher.find())
				matcher.appendReplacement(buffer,
						matcher.group(1) + Split.convertToIndex(matcher.group(2)) + matcher.group(3));
			matcher.appendTail(buffer);

			/*
			 * create the slices take into account the delimiters
			 */
			let  plainText: java.lang.String = buffer.toString();

			matcher = Split.delimiterPattern.matcher(text);

			let  indexBegin: number = 0;
			while (matcher.find()) {
				buffer = new  java.lang.StringBuffer();

				matcher.appendReplacement(buffer, S``);

				if (buffer.length() > 0) {
					let  indexEnd: number = indexBegin + buffer.length();

					slice.add(new  Content(plainText.substring(indexBegin, indexEnd)));

					indexBegin = indexEnd;
				}

				let  delimiter: java.lang.String = matcher.group(1);
				if (Word.deleri.equals(delimiter)) {
					slice.add(new  Metadata(this.deleriPosition));

					this.deleriPosition = MetadataPosition.initial.equals(this.deleriPosition) ? MetadataPosition.end
							: MetadataPosition.initial;
				} else
					slice.add(new  Metadata(delimiter));
			}

			buffer = new  java.lang.StringBuffer();
			matcher.appendTail(buffer);

			if (buffer.length() > 0)
				slice.add(new  Content(plainText.substring(indexBegin, indexBegin + buffer.length())));
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
	private static convertToIndex(text: java.lang.String| null):  java.lang.String | null {
		let  buffer: java.lang.StringBuffer = new  java.lang.StringBuffer();

		for (let  i: number = 0; i < text.length(); i++) {
			switch (text.charAt(i)) {
			case '0':
				buffer.append(S`₀`);
				break;

			case '1':
				buffer.append(S`₁`);
				break;

			case '2':
				buffer.append(S`₂`);
				break;

			case '3':
				buffer.append(S`₃`);
				break;

			case '4':
				buffer.append(S`₄`);
				break;

			case '5':
				buffer.append(S`₅`);
				break;

			case '6':
				buffer.append(S`₆`);
				break;

			case '7':
				buffer.append(S`₇`);
				break;

			case '8':
				buffer.append(S`₈`);
				break;

			case '9':
				buffer.append(S`₉`);
				break;

			case 'x':
				buffer.append(S`ₓ`);
				break;

default:

			}
		}

		return buffer.toString();
	}

	/**
	 * Returns the deleri ('*' / erased / Rasur) position.
	 *
	 * @return The deleri ('*' / erased / Rasur) position.
	 * @since 11
	 */
	public getDeleriPosition():  MetadataPosition | null {
		return this.deleriPosition;
	}

	/**
	 * Returns the main part.
	 *
	 * @return The main part.
	 * @since 11
	 */
	public getMainPart():  java.util.List<Slice> | null {
		return this.mainPart;
	}

	/**
	 * Returns the main part plain text.
	 *
	 * @return The main part plain text.
	 * @since 11
	 */
	public getMainPartPlainText():  java.lang.String | null {
		return Split.getPlainText(this.mainPart);
	}

	/**
	 * Returns the subscript.
	 *
	 * @return The subscript.
	 * @since 11
	 */
	public getSubscript():  java.util.List<Slice> | null {
		return this.subscript;
	}

	/**
	 * Returns the subscript plain text.
	 *
	 * @return The subscript plain text.
	 * @since 11
	 */
	public getSubscriptPlainText():  java.lang.String | null {
		return Split.getPlainText(this.subscript);
	}

	/**
	 * Returns the plain text of given slices.
	 * 
	 * @param slices The slices.
	 * @return The plain text.
	 * @since 11
	 */
	private static getPlainText(slices: java.util.List<Slice>| null):  java.lang.String | null {
		let  buffer: java.lang.StringBuffer = new  java.lang.StringBuffer();

		for (let slice of slices)
			if (slice instanceof Content)
				buffer.append(( slice as Content).getText());

		return buffer.toString();
	}

}
