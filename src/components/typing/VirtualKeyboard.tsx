import React, { useMemo } from 'react';
import { KeyboardLayoutData } from '../../types/typing';
import { findKeyForChar } from '../../utils/thaiTokenizer';

interface VirtualKeyboardProps {
  layoutData: KeyboardLayoutData;
  currentChar: string;
}

// Visual color themes per finger
const fingerColorMap: Record<string, string> = {
  'left-pinky': 'border-b-2 border-b-rose-400/60 dark:border-b-rose-400/40',
  'left-ring': 'border-b-2 border-b-amber-400/60 dark:border-b-amber-400/40',
  'left-middle': 'border-b-2 border-b-emerald-400/60 dark:border-b-emerald-400/40',
  'left-index': 'border-b-2 border-b-sky-400/60 dark:border-b-sky-400/40',
  'thumb': 'border-b-2 border-b-slate-400/60 dark:border-b-slate-400/40',
  'right-index': 'border-b-2 border-b-sky-400/60 dark:border-b-sky-400/40',
  'right-middle': 'border-b-2 border-b-emerald-400/60 dark:border-b-emerald-400/40',
  'right-ring': 'border-b-2 border-b-amber-400/60 dark:border-b-amber-400/40',
  'right-pinky': 'border-b-2 border-b-rose-400/60 dark:border-b-rose-400/40',
};

const fingerBadgeNames: Record<string, string> = {
  'left-pinky': 'ก้อยซ้าย',
  'left-ring': 'นางซ้าย',
  'left-middle': 'กลางซ้าย',
  'left-index': 'ชี้ซ้าย',
  'thumb': 'นิ้วโป้ง',
  'right-index': 'ชี้ขวา',
  'right-middle': 'กลางขวา',
  'right-ring': 'นางขวา',
  'right-pinky': 'ก้อยขวา',
};

const handsFingers = [
  { id: 'left-pinky', label: 'ก้อย', side: 'left' },
  { id: 'left-ring', label: 'นาง', side: 'left' },
  { id: 'left-middle', label: 'กลาง', side: 'left' },
  { id: 'left-index', label: 'ชี้', side: 'left' },
  { id: 'thumb', label: 'โป้ง (Space)', side: 'center' },
  { id: 'right-index', label: 'ชี้', side: 'right' },
  { id: 'right-middle', label: 'กลาง', side: 'right' },
  { id: 'right-ring', label: 'นาง', side: 'right' },
  { id: 'right-pinky', label: 'ก้อย', side: 'right' },
];

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  layoutData,
  currentChar,
}) => {
  const targetKeyInfo = useMemo(() => {
    return findKeyForChar(currentChar, layoutData);
  }, [currentChar, layoutData]);

  const activeKeyCode = targetKeyInfo?.key.code;
  const needShift = targetKeyInfo?.needShift || false;
  const targetFinger = targetKeyInfo?.key.finger;

  return (
    <div className="w-full bg-white dark:bg-slate-900/60 rounded-2xl p-3 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-md flex flex-col gap-4 transition-colors">
      {/* Finger guide hint bar */}
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800/80 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="font-medium text-slate-700 dark:text-slate-300">
            {layoutData.name}
          </span>
          {targetFinger && (
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-sky-500/10 dark:bg-sky-500/15 text-sky-600 dark:text-sky-300 border border-sky-500/30 font-medium animate-pulse">
              ใช้นิ้ว: {fingerBadgeNames[targetFinger]}
            </span>
          )}
        </div>

        {needShift && (
          <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 text-[11px] font-semibold animate-pulse">
            <span className="w-2 h-2 rounded-full bg-amber-500 dark:bg-amber-400"></span>
            <span>กดปุ่ม Shift ร่วมด้วย</span>
          </div>
        )}
      </div>

      {/* Keyboard Grid */}
      <div className="flex flex-col gap-1.5 select-none overflow-x-auto pb-1">
        {layoutData.rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1 sm:gap-1.5 justify-center">
            {row.keys.map((key) => {
              const isTargetKey = key.code === activeKeyCode;
              const isShiftKey =
                needShift &&
                (key.code === 'ShiftLeft' || key.code === 'ShiftRight');
              const isHighlighted = isTargetKey || isShiftKey;

              const customWidth = key.width || 'flex-1 min-w-[28px] sm:min-w-[42px] max-w-[56px]';
              const fingerBorder = fingerColorMap[key.finger] || '';

              return (
                <div
                  key={key.code}
                  className={`relative h-10 sm:h-12 rounded-lg flex flex-col items-center justify-center p-1 font-mono transition-all duration-150 ${customWidth} ${fingerBorder} ${
                    isHighlighted
                      ? 'bg-sky-500 text-white font-bold ring-2 ring-sky-300 shadow-lg shadow-sky-500/30 scale-105 z-10'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 dark:text-slate-200 dark:border-slate-700/60'
                  }`}
                >
                  {/* Shift label */}
                  {key.shift && key.shift !== key.normal && (
                    <span
                      className={`text-[9px] sm:text-[10px] leading-none absolute top-1 right-1.5 ${
                        isHighlighted && needShift
                          ? 'text-amber-200 font-bold'
                          : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {key.shift}
                    </span>
                  )}

                  {/* Normal label */}
                  <span
                    className={`text-xs sm:text-sm font-sans ${
                      isHighlighted && !needShift ? 'font-bold' : ''
                    }`}
                  >
                    {key.normal}
                  </span>

                  {/* Home row bump indicator */}
                  {key.isHome && (
                    <div className="w-2 h-0.5 bg-slate-400 dark:bg-slate-400/60 rounded-full mt-0.5" />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Interactive Hands & Fingers Visualizer */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
        <span className="text-[10px] text-slate-400 dark:text-slate-500 hidden sm:inline">
          แถบตำแหน่งนิ้วมือ (Hands & Fingers Guide):
        </span>

        <div className="flex items-center flex-wrap justify-center gap-1.5">
          {handsFingers.map((f) => {
            const isActive = targetFinger === f.id;
            return (
              <div
                key={f.id}
                className={`px-2 py-0.5 rounded-lg border transition-all text-[10px] font-medium ${
                  isActive
                    ? 'bg-sky-500 text-white border-sky-400 shadow-md shadow-sky-500/25 scale-105 font-bold'
                    : 'bg-slate-100 dark:bg-slate-950/70 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                }`}
              >
                {f.side === 'left' && <span className="opacity-60 mr-1">ซ้าย</span>}
                {f.side === 'right' && <span className="opacity-60 mr-1">ขวา</span>}
                <span>{f.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
