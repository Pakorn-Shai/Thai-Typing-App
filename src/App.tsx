import { useState, useMemo, useEffect, useCallback } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ModeSelector } from './components/selector/ModeSelector';
import { MetricBar } from './components/typing/MetricBar';
import { TypingArea } from './components/typing/TypingArea';
import { VirtualKeyboard } from './components/typing/VirtualKeyboard';
import { ResultCard } from './components/analytics/ResultCard';
import { WeakKeyAnalysis } from './components/analytics/WeakKeyAnalysis';
import { HistoryModal } from './components/analytics/HistoryModal';

import {
  Language,
  PracticeMode,
  TimedDuration,
  TypingHistoryRecord,
  SoundProfile,
  LessonProgress,
} from './types/typing';

import thaiLessonsData from './data/lessons/thai-lessons.json';
import engLessonsData from './data/lessons/eng-lessons.json';
import commonWordsTh from './data/common-words-th.json';
import keyboardLayoutsData from './data/keyboard-layouts.json';

import { useTimer } from './hooks/useTimer';
import { useTypingEngine } from './hooks/useTypingEngine';
import { useLocalStorage } from './hooks/useLocalStorage';
import { soundManager } from './utils/sound';

const englishCommonWords = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "i",
  "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
  "this", "but", "his", "by", "from", "they", "we", "say", "her", "she",
  "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
  "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
  "when", "make", "can", "like", "time", "no", "just", "him", "know", "take",
  "people", "into", "year", "your", "good", "some", "could", "them", "see", "other"
];

function generateRandomWords(wordsPool: string[], count: number = 30): string {
  const selected: string[] = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * wordsPool.length);
    selected.push(wordsPool[randomIndex]);
  }
  return selected.join(' ');
}

