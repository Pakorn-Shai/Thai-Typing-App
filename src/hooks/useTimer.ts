import { useState, useEffect, useRef, useCallback } from 'react';

interface UseTimerOptions {
  isCountdown?: boolean;
  initialSeconds?: number;
  onFinish?: () => void;
}

export function useTimer({
  isCountdown = false,
  initialSeconds = 60,
  onFinish,
}: UseTimerOptions = {}) {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds);
  const onFinishRef = useRef(onFinish);

  useEffect(() => {
    onFinishRef.current = onFinish;
  }, [onFinish]);

  useEffect(() => {
    setRemainingSeconds(initialSeconds);
    setElapsedSeconds(0);
    setIsRunning(false);
  }, [initialSeconds, isCountdown]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);

        if (isCountdown) {
          setRemainingSeconds((prev) => {
            if (prev <= 1) {
              clearInterval(interval!);
              setIsRunning(false);
              if (onFinishRef.current) {
                onFinishRef.current();
              }
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, isCountdown]);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setElapsedSeconds(0);
    setRemainingSeconds(initialSeconds);
  }, [initialSeconds]);

  return {
    isRunning,
    elapsedSeconds,
    remainingSeconds,
    start,
    pause,
    reset,
  };
}

