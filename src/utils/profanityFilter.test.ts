import { describe, it, expect } from 'vitest';
import { containsProfanity, validatePlayerName } from './profanityFilter';

describe('profanityFilter', () => {
  it('allows clean Thai and English names', () => {
    expect(containsProfanity('Somchai')).toBe(false);
    expect(containsProfanity('สมชาย สายพิมพ์')).toBe(false);
    expect(containsProfanity('FastTyper99')).toBe(false);
    expect(containsProfanity('น้องฟ้า')).toBe(false);

    expect(validatePlayerName('Somchai', 'th').isValid).toBe(true);
    expect(validatePlayerName('สมชาย', 'th').isValid).toBe(true);
  });

  it('detects English profanity including leetspeak and spacing', () => {
    expect(containsProfanity('bad fuck word')).toBe(true);
    expect(containsProfanity('f_u_c_k')).toBe(true);
    expect(containsProfanity('b!tch')).toBe(true);
    expect(containsProfanity('sh1t')).toBe(true);
    expect(containsProfanity('asshole')).toBe(true);

    const validation = validatePlayerName('FuckMaster', 'en');
    expect(validation.isValid).toBe(false);
    expect(validation.error).toContain('inappropriate');
  });

  it('detects Thai profanity including spacing and repetitions', () => {
    expect(containsProfanity('ไอ้เหี้ย')).toBe(true);
    expect(containsProfanity('ควย')).toBe(true);
    expect(containsProfanity('ค ว ย')).toBe(true);
    expect(containsProfanity('เย็ดดด')).toBe(true);
    expect(containsProfanity('สัส')).toBe(true);
    expect(containsProfanity('ดอกทอง')).toBe(true);

    const validation = validatePlayerName('คนควย', 'th');
    expect(validation.isValid).toBe(false);
    expect(validation.error).toContain('ไม่สุภาพ');
  });

  it('enforces length constraints', () => {
    expect(validatePlayerName('', 'th').isValid).toBe(false);
    expect(validatePlayerName('a', 'th').isValid).toBe(false);
    expect(validatePlayerName('ValidName', 'th').isValid).toBe(true);
    expect(validatePlayerName('A'.repeat(25), 'th').isValid).toBe(false);
  });
});

