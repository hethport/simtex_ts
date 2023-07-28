/**
 * File:     Identifier.ts
 *
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     06.12.2022
 */

import {Metadata} from './Metadata';
import {LineSource} from '../LineSource';
import {StatusEvent} from '../StatusEvent';
import {StatusEventCode} from '../StatusEventCode';
import {StatusLevel} from '../StatusLevel';
import {Attributes, xmlElementNode, XmlNode, xmlTextNode} from 'simple_xml';

/**
 * Define identifiers.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 */
export abstract class Identifier extends Metadata {

  // TODO: implement correct export
  static readonly xmlTag: string = 'IDENTIFIER';

  /**
   * The identifiers.
   */
  private readonly identifiers: string[] = [];

  /**
   * The comment.
   */
  private readonly comment: string | null;

  /**
   * Creates an identifier.
   *
   * @param source The line source.
   */
  constructor(source: LineSource) {
    super(source);

    let comment = '';

    let textNormalized: string = source.getTextNormalized();
    if (textNormalized.includes('#')) {
      const index: number = textNormalized.indexOf('#');
      comment = index + 1 < textNormalized.length ? textNormalized.substring(index + 1) : '';
      textNormalized = textNormalized.substring(0, index);
    }
    this.comment = comment.trim();
    if (this.comment.length == 0) {
      this.comment = null;
    }

    const identifiers: string = textNormalized.length === 1 ? '' : textNormalized.substring(1).trim();
    for (const identifier of identifiers.split('+')) {
      if (identifier.trim().length > 0) {
        this.identifiers.push(identifier.trim());
      }
    }

    if (this.identifiers.length == 0) {
      this.getStatus().add(new StatusEvent(StatusLevel.error, StatusEventCode.undefined, 'identification is undefined'));
    }
  }

  /**
   * Returns the identifiers.
   *
   * @return The identifiers.
   */
  public getIdentifiers(): string[] {
    return this.identifiers;
  }

  /**
   * Returns the comment.
   *
   * @return The comment.
   */
  public getComment(): string | null {
    return this.comment;
  }

  /**
   * Returns the identifiers concatenated with +.
   *
   * @return The comment.
   */
  public concatIdentifier(): string {
    return this.identifiers.join(' + ');
  }

  protected xmlNodes(): XmlNode[] {
    const identifiers: XmlNode[] = [];

    for (const identifier of this.identifiers) {
      identifiers.push(xmlElementNode(Identifier.xmlTag, {}, [xmlTextNode(identifier)]));
    }

    return identifiers;
  }

  protected xmlAttributes(): Attributes {
    const attributes: Attributes = {};

    if (this.comment != null)
      attributes['COMMENT'] = this.comment;

    return attributes;
  }
}