export function App() {
  const [language, setLanguage] = useLocalStorage<Language>('ttl_language', 'th');
  const [thaiLayout, setThaiLayout] = useLocalStorage<'kedmanee' | 'pattachote'>('ttl_thai_layout', 'kedmanee');
  const [mode, setMode] = useState<PracticeMode>('lesson');
  const [soundProfile, setSoundProfile] = useLocalStorage<SoundProfile>('ttl_sound_profile', 'clicky');
  const [soundVolume, setSoundVolume] = useLocalStorage<number>('ttl_sound_volume', 0.8);
  const [isDark, setIsDark] = useLocalStorage<boolean>('ttl_dark_theme', true);
  const [showKeyboard, setShowKeyboard] = useLocalStorage<boolean>('ttl_show_keyboard', true);
  const [timedDuration, setTimedDuration] = useState<TimedDuration>(60);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [customText, setCustomText] = useState<string>('');
  const [strictMode, setStrictMode] = useLocalStorage<boolean>('ttl_strict_mode', false);
  const [blindMode, setBlindMode] = useLocalStorage<boolean>('ttl_blind_mode', false);

  // Synchronize sound volume
  useEffect(() => {
    soundManager.setVolume(soundVolume);
  }, [soundVolume]);

  // Stored history & progress
  const [history, setHistory] = useLocalStorage<TypingHistoryRecord[]>('ttl_history', []);
  const [lessonProgress, setLessonProgress] = useLocalStorage<Record<string, LessonProgress>>('ttl_lesson_progress', {});

  // Lessons based on current language
  const lessons = useMemo(() => {
    return language === 'th' ? thaiLessonsData : engLessonsData;
  }, [language]);

  const [currentLessonId, setCurrentLessonId] = useState<string>(lessons[0].id);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number>(0);

  // Sync lesson ID when language changes
  useEffect(() => {
    setCurrentLessonId(lessons[0].id);
    setCurrentExerciseIndex(0);
  }, [lessons]);

  const activeLesson = useMemo(() => {
    return lessons.find((l) => l.id === currentLessonId) || lessons[0];
  }, [lessons, currentLessonId]);

  // Manage dark theme class on documentElement
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Generate target text based on active mode
  const [randomWordsText, setRandomWordsText] = useState<string>('');

  const refreshWordsText = useCallback(() => {
    const pool = language === 'th' ? commonWordsTh : englishCommonWords;
    const count = mode === 'timed' ? (timedDuration === 60 ? 60 : timedDuration === 180 ? 150 : 250) : 30;
    setRandomWordsText(generateRandomWords(pool, count));
  }, [language, mode, timedDuration]);

  useEffect(() => {
    if (mode === 'timed' || mode === 'words') {
      refreshWordsText();
    }
  }, [mode, language, timedDuration, refreshWordsText]);

  const targetText = useMemo(() => {
    if (mode === 'lesson') {
      const exercise = activeLesson.exercises[currentExerciseIndex] || activeLesson.exercises[0];
      return exercise || '';
    }
    if (mode === 'custom') {
      return customText || (language === 'th' ? 'พิมพ์ข้อความของคุณที่นี่...' : 'Type your custom text here...');
    }
    return randomWordsText;
  }, [mode, activeLesson, currentExerciseIndex, randomWordsText, customText, language]);

  // Timer setup
  const isCountdown = mode === 'timed';
  const {
    elapsedSeconds,
    remainingSeconds,
    start: startTimer,
    pause: pauseTimer,
    reset: resetTimer,
  } = useTimer({
    isCountdown,
    initialSeconds: timedDuration,
    onFinish: () => {
      handleCompleteTest();
    },
  });

  // Typing Engine
  const {
    charDetails,
    currentIndex,
    currentChar,
    stats,
    mistakeKeys,
    isCompleted,
    isStarted,
    handleCharInput,
    handleBackspace,
    resetEngine,
    setIsCompleted,
  } = useTypingEngine({
    text: targetText,
    elapsedSeconds,
    timeRemaining: isCountdown ? remainingSeconds : undefined,
    soundProfile,
    strictMode,
    onFinish: () => {
      pauseTimer();
      saveRecord();
    },
  });

  // Start timer on first keystroke
  useEffect(() => {
    if (isStarted && !isCompleted) {
      startTimer();
    }
  }, [isStarted, isCompleted, startTimer]);

  const saveRecord = useCallback(() => {
    const record: TypingHistoryRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      timestamp: Date.now(),
      language,
      mode,
      levelId: mode === 'lesson' ? activeLesson.id : undefined,
      levelTitle:
        mode === 'lesson'
          ? `${activeLesson.title} - Ex.${currentExerciseIndex + 1}`
          : mode === 'timed'
          ? `Timed ${timedDuration}s`
          : mode === 'custom'
          ? 'Custom Text Practice'
          : 'Common Words',
      cpm: stats.cpm,
      wpm: stats.wpm,
      accuracy: stats.accuracy,
      durationSeconds: elapsedSeconds,
      mistakeKeys,
    };

    setHistory((prev) => [record, ...(prev || []).slice(0, 99)]);

    // Update lesson progress & star rating if in lesson mode
    if (mode === 'lesson') {
      let stars = 1;
      if (stats.cpm >= 180 && stats.accuracy >= 95) {
        stars = 3;
      } else if (stats.cpm >= 120 && stats.accuracy >= 90) {
        stars = 2;
      }

      setLessonProgress((prev) => {
        const old = prev[activeLesson.id] || { stars: 0, bestCpm: 0, bestAccuracy: 0, completedCount: 0 };
        return {
          ...prev,
          [activeLesson.id]: {
            stars: Math.max(old.stars, stars),
            bestCpm: Math.max(old.bestCpm, stats.cpm),
            bestAccuracy: Math.max(old.bestAccuracy, stats.accuracy),
            completedCount: (old.completedCount || 0) + 1,
          },
        };
      });
    }
  }, [
    language,
    mode,
    activeLesson,
    currentExerciseIndex,
    timedDuration,
    stats,
    elapsedSeconds,
    mistakeKeys,
    setHistory,
    setLessonProgress,
  ]);

  const handleCompleteTest = useCallback(() => {
    setIsCompleted(true);
    pauseTimer();
    saveRecord();
  }, [setIsCompleted, pauseTimer, saveRecord]);

  const handleRestart = useCallback(() => {
    resetTimer();
    resetEngine();
    if (mode === 'timed' || mode === 'words') {
      refreshWordsText();
    }
  }, [resetTimer, resetEngine, mode, refreshWordsText]);

  const handleNextExercise = useCallback(() => {
    if (mode === 'lesson') {
      if (currentExerciseIndex < activeLesson.exercises.length - 1) {
        setCurrentExerciseIndex((prev) => prev + 1);
      } else {
        // Move to next level if available
        const currentLevelIdx = lessons.findIndex((l) => l.id === activeLesson.id);
        if (currentLevelIdx < lessons.length - 1) {
          setCurrentLessonId(lessons[currentLevelIdx + 1].id);
          setCurrentExerciseIndex(0);
        } else {
          setCurrentExerciseIndex(0);
        }
      }
    } else {
      refreshWordsText();
    }
    resetTimer();
    resetEngine();
  }, [mode, currentExerciseIndex, activeLesson, lessons, refreshWordsText, resetTimer, resetEngine]);

  const handleApplyCustomText = useCallback(
    (text: string) => {
      setCustomText(text);
      setMode('custom');
      resetTimer();
      resetEngine();
    },
    [resetTimer, resetEngine]
  );

  // Active keyboard layout (Kedmanee / Pattachote for Thai, QWERTY for English)
  const activeLayoutData =
    language === 'th'
      ? thaiLayout === 'pattachote'
        ? keyboardLayoutsData.pattachote
        : keyboardLayoutsData.kedmanee
      : keyboardLayoutsData.qwerty;

  const progressPercent = charDetails.length > 0 ? (currentIndex / charDetails.length) * 100 : 0;

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 selection:bg-sky-500/30 selection:text-sky-200">
      <Header
        language={language}
        onLanguageChange={(newLang) => {
          setLanguage(newLang);
          handleRestart();
        }}
        soundProfile={soundProfile}
        onSoundProfileChange={(p) => setSoundProfile(p)}
        soundVolume={soundVolume}
        onSoundVolumeChange={(vol) => setSoundVolume(vol)}
        isDark={isDark}
        onToggleTheme={() => setIsDark((prev) => !prev)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 sm:py-8 flex flex-col gap-6">
        {/* Mode Selector */}
        <ModeSelector
          language={language}
          mode={mode}
          onModeChange={(newMode) => {
            setMode(newMode);
            handleRestart();
          }}
          lessons={lessons}
          currentLessonId={currentLessonId}
          onSelectLesson={(id) => {
            setCurrentLessonId(id);
            setCurrentExerciseIndex(0);
            handleRestart();
          }}
          currentExerciseIndex={currentExerciseIndex}
          totalExercises={activeLesson.exercises.length}
          onExerciseChange={(idx) => {
            setCurrentExerciseIndex(idx);
            handleRestart();
          }}
          timedDuration={timedDuration}
          onTimedDurationChange={(dur) => {
            setTimedDuration(dur);
            handleRestart();
          }}
          showKeyboard={showKeyboard}
          onToggleKeyboard={() => setShowKeyboard((prev) => !prev)}
          activeLayoutName={activeLayoutData.name}
          lessonProgress={lessonProgress}
          onApplyCustomText={handleApplyCustomText}
          thaiLayout={thaiLayout}
          onThaiLayoutChange={(layout) => setThaiLayout(layout)}
          strictMode={strictMode}
          onToggleStrictMode={() => {
            setStrictMode((prev) => !prev);
            handleRestart();
          }}
          blindMode={blindMode}
          onToggleBlindMode={() => setBlindMode((prev) => !prev)}
        />

        {/* Real-time Metric Bar */}
        <MetricBar
          stats={stats}
          language={language}
          isTimedMode={isCountdown}
          progressPercent={progressPercent}
        />

        {/* Main Typing Area or Result Card when completed */}
        {isCompleted ? (
          <div className="flex flex-col gap-6">
            <ResultCard
              stats={stats}
              language={language}
              title={
                mode === 'lesson'
                  ? `${activeLesson.title} (${language === 'th' ? 'แบบฝึกหัด' : 'Exercise'} ${currentExerciseIndex + 1})`
                  : mode === 'timed'
                  ? `Timed Test (${timedDuration}s)`
                  : mode === 'custom'
                  ? 'Custom Text'
                  : 'Common Words Practice'
              }
              onRestart={handleRestart}
              onNext={handleNextExercise}
              hasNext={mode === 'lesson' || mode === 'words'}
            />

            {/* Weak Key Analysis */}
            <WeakKeyAnalysis
              mistakeKeys={mistakeKeys}
              language={language}
              layoutData={activeLayoutData}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <TypingArea
              charDetails={charDetails}
              currentIndex={currentIndex}
              language={language}
              onCharInput={handleCharInput}
              onBackspace={handleBackspace}
              onRestart={handleRestart}
              isCompleted={isCompleted}
              blindMode={blindMode}
              strictMode={strictMode}
            />

            {/* Optional Virtual Keyboard with Hands Visualizer */}
            {showKeyboard && (
              <VirtualKeyboard
                layoutData={activeLayoutData}
                currentChar={currentChar}
              />
            )}

            {/* Weak Key Live Preview if mistakes have been made */}
            {Object.keys(mistakeKeys).length > 0 && (
              <WeakKeyAnalysis
                mistakeKeys={mistakeKeys}
                language={language}
                layoutData={activeLayoutData}
              />
            )}
          </div>
        )}
      </main>

      {/* History & Analytics Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onClearHistory={() => setHistory([])}
        language={language}
      />

      <Footer language={language} />
    </div>
  );
}

export default App;
