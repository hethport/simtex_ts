/**
 * File:     ParagraphLanguageType.ts
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     16.02.2023
 */

/*
 * @‌Akk (Akkadian)
 * @‌Sum (Sumerian)
 * @‌Luw (Luwian)
 * @‌Pal (Palaic)
 * @‌Hur (Hurrian)
 * @‌Hat (Hattic)
 * @‌Hit (Hittite)
 * @‌Ign (Ignota/unknown language)
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
    ign,
}

export function defaultParagraphLanguage(): ParagraphLanguageType {
  return ParagraphLanguageType.Hit;
}
