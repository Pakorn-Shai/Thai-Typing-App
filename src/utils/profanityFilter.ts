import { Language } from '../types/typing';

/**
 * List of vulgar / profane words in Thai.
 */
const THAI_PROFANITY: string[] = [
  'ควย',
  'เย็ด',
  'เหี้ย',
  'สัส',
  'สัด',
  'มึง',
  'กู',
  'ห่า',
  'ดอกทอง',
  'จิ๋ม',
  'แตด',
  'หำ',
  'เงี่ยน',
  'ระยำ',
  'ชาติหมา',
  'ส้นตีน',
  'ปี้',
  'เยด',
  'เหยด',
  'ชิบหาย',
  'ฉิบหาย',
  'สันดาน',
  'กระหรี่',
  'กะหรี่',
  'หี',
  'อีดอก',
  'ไอ้สัตว์',
  'ไอ้สัส',
  'อีสัส',
  'ไอ้เหี้ย',
  'อีเหี้ย',
  'หมาบ้า',
  'แม่มึง',
  'พ่อมึง',
];

/**
 * List of vulgar / profane words in English.
 */
const ENGLISH_PROFANITY: string[] = [
  'fuck',
  'shit',
  'bitch',
  'cunt',
  'dick',
  'asshole',
  'bastard',
  'pussy',
  'slut',
  'whore',
  'cock',
  'fag',
  'faggot',
  'nigger',
  'nigga',
  'tits',
  'boobs',
  'penis',
  'vagina',
  'anal',
  'porn',
];

/**
 * Normalizes text for profanity checking by removing symbols and de-obfuscating leetspeak.
 */
export function normalizeForProfanityCheck(text: string): string {
  if (!text) return '';

  let normalized = text.toLowerCase();

  // Common leetspeak replacements for English
  normalized = normalized
    .replace(/@/g, 'a')
    .replace(/\$/g, 's')
    .replace(/0/g, 'o')
    .replace(/1/g, 'i')
    .replace(/!/g, 'i')
    .replace(/3/g, 'e')
    .replace(/5/g, 's')
    .replace(/7/g, 't');

  // Collapse repeated identical characters (e.g. fuuuuck -> fuck, ควยยยย -> ควย)
  normalized = normalized.replace(/(.)\1{2,}/g, '$1$1');

  return normalized;
}

/**
 * Checks if the given text contains Thai or English profanity.
 */
export function containsProfanity(rawText: string): boolean {
  if (!rawText || rawText.trim().length === 0) return false;

  const normalized = normalizeForProfanityCheck(rawText);
  // Also create a compact version without any whitespace or punctuation
  const compact = normalized.replace(/[\s\-_.,/\\*#@+=~`^&%$!?:;'"(){}\[\]]/g, '');

  // Check English profanity
  for (const badWord of ENGLISH_PROFANITY) {
    const wordPattern = new RegExp(`\\b${badWord}\\b`, 'i');
    if (wordPattern.test(normalized) || compact.includes(badWord)) {
      return true;
    }
  }

  // Check Thai profanity
  for (const badWord of THAI_PROFANITY) {
    if (normalized.includes(badWord) || compact.includes(badWord)) {
      return true;
    }
  }

  return false;
}

/**
 * Validates a player name for leaderboard submission.
 */
export function validatePlayerName(
  name: string,
  language: Language = 'th'
): { isValid: boolean; error?: string } {
  const trimmed = name.trim();

  if (trimmed.length === 0) {
    return {
      isValid: false,
      error: language === 'th' ? 'กรุณากรอกชื่อของคุณ' : 'Please enter your name',
    };
  }

  if (trimmed.length < 2) {
    return {
      isValid: false,
      error:
        language === 'th'
          ? 'ชื่อต้องมีความยาวอย่างน้อย 2 ตัวอักษร'
          : 'Name must be at least 2 characters',
    };
  }

  if (trimmed.length > 24) {
    return {
      isValid: false,
      error:
        language === 'th'
          ? 'ชื่อต้องมีความยาวไม่เกิน 24 ตัวอักษร'
          : 'Name must not exceed 24 characters',
    };
  }

  if (containsProfanity(trimmed)) {
    return {
      isValid: false,
      error:
        language === 'th'
          ? 'ชื่อมีคำที่ไม่สุภาพ กรุณาใช้ชื่ออื่นที่เหมาะสม'
          : 'Name contains inappropriate language. Please choose another name.',
    };
  }

  return { isValid: true };
}
