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
import { TextEvaluation } from './TextEvaluation';

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
   * Extracts the text evaluations and return them.
   *
   * @return The extracted text evaluations.
   */
  public extractTextEvaluations(): TextEvaluation[] {
    let textEvaluations: TextEvaluation[] = [];
    
    for (const split of this.splits)
      textEvaluations = textEvaluations.concat(split.extractTextEvaluations());
      
    return textEvaluations;
  }

  /**
   * Inserts the text evaluations to the beginning of the first split (main part).
   *
   * @param textEvaluations The text evaluations to insert.
   */
  public insertTextEvaluations(textEvaluations: TextEvaluation[]) {
    if (this.splits.length > 0)
       this.splits[0].insertTextEvaluations(textEvaluations);
  }

  /**
   * Removes the text evaluation from the beginning if available an returns it.
   *
   * @return The text evaluation from the beginning if available. Otherwise null.
   */
  public removeBeginTextEvaluation(): TextEvaluation | null {
    return this.splits.length == 0 ? null : this.splits[0].removeBeginTextEvaluation();
  }
  
  /**
   * Adds the text evaluations to the end of the text evaluations.
   *
   * @param textEvaluation The text evaluations to add.
   */
  public addTextEvaluation(textEvaluation: TextEvaluation) {
    if (this.splits.length > 0)
      this.splits[this.splits.length -1].addTextEvaluation(textEvaluation);
  }
  
  /**
   * Normalize the text evaluations.
   */
  public normalizeTextEvaluations() {
   for (const split of this.splits)
     split.normalizeTextEvaluations();
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
