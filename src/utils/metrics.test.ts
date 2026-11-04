import { describe, it, expect } from 'vitest';
import {
  calculateCpm,
  calculateWpm,
  calculateAccuracy,
  formatTime,
} from './metrics';

describe('Metrics Calculation Utility', () => {
  it('calculates CPM correctly according to (correctChars * 60) / elapsedSeconds', () => {
    // 120 characters in 60 seconds = 120 CPM
    expect(calculateCpm(120, 60)).toBe(120);

    // 150 characters in 30 seconds = 300 CPM
    expect(calculateCpm(150, 30)).toBe(300);

    // Edge case: 0 seconds or 0 characters
    expect(calculateCpm(0, 60)).toBe(0);
    expect(calculateCpm(100, 0)).toBe(0);
  });

  it('calculates Normalized WPM as CPM / 5', () => {
    expect(calculateWpm(100)).toBe(20);
    expect(calculateWpm(250)).toBe(50);
    expect(calculateWpm(0)).toBe(0);
  });

  it('calculates accuracy percentage accurately', () => {
    expect(calculateAccuracy(100, 100)).toBe(100);
    expect(calculateAccuracy(90, 100)).toBe(90);
    expect(calculateAccuracy(95, 100)).toBe(95);

    // Edge case: 0 total typed returns 100%
    expect(calculateAccuracy(0, 0)).toBe(100);
  });

  it('formats time to MM:SS string correctly', () => {
    expect(formatTime(0)).toBe('00:00');
    expect(formatTime(9)).toBe('00:09');
    expect(formatTime(60)).toBe('01:00');
    expect(formatTime(125)).toBe('02:05');
  });
});

