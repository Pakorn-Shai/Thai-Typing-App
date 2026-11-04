import React from 'react';
import { BookOpen, Star, CheckCircle2 } from 'lucide-react';
import { Lesson, LessonProgress, Language } from '../../types/typing';

interface LevelSidebarProps {
  lessons: Lesson[];
  currentLessonId: string;
  onSelectLesson: (id: string) => void;
  currentExerciseIndex: number;
  onSelectExercise: (index: number) => void;
  lessonProgress: Record<string, LessonProgress>;
  language: Language;
}

export const LevelSidebar: React.FC<LevelSidebarProps> = ({
  lessons,
  currentLessonId,
  onSelectLesson,
  currentExerciseIndex,
  onSelectExercise,
  lessonProgress,
  language,
}) => {
  return (
    <aside className="w-full lg:w-72 shrink-0 bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex flex-col gap-3 transition-colors">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {language === 'th' ? 'บทเรียนตามลำดับ' : 'Lesson Levels'}
            </h3>
            <span className="text-[10px] text-slate-400 dark:text-slate-500">
              {language === 'th' ? 'เลือกแถวแป้นพิมพ์' : 'Select keyboard row'}
            </span>
          </div>
        </div>
      </div>

      {/* Levels Vertical List */}
      <div className="flex flex-col gap-2">
        {lessons.map((lesson) => {
          const isSelected = lesson.id === currentLessonId;
          const progress = lessonProgress[lesson.id];
          const stars = progress?.stars || 0;
          const isCompleted = (progress?.completedCount || 0) > 0;

          return (
            <div
              key={lesson.id}
              className={`rounded-xl transition-all border ${
                isSelected
                  ? 'bg-sky-50/70 dark:bg-sky-500/10 border-sky-500/50 shadow-xs'
                  : 'bg-slate-50/60 hover:bg-slate-100 dark:bg-slate-950/40 dark:hover:bg-slate-800/40 border-slate-200/80 dark:border-slate-800/80'
              }`}
            >
              {/* Level Header Button */}
              <button
                onClick={() => onSelectLesson(lesson.id)}
                className="w-full text-left p-2.5 flex items-start justify-between gap-2"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                        isSelected
                          ? 'bg-sky-500 text-white'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      Lv.{lesson.level}
                    </span>
                    <span
                      className={`text-xs font-semibold truncate ${
                        isSelected
                          ? 'text-sky-700 dark:text-sky-300 font-bold'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {language === 'th'
                        ? lesson.title.split(':')[1]?.trim() || lesson.title
                        : lesson.titleEn.split(':')[1]?.trim() || lesson.titleEn}
                    </span>
                  </div>

                  {/* Target keys preview */}
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    {lesson.targetKeys.slice(0, 8).join(' ')}
                    {lesson.targetKeys.length > 8 ? ' ...' : ''}
                  </div>
                </div>

                {/* Stars / Completion indicator */}
                <div className="flex flex-col items-end gap-1 shrink-0 pt-0.5">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3].map((star) => (
                      <Star
                        key={star}
                        className={`w-3 h-3 ${
                          star <= stars
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-300 dark:text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                  {isCompleted && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  )}
                </div>
              </button>

              {/* Sub-exercises list when this level is active */}
              {isSelected && lesson.exercises.length > 1 && (
                <div className="px-2.5 pb-2.5 pt-1 border-t border-sky-200/50 dark:border-slate-800/80 mt-1">
                  <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                    {language === 'th' ? 'เลือกแบบฝึกหัด:' : 'Exercises:'}
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-3 gap-1">
                    {lesson.exercises.map((_, idx) => {
                      const isCurrentEx = idx === currentExerciseIndex;
                      return (
                        <button
                          key={idx}
                          onClick={() => onSelectExercise(idx)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-semibold text-center transition-all ${
                            isCurrentEx
                              ? 'bg-sky-500 text-white shadow-xs'
                              : 'bg-white hover:bg-sky-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                          }`}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};
