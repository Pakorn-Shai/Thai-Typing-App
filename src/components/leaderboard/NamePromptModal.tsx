import React, { useState, useEffect, useRef } from 'react';
import { Trophy, X, AlertCircle, CheckCircle2, Zap, Target, Clock, User } from 'lucide-react';
import { TypingMetrics, Language } from '../../types/typing';
import { validatePlayerName } from '../../utils/profanityFilter';

interface NamePromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  stats: TypingMetrics;
  durationSeconds: number;
  language: Language;
  initialName?: string;
}

export const NamePromptModal: React.FC<NamePromptModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  stats,
  durationSeconds,
  language,
  initialName = '',
}) => {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync initial name when modal opens
  useEffect(() => {
    if (isOpen) {
      setName(initialName);
      setError(null);
      // Autofocus input after animation frame
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
    }
  }, [isOpen, initialName]);

  if (!isOpen) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const validation = validatePlayerName(name, language);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid name');
      inputRef.current?.focus();
      return;
    }

    onSubmit(name.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const formattedDuration =
    durationSeconds >= 60
      ? `${Math.floor(durationSeconds / 60)} ${language === 'th' ? 'นาที' : 'min'}`
      : `${durationSeconds}s`;

  return (
    <div
      onKeyDown={handleKeyDown}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 flex flex-col gap-5 animate-pop transition-colors">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon & Title */}
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-lg shadow-amber-500/25">
            <Trophy className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              {language === 'th' ? 'บันทึกสถิติลง Top 10' : 'Save to Top 10 Leaderboard'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'th'
                ? 'โหมดจับเวลา (Timed Test) บันทึกลงกระดานผู้นำ'
                : 'Timed test completed! Enter your name for the leaderboard'}
            </p>
          </div>
        </div>

        {/* Mini Scorecard Banner */}
        <div className="grid grid-cols-3 gap-2.5 p-3.5 bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 rounded-2xl text-center">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
              <Zap className="w-3.5 h-3.5 text-sky-500" />
              <span>{language === 'th' ? 'ความเร็ว' : 'Speed'}</span>
            </div>
            <span className="text-base sm:text-lg font-bold text-sky-600 dark:text-sky-400">
              {stats.wpm}{' '}
              <span className="text-[10px] text-slate-400 font-normal">WPM</span>
            </span>
          </div>

          <div className="flex flex-col items-center border-x border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
              <Target className="w-3.5 h-3.5 text-emerald-500" />
              <span>{language === 'th' ? 'ความแม่นยำ' : 'Accuracy'}</span>
            </div>
            <span className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400">
              {stats.accuracy}%
            </span>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>{language === 'th' ? 'เวลา' : 'Time'}</span>
            </div>
            <span className="text-base sm:text-lg font-bold text-slate-700 dark:text-slate-200">
              {formattedDuration}
            </span>
          </div>
        </div>

        {/* Name Input Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-sky-500" />
              {language === 'th' ? 'ชื่อหรือนามแฝงของคุณ:' : 'Your Player Name / Handle:'}
            </span>
            <span
              className={`text-[10px] font-normal ${
                name.length > 24 ? 'text-rose-500 font-semibold' : 'text-slate-400'
              }`}
            >
              {name.length}/24
            </span>
          </label>

          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError(null);
              }}
              maxLength={30}
              placeholder={
                language === 'th'
                  ? 'พิมพ์ชื่อที่ต้องการแสดง (เช่น สมชาย สายฟ้า)'
                  : 'Enter handle (e.g. SwiftTyper)'
              }
              className={`w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border text-sm font-medium transition-all outline-hidden text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 ${
                error
                  ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                  : 'border-slate-200 dark:border-slate-800 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20'
              }`}
            />
          </div>

          {/* Validation Error Banner */}
          {error && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed">
            {language === 'th'
              ? '💡 ใส่ชื่ออะไรก็ได้ตามชอบ ยกเว้นคำหยาบคาย สถิติจะถูกจัดอันดับบนกระดาน Top 10'
              : '💡 Any appropriate name is welcome. Vulgarities are blocked.'}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {language === 'th' ? 'ข้าม (ไม่บันทึก)' : 'Skip'}
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-md shadow-amber-500/25 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{language === 'th' ? 'บันทึกสถิติ' : 'Save to Leaderboard'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
