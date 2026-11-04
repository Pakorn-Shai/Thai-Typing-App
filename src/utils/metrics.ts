/**
 * Thai Typing Lab - Metrics Calculation
 * CPM = (Correct Characters * 60) / Time (seconds)
 * Normalized WPM = CPM / 5
 * Accuracy = (Correct Characters / Total Typed) * 100
 */

export function calculateCpm(correctChars: number, elapsedSeconds: number): number {
  if (elapsedSeconds <= 0 || correctChars <= 0) return 0;
  return Math.round((correctChars * 60) / elapsedSeconds);
}

export function calculateWpm(cpm: number): number {
  return Math.round(cpm / 5);
}

export function calculateAccuracy(correctChars: number, totalTyped: number): number {
  if (totalTyped <= 0) return 100;
  const acc = (correctChars / totalTyped) * 100;
  return Math.max(0, Math.min(100, Math.round(acc * 10) / 10));
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

