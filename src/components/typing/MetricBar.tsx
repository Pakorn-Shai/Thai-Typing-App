import React from 'react';
import { Gauge, Zap, Target, Clock } from 'lucide-react';
import { TypingStats, Language } from '../../types/typing';
import { formatTime } from '../../utils/metrics';

interface MetricBarProps {
  stats: TypingStats;
  language: Language;
  isTimedMode?: boolean;
  progressPercent: number;
}

export const MetricBar: React.FC<MetricBarProps> = ({
  stats,
  language,
  isTimedMode = false,
  progressPercent,
}) => {
  return (
    <div className="w-full flex flex-col gap-2">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* CPM */}
        <div className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex items-center justify-between shadow-sm transition-colors">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-sky-600 dark:text-sky-400 font-medium mb-1">
              <Zap className="w-3.5 h-3.5" />
              <span>CPM</span>
            </div>
            <div className="text-2xl font-bold font-mono tracking-tight text-slate-900 dark:text-white">
              {stats.cpm}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">
              {language === 'th' ? 'อักขระ/นาที' : 'Chars / Min'}
            </div>
          </div>
          <div className="text-sky-500/15 dark:text-sky-500/10 text-3xl font-black select-none">
            ⚡
          </div>
        </div>

        {/* WPM */}
        <div className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex items-center justify-between shadow-sm transition-colors">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-medium mb-1">
              <Gauge className="w-3.5 h-3.5" />
              <span>WPM</span>
            </div>
            <div className="text-2xl font-bold font-mono tracking-tight text-slate-900 dark:text-white">
              {stats.wpm}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">
              {language === 'th' ? 'คำ/นาที (CPM/5)' : 'Words / Min'}
            </div>
          </div>
          <div className="text-indigo-500/15 dark:text-indigo-500/10 text-3xl font-black select-none">
            🚀
          </div>
        </div>

        {/* Accuracy */}
        <div className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex items-center justify-between shadow-sm transition-colors">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium mb-1">
              <Target className="w-3.5 h-3.5" />
              <span>{language === 'th' ? 'ความแม่นยำ' : 'Accuracy'}</span>
            </div>
            <div className="text-2xl font-bold font-mono tracking-tight text-slate-900 dark:text-white">
              {stats.accuracy}%
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">
              {stats.correctChars} / {stats.totalTyped}{' '}
              {language === 'th' ? 'เคาะ' : 'keys'}
            </div>
          </div>
          <div className="text-emerald-500/15 dark:text-emerald-500/10 text-3xl font-black select-none">
            🎯
          </div>
        </div>

        {/* Timer */}
        <div className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex items-center justify-between shadow-sm transition-colors">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{isTimedMode ? (language === 'th' ? 'เวลาที่เหลือ' : 'Time Left') : (language === 'th' ? 'เวลาที่ใช้' : 'Elapsed')}</span>
            </div>
            <div className="text-2xl font-bold font-mono tracking-tight text-amber-600 dark:text-amber-400">
              {formatTime(
                isTimedMode && stats.timeRemaining !== undefined
                  ? stats.timeRemaining
                  : stats.elapsedSeconds ?? stats.elapsedTime ?? 0
              )}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">
              {isTimedMode ? (language === 'th' ? 'นับถอยหลัง' : 'Countdown') : (language === 'th' ? 'นับเดินหน้า' : 'Stopwatch')}
            </div>
          </div>
          <div className="text-amber-500/15 dark:text-amber-500/10 text-3xl font-black select-none">
            ⏱
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 dark:bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800/80 transition-colors">
        <div
          className="bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-400 h-full transition-all duration-200"
          style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
        />
      </div>
    </div>
  );
};
