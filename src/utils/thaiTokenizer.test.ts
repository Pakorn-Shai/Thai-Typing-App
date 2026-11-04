import { describe, it, expect } from 'vitest';
import {
  normalizeThaiText,
  splitIntoCharacters,
  isThaiCombiningMark,
  findKeyForChar,
} from './thaiTokenizer';
import keyboardLayoutsData from '../data/keyboard-layouts.json';

describe('Thai Tokenizer & Layout Utilities', () => {
  it('normalizes Thai text using Unicode NFC format', () => {
    const raw = 'กิ่'; // ก + ิ + ่
    const normalized = normalizeThaiText(raw);
    expect(normalized).toBe(raw.normalize('NFC'));
  });

  it('splits strings into characters properly without losing marks', () => {
    const text = 'สวัสดี';
    const chars = splitIntoCharacters(text);
    expect(chars).toEqual(['ส', 'ว', 'ั', 'ส', 'ด', 'ี']);
  });

  it('detects Thai combining vowels and tone marks', () => {
    expect(isThaiCombiningMark('ั')).toBe(true);
    expect(isThaiCombiningMark('ิ')).toBe(true);
    expect(isThaiCombiningMark('่')).toBe(true);
    expect(isThaiCombiningMark('้')).toBe(true);
    expect(isThaiCombiningMark('ุ')).toBe(true);
    expect(isThaiCombiningMark('์')).toBe(true);

    // Consonants should be false
    expect(isThaiCombiningMark('ก')).toBe(false);
    expect(isThaiCombiningMark('ข')).toBe(false);
    expect(isThaiCombiningMark('a')).toBe(false);
  });

  it('finds virtual keys and shift requirements on Kedmanee layout', () => {
    const layout = keyboardLayoutsData.kedmanee;

    // Normal key: 'ฟ' on KeyA, no shift
    const keyA = findKeyForChar('ฟ', layout);
    expect(keyA).not.toBeNull();
    expect(keyA?.key.code).toBe('KeyA');
    expect(keyA?.needShift).toBe(false);

    // Shift key: 'ฤ' on KeyA with shift
    const keyShiftA = findKeyForChar('ฤ', layout);
    expect(keyShiftA).not.toBeNull();
    expect(keyShiftA?.key.code).toBe('KeyA');
    expect(keyShiftA?.needShift).toBe(true);

    // Space key
    const spaceKey = findKeyForChar(' ', layout);
    expect(spaceKey).not.toBeNull();
    expect(spaceKey?.key.code).toBe('Space');
    expect(spaceKey?.needShift).toBe(false);
  });

  it('finds virtual keys and shift requirements on Pattachote layout', () => {
    const layout = keyboardLayoutsData.pattachote;

    // Normal key: 'ก' on KeyF
    const keyF = findKeyForChar('ก', layout);
    expect(keyF).not.toBeNull();
    expect(keyF?.key.code).toBe('KeyF');
    expect(keyF?.needShift).toBe(false);

    // Shift key: '์' on KeyF with shift
    const keyShiftF = findKeyForChar('์', layout);
    expect(keyShiftF).not.toBeNull();
    expect(keyShiftF?.key.code).toBe('KeyF');
    expect(keyShiftF?.needShift).toBe(true);
  });
});
