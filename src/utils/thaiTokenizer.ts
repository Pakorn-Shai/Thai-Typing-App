import { KeyboardLayoutData, KeyDefinition } from '../types/typing';

/**
 * Normalizes text to Unicode NFC format to standardize Thai vowel/tone mark sequences.
 */
export function normalizeThaiText(text: string): string {
  return text.normalize('NFC');
}

/**
 * Splits text into individual characters (handling Unicode surrogate pairs).
 */
export function splitIntoCharacters(text: string): string[] {
  const normalized = normalizeThaiText(text);
  return Array.from(normalized);
}

/**
 * Checks if a character is a Thai combining mark (tone mark, above/below vowel, or special mark).
 */
export function isThaiCombiningMark(char: string): boolean {
  if (!char || char.length === 0) return false;
  const code = char.charCodeAt(0);
  // Thai combining marks range:
  // 0x0E31: MAI HAN-AKAT ั
  // 0x0E34-0x0E3A: SARA I .. SARA PHINTHU ิ ี ึ ื ุ ู ฺ
  // 0x0E47-0x0E4E: MAITAIKHU .. YAMAKKAN ็ ่ ้ ๊ ๋ ์ ํ ๎
  return (
    code === 0x0E31 ||
    (code >= 0x0E34 && code <= 0x0E3A) ||
    (code >= 0x0E47 && code <= 0x0E4E)
  );
}

/**
 * Finds the virtual keyboard key and whether Shift is needed for a given character.
 */
export function findKeyForChar(
  char: string,
  layoutData: KeyboardLayoutData
): { key: KeyDefinition; needShift: boolean } | null {
  if (!char) return null;

  for (const row of layoutData.rows) {
    for (const key of row.keys) {
      if (key.normal === char) {
        return { key, needShift: false };
      }
      if (key.shift === char) {
        return { key, needShift: true };
      }
      // Space match
      if (char === ' ' && key.code === 'Space') {
        return { key, needShift: false };
      }
    }
  }

  return null;
}

