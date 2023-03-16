/**
 * File:     Breakdown.ts
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     16.02.2023
 */
 
import { Fragment } from './Fragment';
import { MetadataPosition } from './MetadataPosition';
import { Split } from './Split';
import {XmlNode} from 'simple_xml';

/**
 * Defines breakdowns. The delimiters are removed.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 */
export abstract class Breakdown extends Fragment {
  /**
   * The splits.
   */
  private readonly splits:  Split[] = [];

  /**
   * The deleri ('*' / erased / Rasur) position.
   */
  private readonly deleriPosition:  MetadataPosition;

  /**
   * Creates a breakdown.
   *
   * @param deleriPosition The deleri ('*' / erased / Rasur) position.
   * @param text           The text. If null, do not normalize.
   */
  protected constructor(deleriPosition: MetadataPosition, text: string| null) {
    super(text);

    if (text !== null) {
      const  matches = text.matchAll(Split.pattern);
      for (const match of matches) {
        if(match[1].length > 0) {
          const  split: Split = new  Split(this.getStatus(), deleriPosition, match[1]);
          this.splits.push(split);

          deleriPosition = split.getDeleriPosition();
        }
      }
    }

    this.deleriPosition = deleriPosition;
  }

  /**
   * Returns the deleri ('*' / erased / Rasur) position.
   *
   * @return The deleri ('*' / erased / Rasur) position.
   */
  public getDeleriPosition():  MetadataPosition {
    return this.deleriPosition;
  }

  /**
   * Returns the splits.
   *
   * @return The splits.
   */
  public getSplits(): Split[] {
    return this.splits;
  }

  /**
   * Returns the plain text.
   *
   * @return The plain text.
   */
  public getPlainText():  string {
    const  buffer: string[] = [];

    for (const split of this.splits)
      buffer.push(split.getMainPartPlainText());

    return buffer.join('');
  }

  protected exportNodes(): XmlNode[] {
    let nodes: XmlNode[] = [];
    
    for (const split of this.splits) {
      nodes = nodes.concat(split.exportNodes());
    }
    return nodes;
  }
}
