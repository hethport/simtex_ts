export const upperSpecialChars = 'ÁÀÉÈÍÌÚÙṬṢŠḪ';

export const lowerSpecialChars = 'áàéèíìúùṭṣšḫ';

export const subscripts = '₀₁₂₃₄₅₆₇₈₉';

// TODO: is there an uppercase X?
const upperCharRegex = /[A-ZÁÀÉÈÍÌÚÙṬṢŠḪ]/;

// important: x has special meaning!
const lowerCharRegex = /[a-wyzáàéèíìúùṭṣšḫ]/;

const digitCharRegex = /[0-9]/;

export const isUpperChar = (char: string): boolean => upperCharRegex.test(char);

export const isLowerChar = (char: string): boolean => lowerCharRegex.test(char);

export const isDigitChar = (char: string):boolean => digitCharRegex.test(char);

export const digitToSubscript = (char: string) : string => String.fromCharCode('₀'.charCodeAt(0) + parseInt(char));
