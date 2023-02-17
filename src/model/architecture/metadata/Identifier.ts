/**
 * File:     Identifier.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core.metadata
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     06.12.2022
 */


import { Metadata } from './Metadata';
import { LineSource } from '../LineSource';
import { StatusEvent } from '../StatusEvent';
import { StatusEventCode } from '../StatusEventCode';
import { StatusLevel } from '../StatusLevel';


/**
 * Define identifiers.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 * @since 11
 */
export  class Identifier extends Metadata {
  /**
	 * The identifiers.
	 */
  private readonly identifiers:  string[] = [];

  /**
	 * The comment.
	 */
  private readonly comment:  string | null;

  /**
	 * Creates an identifier.
	 * 
	 * @param source The line source.
	 * @since 11
	 */
  public constructor(source: LineSource) {
    super(source);

    let  comment = '';

    let  textNormalized: string = source.getTextNormalized();
    if (textNormalized.includes('#')) {
      const  index: number = textNormalized.indexOf('#');
      comment = index + 1 < textNormalized.length ? textNormalized.substring(index + 1) : '';
      textNormalized = textNormalized.substring(0, index);
    }
    this.comment = comment.trim();
    if (this.comment.length == 0) {
      this.comment = null;
    }

    const  identifiers: string = textNormalized.length === 1 ? '' : textNormalized.substring(1).trim();
    for (const identifier of identifiers.split('\\+'))
      if (identifier.trim().length > 0)
        this.identifiers.push(identifier.trim());

    if (this.identifiers.length == 0)
      this.getStatus()
        .add(new  StatusEvent(StatusLevel.severe, StatusEventCode.undefined, 'identification is undefined'));
  }

  /**
	 * Returns the identifiers.
	 *
	 * @return The identifiers.
	 * @since 11
	 */
  public getIdentifiers():  string[] {
    return this.identifiers;
  }

  /**
	 * Returns the comment.
	 *
	 * @return The comment.
	 * @since 11
	 */
  public getComment():  string | null {
    return this.comment;
  }

}
