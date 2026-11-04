import React from 'react';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';
import { Language, KeyboardLayoutData } from '../../types/typing';
import { findKeyForChar } from '../../utils/thaiTokenizer';

interface WeakKeyAnalysisProps {
  mistakeKeys: Record<string, number>;
  language: Language;
  layoutData: KeyboardLayoutData;
  onClearHistory?: () => void;
}

const fingerNameMap: Record<string, string> = {
  'left-pinky': 'นิ้วก้อยซ้าย',
  'left-ring': 'นิ้วนางซ้าย',
  'left-middle': 'นิ้วกลางซ้าย',
  'left-index': 'นิ้วชี้ซ้าย',
  'thumb': 'นิ้วโป้ง',
  'right-index': 'นิ้วชี้ขวา',
  'right-middle': 'นิ้วกลางขวา',
  'right-ring': 'นิ้วนางขวา',
  'right-pinky': 'นิ้วก้อยขวา',
};

export const WeakKeyAnalysis: React.FC<WeakKeyAnalysisProps> = ({
  mistakeKeys,
  language,
  layoutData,
}) => {
  const sortedMistakes = Object.entries(mistakeKeys)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8); // Top 8 weak keys

  const maxMistakes = sortedMistakes[0]?.[1] || 1;

  if (sortedMistakes.length === 0) {
    return (
      <div className="w-full bg-slate-900/40 rounded-2xl p-4 border border-slate-800/80 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
          <CheckCircle className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-200">
            {language === 'th' ? 'ไม่มีแป้นพิมพ์ผิด' : 'Zero Typing Errors'}
          </h4>
          <p className="text-xs text-slate-400">
            {language === 'th'
              ? 'คุณพิมพ์ได้ถูกต้องแม่นยำ 100% ในรอบนี้!'
              : 'Flawless execution! You typed with 100% accuracy.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-900/50 rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-sm flex flex-col gap-3">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400" />
          <h4 className="text-sm font-semibold text-slate-200">
            {language === 'th'
              ? 'วิเคราะห์แป้นที่พิมพ์ผิดบ่อย (Weak Keys)'
              : 'Weak Keys Heatmap & Analysis'}
          </h4>
        </div>
        <span className="text-[11px] text-slate-400">
          {language === 'th' ? 'จุดที่ควรฝึกซ้ำ' : 'Recommended focus areas'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 pt-1">
        {sortedMistakes.map(([char, count]) => {
          const keyInfo = findKeyForChar(char, layoutData);
          const finger = keyInfo?.key.finger;
          const fingerLabel = finger ? fingerNameMap[finger] : '';
          const ratio = Math.round((count / maxMistakes) * 100);

          return (
            <div
              key={char}
              className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex flex-col gap-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-base font-bold font-sans text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  {char === ' ' ? 'Space' : char}
                </span>
                <span className="text-xs font-semibold text-rose-400">
                  {count} {language === 'th' ? 'ครั้ง' : 'times'}
                </span>
              </div>

              {/* Intensity bar */}
              <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-500 to-rose-500 h-full rounded-full"
                  style={{ width: `${ratio}%` }}
                />
              </div>

              {fingerLabel && (
                <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                  <Info className="w-2.5 h-2.5 text-sky-400" />
                  <span>{fingerLabel}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

