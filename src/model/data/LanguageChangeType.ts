/**
 * File:     LanguageChangeType.ts
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     16.02.2023
 */

export enum LanguageChangeType {
  a,
  s,
  l,
  p,
  hu,
  ha,
  h,
}

export function convertToAbbreviation(languageType: LanguageChangeType): string {

  switch (languageType) {
  case LanguageChangeType.a:
    return 'Akk';
  case LanguageChangeType.ha:
    return 'Hat';
  case LanguageChangeType.h:
    return 'Het';
  case LanguageChangeType.hu:
    return 'Hur';
  case LanguageChangeType.p:
    return 'Pal';
  case LanguageChangeType.s:
    return 'Sum';
  case LanguageChangeType.l:
    return 'Luw';
  default:
    return '';
  }
}
