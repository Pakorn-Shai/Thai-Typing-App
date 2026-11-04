export type Language = 'th' | 'en';

export type PracticeMode = 'lesson' | 'timed' | 'words' | 'custom';

export type SoundProfile = 'clicky' | 'thock' | 'bubble' | 'off';

export type LessonLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | number;

export type TimedDuration = 60 | 180 | 300; // 1 min, 3 min, 5 min

export interface LessonProgress {
  stars: number; // 0..3
  bestCpm: number;
  bestAccuracy: number;
  completedCount: number;
}

export interface Lesson {
  id: string;
  level: LessonLevel | number;
  title: string;
  titleEn: string;
  description: string;
  targetKeys: string[];
  exercises: string[];
}

export type CharState = 'pending' | 'correct' | 'incorrect';
export type CharStatus = CharState;

export interface CharDetail {
  char: string;
  status: CharState;
  typedChar?: string;
}

export interface SpeedSnapshot {
  second: number;
  cpm: number;
  wpm: number;
  mistakes: number;
}

export interface TypingMetrics {
  cpm: number;
  wpm: number;
  accuracy: number;
  elapsedTime: number; // in seconds
  elapsedSeconds: number;
  correctChars: number;
  incorrectChars: number;
  totalTyped: number;
  mistakesMap: Record<string, number>;
  timeRemaining?: number;
  timeline?: SpeedSnapshot[];
}

export type TypingStats = TypingMetrics;

export interface TypingState {
  currentIndex: number;
  currentChar: string;
  isStarted: boolean;
  isCompleted: boolean;
  charDetails: CharDetail[];
  metrics: TypingMetrics;
}

export interface WeakKeyStat {
  key: string;
  mistakes: number;
  totalPressed: number;
  errorRate: number;
}

export interface TypingHistoryRecord {
  id: string;
  date: string;
  timestamp: number;
  language: Language;
  mode: PracticeMode;
  levelId?: string;
  levelTitle: string;
  cpm: number;
  wpm: number;
  accuracy: number;
  durationSeconds: number;
  mistakeKeys: Record<string, number>;
}

export type FingerPosition =
  | 'left-pinky'
  | 'left-ring'
  | 'left-middle'
  | 'left-index'
  | 'thumb'
  | 'right-index'
  | 'right-middle'
  | 'right-ring'
  | 'right-pinky';

export type Finger = FingerPosition;

export interface KeyDefinition {
  code: string;
  normal: string;
  shift: string;
  finger: FingerPosition | string;
  width?: string;
  isHome?: boolean;
}

export interface KeyLayoutRow {
  keys: KeyDefinition[];
}

export interface KeyLayout {
  name: string;
  rows: KeyLayoutRow[];
}

export type KeyboardLayoutData = KeyLayout;
