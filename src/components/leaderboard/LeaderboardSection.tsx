import React, { useState, useMemo } from 'react';
import {
  Trophy,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { LeaderboardEntry, Language } from '../../types/typing';

interface LeaderboardSectionProps {
  entries: LeaderboardEntry[];
  language: Language;
  onClearLeaderboard?: () => void;
}

export const LeaderboardSection: React.FC<LeaderboardSectionProps> = ({
  entries,
  language,
  onClearLeaderboard,
}) => {
  const [selectedDuration, setSelectedDuration] = useState<number | 'all'>('all');
  const [isConfirmClear, setIsConfirmClear] = useState(false);

  // Filter and sort entries: Highest WPM first, then highest Accuracy, then most recent
  const top10 = useMemo(() => {
    let list = [...entries];

    if (selectedDuration !== 'all') {
      list = list.filter((item) => item.durationSeconds === selectedDuration);
    }

    list.sort((a, b) => {
      if (b.wpm !== a.wpm) return b.wpm - a.wpm;
      if (b.accuracy !== a.accuracy) return b.accuracy - a.accuracy;
      return b.timestamp - a.timestamp;
    });

    return list.slice(0, 10);
  }, [entries, selectedDuration]);

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(language === 'th' ? 'th-TH' : 'en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const formatDurationText = (sec: number) => {
    if (sec >= 60) {
      return `${Math.floor(sec / 60)} ${language === 'th' ? 'นาที' : 'min'}`;
    }
    return `${sec}s`;
  };

  return (
    <section className="w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-sm transition-colors flex flex-col gap-6">
      {/* Header and Filter Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-xs">
            <Trophy className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {language === 'th' ? 'กระดานผู้นำ Top 10 (Timed Test)' : 'Top 10 Leaderboard (Timed Test)'}
              </h2>
              <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                <Sparkles className="w-3 h-3" />
                Top 10
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'th'
                ? 'จัดอันดับคะแนนสูงสุดเฉพาะโหมดทดสอบจับเวลา (Timed Mode)'
                : 'Highest typing speeds recorded exclusively in Timed Test mode'}
            </p>
          </div>
        </div>

        {/* Duration Filter Pills & Clear Action */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setSelectedDuration('all')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                selectedDuration === 'all'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {language === 'th' ? 'ทั้งหมด' : 'All'}
            </button>
            <button
              onClick={() => setSelectedDuration(60)}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                selectedDuration === 60
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              1 {language === 'th' ? 'นาที' : 'min'}
            </button>
            <button
              onClick={() => setSelectedDuration(180)}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                selectedDuration === 180
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              3 {language === 'th' ? 'นาที' : 'min'}
            </button>
            <button
              onClick={() => setSelectedDuration(300)}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                selectedDuration === 300
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              5 {language === 'th' ? 'นาที' : 'min'}
            </button>
          </div>

          {entries.length > 0 && onClearLeaderboard && (
            <div className="relative">
              {isConfirmClear ? (
                <div className="flex items-center gap-1.5 animate-pop">
                  <button
                    onClick={() => {
                      onClearLeaderboard();
                      setIsConfirmClear(false);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-rose-500 text-white text-[11px] font-bold hover:bg-rose-600 transition-colors shadow-xs"
                  >
                    {language === 'th' ? 'ยืนยันลบ' : 'Confirm'}
                  </button>
                  <button
                    onClick={() => setIsConfirmClear(false)}
                    className="px-2 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium"
                  >
                    {language === 'th' ? 'ยกเลิก' : 'Cancel'}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsConfirmClear(true)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                  title={language === 'th' ? 'ล้างกระดานผู้นำ' : 'Clear leaderboard'}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Leaderboard Table / Cards */}
      {top10.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center text-center gap-3 bg-slate-50/50 dark:bg-slate-950/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          <div className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400">
            <Trophy className="w-7 h-7" />
          </div>
          <div className="max-w-xs">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {language === 'th'
                ? 'ยังไม่มีสถิติในกระดานผู้นำ'
                : 'No leaderboard records yet'}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {language === 'th'
                ? 'ทดสอบในโหมดจับเวลา (Timed Test) เพื่อบันทึกชื่อเป็นคนแรกใน Top 10!'
                : 'Complete a Timed Test to secure your spot in the Top 10!'}
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-slate-800 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-3 w-14 text-center"># {language === 'th' ? 'อันดับ' : 'Rank'}</th>
                <th className="py-3 px-3">{language === 'th' ? 'ชื่อคนพิมพ์' : 'Player Name'}</th>
                <th className="py-3 px-3 text-right">{language === 'th' ? 'ความเร็ว (WPM)' : 'WPM'}</th>
                <th className="py-3 px-3 text-right">{language === 'th' ? 'ความเร็ว (CPM)' : 'CPM'}</th>
                <th className="py-3 px-3 text-right">{language === 'th' ? 'ความแม่นยำ' : 'Accuracy'}</th>
                <th className="py-3 px-3 text-center">{language === 'th' ? 'เวลาทดสอบ' : 'Duration'}</th>
                <th className="py-3 px-3 text-right">{language === 'th' ? 'วันที่และเวลา' : 'Date & Time'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs sm:text-sm">
              {top10.map((entry, idx) => {
                const rank = idx + 1;
                const isTop1 = rank === 1;
                const isTop2 = rank === 2;
                const isTop3 = rank === 3;

                return (
                  <tr
                    key={entry.id || idx}
                    className={`transition-colors ${
                      isTop1
                        ? 'bg-amber-500/5 hover:bg-amber-500/10'
                        : isTop2
                        ? 'bg-slate-500/5 hover:bg-slate-500/10'
                        : isTop3
                        ? 'bg-orange-500/5 hover:bg-orange-500/10'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    {/* Rank Badge */}
                    <td className="py-3 px-3 text-center font-bold">
                      {isTop1 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white font-extrabold shadow-sm shadow-amber-500/30">
                          1
                        </span>
                      ) : isTop2 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-slate-300 to-slate-500 text-white font-extrabold shadow-sm">
                          2
                        </span>
                      ) : isTop3 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 text-white font-extrabold shadow-sm">
                          3
                        </span>
                      ) : (
                        <span className="text-slate-400 font-semibold text-xs">
                          #{rank}
                        </span>
                      )}
                    </td>

                    {/* Player Name */}
                    <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="truncate max-w-[160px] sm:max-w-[200px]">
                          {entry.name}
                        </span>
                        {isTop1 && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            👑 Champion
                          </span>
                        )}
                      </div>
                    </td>

                    {/* WPM */}
                    <td className="py-3 px-3 text-right font-extrabold text-sky-600 dark:text-sky-400">
                      {entry.wpm}{' '}
                      <span className="text-[10px] font-normal text-slate-400">WPM</span>
                    </td>

                    {/* CPM */}
                    <td className="py-3 px-3 text-right font-semibold text-slate-600 dark:text-slate-300">
                      {entry.cpm}
                    </td>

                    {/* Accuracy */}
                    <td className="py-3 px-3 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                      {entry.accuracy}%
                    </td>

                    {/* Duration */}
                    <td className="py-3 px-3 text-center">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-medium">
                        {formatDurationText(entry.durationSeconds)}
                      </span>
                    </td>

                    {/* Date and Time */}
                    <td className="py-3 px-3 text-right text-slate-400 text-[11px] whitespace-nowrap">
                      {formatDate(entry.date)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};
