/**
 * File:     ParagraphLanguageType.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core.metadata
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     16.02.2023
 */


export enum  ParagraphLanguageType {
    Akk,
    Sum,
    Luw,
    Pal,
    Hur,
    Hat,
    Hit,
    Ign,
}

export function defaultParagraphLanguage(): ParagraphLanguageType {
  return ParagraphLanguageType.Hit;
}