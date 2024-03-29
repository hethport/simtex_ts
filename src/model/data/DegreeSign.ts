/**
 * File:     DegreeSignSegmentResponse.ts
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     13.12.2022
 */

import { Breakdown } from './fragment/Breakdown';

/**
 * DegreeSign is an immutable class that defines word fragments between degree
 * signs.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 */
export abstract class DegreeSign extends Breakdown {
  /**
   * The pattern for fragments between degree signs.
   */
  static readonly pattern:  RegExp = new RegExp('°([^°]*)°', 'g');

  /**
   * The segment.
   */
  private readonly segment:  string| null;

  /**
   * Creates a word fragment between degree signs.
   *
   * @param segment        The segment.
   * @param content        The content. Null on troubles.
   */
  public constructor(segment: string| null, content: string| null) {
    super(content);

    this.segment = segment;
  }

  /**
   * Returns the segment.
   *
   * @return The segment.
   */
  public getSegment():  string | null {
    return this.segment;
  }
}
