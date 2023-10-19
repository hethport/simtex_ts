/**
 * File:     Collection.ts
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     05.07.2023
 */

import { Breakdown } from './Breakdown';
import { XmlNode } from 'simple_xml';

/**
 * Defines collections.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 */
export abstract class Collection extends Breakdown {
  /**
   * The elements.
   */
  private readonly elements:  Breakdown[] = [];

  /**
   * Creates a collection.
   *
   * @param text           The text.
   */
  public constructor(text: string) {
    super(text);
  }
  
  /**
   * Adds an element to the collection.
   *
   * @param element The element to add.
   */
  public addElement(element: Breakdown) {
    this.elements.push(element);
  }

  public exportNodes(): XmlNode[] {
    let nodes: XmlNode[] = super.exportNodes();
    
    for (const element of this.elements) {
      if (element instanceof Collection)
        for (const split of element.getSplits())
          nodes = nodes.concat(split.exportNodes());
      else
        nodes = nodes.concat(element.exportXml());
    }

    return nodes;
  }

  /**
   * Returns true if the given object is of same type.
   *
   * @return True if the given object is of same type.
   */
  public abstract isSameType(object : Collection): boolean;
}
