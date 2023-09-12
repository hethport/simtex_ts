/**
 * File:     LanguageChangeType.ts
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     16.02.2023
 */

/*
 * @a -> Akk (Akkadian)
 * @s -> Sum (Sumerian)
 * @l -> Luw (Luwian)
 * @p -> Pal (Palaic)
 * @hu -> Hur (Hurrian)
 * @ha -> Hat (Hattic)
 * @h -> Hit (Hittite)
 * @i -> Ign (Ignota/unknown language)
 */
export enum LanguageChangeType {
  a,
  s,
  l,
  p,
  hu,
  ha,
  h,
  i,
}

export function convertToAbbreviation(languageType: LanguageChangeType): string {

  switch (languageType) {
  case LanguageChangeType.a:
    return 'Akk';
  case LanguageChangeType.s:
    return 'Sum';
  case LanguageChangeType.l:
    return 'Luw';
  case LanguageChangeType.p:
    return 'Pal';
  case LanguageChangeType.hu:
    return 'Hur';
  case LanguageChangeType.ha:
    return 'Hat';
  case LanguageChangeType.h:
    return 'Hit';
  case LanguageChangeType.i:
    return 'ign';
  default:
    return '';
  }
}
