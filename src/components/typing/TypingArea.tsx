import React, { useRef, useEffect, useState } from 'react';
import { RotateCcw, MousePointerClick, Skull, Ghost } from 'lucide-react';
import { CharDetail, Language } from '../../types/typing';
import { isThaiCombiningMark } from '../../utils/thaiTokenizer';

interface TypingAreaProps {
  charDetails: CharDetail[];
  currentIndex: number;
  language: Language;
  onCharInput: (char: string) => void;
  onBackspace: () => void;
  onRestart: () => void;
  isCompleted: boolean;
  blindMode?: boolean;
  strictMode?: boolean;
}

export const TypingArea: React.FC<TypingAreaProps> = ({
  charDetails,
  currentIndex,
  language,
  onCharInput,
  onBackspace,
  onRestart,
  isCompleted,
  blindMode = false,
  strictMode = false,
}) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeCharRef = useRef<HTMLSpanElement>(null);
  const [isFocused, setIsFocused] = useState(true);

  // Auto-focus input on mount and whenever restarted
  useEffect(() => {
    inputRef.current?.focus();
  }, [charDetails]);

  // Scroll active char into view smoothly if long text
  useEffect(() => {
    if (activeCharRef.current && containerRef.current) {
      const activeEl = activeCharRef.current;
      const container = containerRef.current;
      const offsetTop = activeEl.offsetTop - container.offsetTop;

      if (offsetTop > container.clientHeight - 80) {
        container.scrollTo({
          top: offsetTop - 60,
          behavior: 'smooth',
        });
      } else if (offsetTop < container.scrollTop) {
        container.scrollTo({
          top: Math.max(0, offsetTop - 20),
          behavior: 'smooth',
        });
      }
    }
  }, [currentIndex]);

  const handleContainerClick = () => {
    inputRef.current?.focus();
    setIsFocused(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isCompleted) return;

    if (e.key === 'Backspace') {
      e.preventDefault();
      onBackspace();
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      onRestart();
      return;
    }

    // Ignore modifiers and control keys
    if (
      e.key === 'Shift' ||
      e.key === 'Control' ||
      e.key === 'Alt' ||
      e.key === 'Meta' ||
      e.key === 'CapsLock' ||
      e.key === 'Escape' ||
      e.key === 'ArrowLeft' ||
      e.key === 'ArrowRight' ||
      e.key === 'ArrowUp' ||
      e.key === 'ArrowDown'
    ) {
      return;
    }

    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      onCharInput(e.key);
    }
  };

  // Fallback for mobile / IME virtual keyboards
  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    if (isCompleted) return;
    const target = e.currentTarget;
    const val = target.value;
    if (val.length > 0) {
      const lastChar = val[val.length - 1];
      onCharInput(lastChar);
      target.value = '';
    }
  };

  return (
    <div
      onClick={handleContainerClick}
      className={`relative w-full rounded-2xl bg-white dark:bg-slate-900/90 border transition-all duration-200 cursor-text select-none shadow-xl ${
        isFocused
          ? 'border-sky-500/60 ring-2 ring-sky-500/20'
          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      {/* Hidden input to capture physical and virtual keystrokes */}
      <textarea
        ref={inputRef}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="absolute opacity-0 pointer-events-none w-0 h-0 p-0 m-0 border-0 overflow-hidden"
        tabIndex={0}
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
      />

      {/* Focus warning banner if blurred */}
      {!isFocused && !isCompleted && (
        <div className="absolute inset-0 bg-slate-900/40 dark:bg-slate-950/70 backdrop-blur-xs rounded-2xl flex items-center justify-center z-20 cursor-pointer">
          <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-sky-500/40 rounded-xl text-sky-600 dark:text-sky-300 text-sm font-medium shadow-lg animate-pulse">
            <MousePointerClick className="w-4 h-4" />
            <span>
              {language === 'th'
                ? 'คลิกที่นี่เพื่อเริ่มพิมพ์ต่อ'
                : 'Click here to focus and resume typing'}
            </span>
          </div>
        </div>
      )}

      {/* Header bar within typing area */}
      <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-medium text-slate-700 dark:text-slate-300">
            {language === 'th' ? 'พื้นที่ฝึกพิมพ์' : 'Practice Box'}
          </span>
          {strictMode && (
            <span className="flex items-center gap-1 text-[10px] bg-rose-500/10 dark:bg-rose-500/15 text-rose-600 dark:text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded-full font-semibold">
              <Skull className="w-3 h-3 text-rose-500" />
              Sudden Death
            </span>
          )}
          {blindMode && (
            <span className="flex items-center gap-1 text-[10px] bg-amber-500/10 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-semibold">
              <Ghost className="w-3 h-3 text-amber-500" />
              Blind Mode
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onRestart();
            inputRef.current?.focus();
          }}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 dark:hover:text-white transition-all text-[11px]"
          title={language === 'th' ? 'เริ่มใหม่ (Tab+Enter)' : 'Restart (Tab+Enter)'}
        >
          <RotateCcw className="w-3 h-3 text-sky-500 dark:text-sky-400" />
          <span>{language === 'th' ? 'เริ่มใหม่' : 'Restart'}</span>
        </button>
      </div>

      {/* Text Stream Display */}
      <div
        ref={containerRef}
        className="p-6 sm:p-8 max-h-64 sm:max-h-72 overflow-y-auto font-thai text-xl sm:text-2xl leading-relaxed tracking-wider"
      >
        <div className="flex flex-wrap items-baseline gap-y-2">
          {charDetails.map((item, index) => {
            const isCurrent = index === currentIndex;
            const isPending = item.status === 'pending';
            const isCorrect = item.status === 'correct';
            const isIncorrect = item.status === 'incorrect';

            let charClass = '';
            if (isCorrect) {
              charClass = 'text-emerald-600 dark:text-emerald-400 font-medium';
            } else if (isIncorrect) {
              charClass = 'text-rose-600 dark:text-rose-400 bg-rose-500/20 rounded px-0.5 underline decoration-rose-500';
            } else if (isCurrent) {
              charClass = 'text-sky-700 dark:text-sky-300 font-semibold bg-sky-500/15 dark:bg-sky-500/25 rounded px-0.5 custom-caret';
            } else if (isPending) {
              charClass = blindMode
                ? 'text-slate-300 dark:text-slate-600 blur-[5px] select-none opacity-30'
                : 'text-slate-400 dark:text-slate-500';
            }

            const isCombining = isThaiCombiningMark(item.char);

            // Display space character visually
            const displayChar =
              item.char === ' ' ? (isCurrent ? '␣' : '\u00A0') : item.char;

            return (
              <span
                key={index}
                ref={isCurrent ? activeCharRef : null}
                className={`inline-block transition-colors duration-100 ${
                  isCombining ? 'min-w-[0.9em] text-center' : ''
                } ${charClass}`}
              >
                {displayChar}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};
