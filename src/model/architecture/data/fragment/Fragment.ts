/**
 * File:     Fragment.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core.data.fragment
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     16.02.2023
 */


import { Status } from '../../Status';
import {ExportXML} from '../../ExportXML';
import {XmlElementNode, XmlNode, xmlTextNode} from 'simple_xml';


/**
 * Fragment is an immutable class that defines fragments.
 *
 * @author <a href="mailto:herbert.baier@uni-wuerzburg.de">Herbert Baier</a>
 * @version 1.0
 * @since 11
 */
export abstract class Fragment implements ExportXML{
  /**
	 * The entity status. The default status is 'ok'.
	 */
  private readonly status:  Status = new  Status();

  /**
	 * The text.
	 */
  private readonly text:  string| null;

  /**
	 * Creates a fragment.
	 * 
	 * @param text The content.
	 * @since 11
	 */
  public constructor(text: string| null) {
    this.text = text;
  }

  /**
	 * Returns the status.
	 *
	 * @return The status.
	 * @since 11
	 */
  public getStatus():  Status {
    return this.status;
  }

  /**
	 * Returns the text.
	 *
	 * @return The text.
	 * @since 11
	 */
  public getText():  string| null {
    return this.text;
  }

  abstract exportXml(): XmlElementNode
}
