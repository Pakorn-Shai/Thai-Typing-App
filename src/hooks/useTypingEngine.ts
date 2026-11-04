import { useState, useEffect, useCallback, useMemo } from 'react';
import { CharDetail, TypingStats, SoundProfile } from '../types/typing';
import { splitIntoCharacters, normalizeThaiText } from '../utils/thaiTokenizer';
import { calculateCpm, calculateWpm, calculateAccuracy } from '../utils/metrics';
import { soundManager } from '../utils/sound';

interface UseTypingEngineProps {
  text: string;
  elapsedSeconds: number;
  timeRemaining?: number;
  onFinish?: () => void;
  soundEnabled?: boolean;
  soundProfile?: SoundProfile;
  strictMode?: boolean;
}

export function useTypingEngine({
  text,
  elapsedSeconds,
  timeRemaining,
  onFinish,
  soundEnabled = true,
  soundProfile = 'clicky',
  strictMode = false,
}: UseTypingEngineProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [totalTyped, setTotalTyped] = useState(0);
  const [mistakeKeys, setMistakeKeys] = useState<Record<string, number>>({});
  const [charDetails, setCharDetails] = useState<CharDetail[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  // Synchronize sound settings
  useEffect(() => {
    soundManager.setProfile(soundProfile);
  }, [soundProfile]);

  useEffect(() => {
    if (!soundEnabled) {
      soundManager.setEnabled(false);
    }
  }, [soundEnabled]);

  // Initialize or reset target characters
  useEffect(() => {
    const chars = splitIntoCharacters(text);
    const initialDetails: CharDetail[] = chars.map((char) => ({
      char,
      status: 'pending',
    }));
    setCharDetails(initialDetails);
    setCurrentIndex(0);
    setCorrectCount(0);
    setIncorrectCount(0);
    setTotalTyped(0);
    setMistakeKeys({});
    setIsCompleted(false);
    setIsStarted(false);
  }, [text]);

  // Current expected character
  const currentChar = useMemo(() => {
    if (currentIndex >= charDetails.length) return '';
    return charDetails[currentIndex]?.char || '';
  }, [charDetails, currentIndex]);

  // Handle character input
  const handleCharInput = useCallback(
    (inputChar: string) => {
      if (isCompleted || currentIndex >= charDetails.length) return;

      if (!isStarted) {
        setIsStarted(true);
      }

      const targetChar = charDetails[currentIndex].char;
      const isCorrect =
        normalizeThaiText(inputChar) === normalizeThaiText(targetChar);

      setTotalTyped((prev) => prev + 1);

      setCharDetails((prev) => {
        const next = [...prev];
        next[currentIndex] = {
          char: targetChar,
          status: isCorrect ? 'correct' : 'incorrect',
          typedChar: inputChar,
        };
        return next;
      });

      if (isCorrect) {
        setCorrectCount((prev) => prev + 1);
        soundManager.playClick();
      } else {
        setIncorrectCount((prev) => prev + 1);
        setMistakeKeys((prev) => ({
          ...prev,
          [targetChar]: (prev[targetChar] || 0) + 1,
        }));
        soundManager.playError();

        if (strictMode) {
          setIsCompleted(true);
          if (onFinish) {
            onFinish();
          }
          return;
        }
      }

      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);

      if (nextIndex >= charDetails.length) {
        setIsCompleted(true);
        soundManager.playComplete();
        if (onFinish) {
          onFinish();
        }
      }
    },
    [charDetails, currentIndex, isCompleted, isStarted, onFinish]
  );

  // Handle Backspace
  const handleBackspace = useCallback(() => {
    if (isCompleted || currentIndex === 0) return;

    const prevIndex = currentIndex - 1;
    const prevCharDetail = charDetails[prevIndex];

    if (prevCharDetail.status === 'correct') {
      setCorrectCount((prev) => Math.max(0, prev - 1));
    } else if (prevCharDetail.status === 'incorrect') {
      setIncorrectCount((prev) => Math.max(0, prev - 1));
    }

    setCharDetails((prev) => {
      const next = [...prev];
      next[prevIndex] = {
        char: next[prevIndex].char,
        status: 'pending',
      };
      return next;
    });

    setCurrentIndex(prevIndex);
  }, [charDetails, currentIndex, isCompleted]);

  // Realtime stats / metrics
  const stats: TypingStats = useMemo(() => {
    const cpm = calculateCpm(correctCount, elapsedSeconds);
    const wpm = calculateWpm(cpm);
    const accuracy = calculateAccuracy(correctCount, totalTyped);

    return {
      cpm,
      wpm,
      accuracy,
      correctChars: correctCount,
      incorrectChars: incorrectCount,
      totalTyped,
      elapsedTime: elapsedSeconds,
      elapsedSeconds,
      mistakesMap: mistakeKeys,
      timeRemaining,
    };
  }, [correctCount, incorrectCount, totalTyped, elapsedSeconds, mistakeKeys, timeRemaining]);

  const resetEngine = useCallback(() => {
    const chars = splitIntoCharacters(text);
    setCharDetails(chars.map((c) => ({ char: c, status: 'pending' })));
    setCurrentIndex(0);
    setCorrectCount(0);
    setIncorrectCount(0);
    setTotalTyped(0);
    setMistakeKeys({});
    setIsCompleted(false);
    setIsStarted(false);
  }, [text]);

  return {
    charDetails,
    currentIndex,
    currentChar,
    stats,
    metrics: stats,
    mistakeKeys,
    isCompleted,
    isStarted,
    handleCharInput,
    handleBackspace,
    resetEngine,
    setIsCompleted,
  };
}
