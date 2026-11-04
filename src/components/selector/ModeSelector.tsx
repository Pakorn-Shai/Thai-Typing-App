import React, { useState } from 'react';
import {
  BookOpen,
  Timer,
  FileText,
  Keyboard as KeyboardIcon,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  PenTool,
  Star,
  Play,
  Skull,
  Ghost,
} from 'lucide-react';
import {
  Language,
  PracticeMode,
  TimedDuration,
  Lesson,
  LessonProgress,
} from '../../types/typing';

interface ModeSelectorProps {
  language: Language;
  mode: PracticeMode;
  onModeChange: (mode: PracticeMode) => void;
  lessons: Lesson[];
  currentLessonId: string;
  onSelectLesson: (id: string) => void;
  currentExerciseIndex: number;
  totalExercises: number;
  onExerciseChange: (index: number) => void;
  timedDuration: TimedDuration;
  onTimedDurationChange: (duration: TimedDuration) => void;
  showKeyboard: boolean;
  onToggleKeyboard: () => void;
  activeLayoutName: string;
  lessonProgress?: Record<string, LessonProgress>;
  onApplyCustomText?: (text: string) => void;
  thaiLayout?: 'kedmanee' | 'pattachote';
  onThaiLayoutChange?: (layout: 'kedmanee' | 'pattachote') => void;
  strictMode?: boolean;
  onToggleStrictMode?: () => void;
  blindMode?: boolean;
  onToggleBlindMode?: () => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  language,
  mode,
  onModeChange,
  lessons,
  currentLessonId,
  onSelectLesson,
  currentExerciseIndex,
  totalExercises,
  onExerciseChange,
  timedDuration,
  onTimedDurationChange,
  showKeyboard,
  onToggleKeyboard,
  activeLayoutName,
  lessonProgress = {},
  onApplyCustomText,
  thaiLayout = 'kedmanee',
  onThaiLayoutChange,
  strictMode = false,
  onToggleStrictMode,
  blindMode = false,
  onToggleBlindMode,
}) => {
  const currentLesson = lessons.find((l) => l.id === currentLessonId) || lessons[0];
  const [customInput, setCustomInput] = useState('');

  const handleStartCustom = () => {
    if (customInput.trim().length > 0 && onApplyCustomText) {
      onApplyCustomText(customInput.trim());
    }
  };

  return (
    <div className="w-full bg-slate-900/40 rounded-2xl p-4 border border-slate-800/80 shadow-sm flex flex-col gap-4">
      {/* Top Bar: Modes & Modifiers */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/60 pb-3">
        {/* Main Mode Tabs */}
        <div className="flex items-center flex-wrap gap-1.5 bg-slate-950/70 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => onModeChange('lesson')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              mode === 'lesson'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{language === 'th' ? 'บทเรียนตามลำดับ' : 'Lessons'}</span>
          </button>

          <button
            onClick={() => onModeChange('timed')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              mode === 'timed'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Timer className="w-3.5 h-3.5" />
            <span>{language === 'th' ? 'ทดสอบจับเวลา' : 'Timed Test'}</span>
          </button>

          <button
            onClick={() => onModeChange('words')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              mode === 'words'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{language === 'th' ? 'คลังคำศัพท์' : 'Common Words'}</span>
          </button>

          <button
            onClick={() => onModeChange('custom')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              mode === 'custom'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>{language === 'th' ? 'กำหนดข้อความเอง' : 'Custom Text'}</span>
          </button>
        </div>

        {/* Right side controls: Keyboard Layout switcher, Modifiers & Show/Hide */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Thai Layout Toggle (Kedmanee vs Pattachote) */}
          {language === 'th' && onThaiLayoutChange && (
            <button
              onClick={() =>
                onThaiLayoutChange(thaiLayout === 'kedmanee' ? 'pattachote' : 'kedmanee')
              }
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-[11px] text-sky-300 font-medium transition-all"
              title="สลับผังแป้นพิมพ์ภาษาไทย (เกษมณี / ปัตตะโชติ)"
            >
              <KeyboardIcon className="w-3 h-3 text-sky-400" />
              <span>{thaiLayout === 'kedmanee' ? 'เกษมณี' : 'ปัตตะโชติ'}</span>
            </button>
          )}

          {language === 'en' && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/60 border border-slate-700/60 text-[11px] text-slate-300">
              <KeyboardIcon className="w-3 h-3 text-sky-400" />
              <span>{activeLayoutName}</span>
            </div>
          )}

          {/* Strict Mode Toggle */}
          {onToggleStrictMode && (
            <button
              onClick={onToggleStrictMode}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-all ${
                strictMode
                  ? 'bg-rose-500/20 border-rose-500/60 text-rose-300 font-semibold'
                  : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
              title={
                language === 'th'
                  ? 'โหมดเข้มงวด: พิมพ์ผิดครั้งเดียวจบทันที (Sudden Death)'
                  : 'Strict Mode: Fail instantly on single mistake'
              }
            >
              <Skull className="w-3 h-3" />
              <span className="hidden sm:inline">{language === 'th' ? 'ห้ามกดผิด' : 'Strict'}</span>
            </button>
          )}

          {/* Blind Mode Toggle */}
          {onToggleBlindMode && (
            <button
              onClick={onToggleBlindMode}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-all ${
                blindMode
                  ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 font-semibold'
                  : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
              title={
                language === 'th'
                  ? 'โหมดซ่อนตัวอักษร: ฝึกพิมพ์สัมผัสแท้จริง'
                  : 'Blind Mode: Hide upcoming text'
              }
            >
              <Ghost className="w-3 h-3" />
              <span className="hidden sm:inline">{language === 'th' ? 'ซ่อนตัวอักษร' : 'Blind'}</span>
            </button>
          )}

          {/* Show/Hide Keyboard */}
          <button
            onClick={onToggleKeyboard}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-all ${
              showKeyboard
                ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
            title={showKeyboard ? 'ซ่อนคีย์บอร์ด' : 'แสดงคีย์บอร์ด'}
          >
            {showKeyboard ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">
              {showKeyboard
                ? language === 'th'
                  ? 'ซ่อนคีย์บอร์ด'
                  : 'Hide'
                : language === 'th'
                ? 'แสดงคีย์บอร์ด'
                : 'Show'}
            </span>
          </button>
        </div>
      </div>

      {/* Mode Specific Sub-Controls */}
      {mode === 'lesson' && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Level Badges */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {lessons.map((lesson) => {
              const isSelected = lesson.id === currentLesson?.id;
              const progress = lessonProgress[lesson.id];
              const stars = progress?.stars || 0;

              return (
                <button
                  key={lesson.id}
                  onClick={() => onSelectLesson(lesson.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-sky-500/15 border-sky-500/50 text-sky-300 font-semibold shadow-sm'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <span className="font-bold">Lv.{lesson.level}</span>
                  <span>
                    {language === 'th'
                      ? lesson.title.split(':')[1]?.trim() || lesson.title
                      : lesson.titleEn.split(':')[1]?.trim() || lesson.titleEn}
                  </span>
                  {stars > 0 && (
                    <span className="flex items-center text-amber-400 text-[10px]">
                      <Star className="w-2.5 h-2.5 fill-amber-400" />
                      {stars}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Exercise navigation within selected level */}
          {totalExercises > 1 && (
            <div className="flex items-center gap-1.5 self-end sm:self-auto bg-slate-950/80 px-2 py-1 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-400 font-medium mr-1">
                {language === 'th' ? 'แบบฝึกหัด' : 'Exercise'} {currentExerciseIndex + 1}/{totalExercises}
              </span>
              <button
                disabled={currentExerciseIndex === 0}
                onClick={() => onExerciseChange(currentExerciseIndex - 1)}
                className="p-1 rounded hover:bg-slate-800 text-slate-300 disabled:opacity-30 disabled:hover:bg-transparent"
                title={language === 'th' ? 'ก่อนหน้า' : 'Previous'}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                disabled={currentExerciseIndex >= totalExercises - 1}
                onClick={() => onExerciseChange(currentExerciseIndex + 1)}
                className="p-1 rounded hover:bg-slate-800 text-slate-300 disabled:opacity-30 disabled:hover:bg-transparent"
                title={language === 'th' ? 'ถัดไป' : 'Next'}
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {mode === 'timed' && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">
            {language === 'th' ? 'เลือกระยะเวลาทดสอบ:' : 'Select Test Duration:'}
          </span>
          <div className="flex items-center gap-1.5">
            {([60, 180, 300] as TimedDuration[]).map((dur) => (
              <button
                key={dur}
                onClick={() => onTimedDurationChange(dur)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all border ${
                  timedDuration === dur
                    ? 'bg-amber-500/20 border-amber-500/60 text-amber-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {dur === 60 ? '1 นาที (60s)' : dur === 180 ? '3 นาที (180s)' : '5 นาที (300s)'}
              </button>
            ))}
          </div>
        </div>
      )}

      {mode === 'words' && (
        <div className="text-xs text-slate-400 flex items-center justify-between">
          <span>
            {language === 'th'
              ? 'ฝึกพิมพ์คลังคำศัพท์ที่พบบ่อยในชีวิตประจำวันเพื่อความคล่องแคล่วและแม่นยำ'
              : 'Practice high-frequency words to build fluid typing speed'}
          </span>
        </div>
      )}

      {mode === 'custom' && (
        <div className="flex flex-col gap-2 pt-1">
          <span className="text-xs text-slate-400">
            {language === 'th'
              ? 'วางหรือพิมพ์ข้อความที่คุณต้องการฝึกซ้อมด้านล่างนี้:'
              : 'Paste or type custom practice text below:'}
          </span>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder={
                language === 'th'
                  ? 'พิมพ์หรือวางข้อความที่นี่...'
                  : 'Type or paste custom text here...'
              }
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500/60"
            />
            <button
              onClick={handleStartCustom}
              disabled={customInput.trim().length === 0}
              className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-40 text-white font-semibold text-xs shadow-md shadow-sky-500/20 transition-all"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{language === 'th' ? 'เริ่มพิมพ์' : 'Start'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
