import React from 'react';
import {
  X,
  History,
  TrendingUp,
  Award,
  Clock,
  Trash2,
  Calendar,
  Target,
} from 'lucide-react';
import { TypingHistoryRecord, Language } from '../../types/typing';
import { formatTime } from '../../utils/metrics';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: TypingHistoryRecord[];
  onClearHistory: () => void;
  language: Language;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onClearHistory,
  language,
}) => {
  if (!isOpen) return null;

  // Aggregate metrics
  const totalTests = history.length;
  const bestCpm = history.reduce((max, r) => Math.max(max, r.cpm), 0);
  const bestWpm = history.reduce((max, r) => Math.max(max, r.wpm), 0);
  const avgAccuracy =
    totalTests > 0
      ? Math.round(
          (history.reduce((acc, r) => acc + r.accuracy, 0) / totalTests) * 10
        ) / 10
      : 0;
  const totalDurationSeconds = history.reduce(
    (acc, r) => acc + r.durationSeconds,
    0
  );

  // Aggregated weak keys across history
  const aggregatedMistakes: Record<string, number> = {};
  history.forEach((rec) => {
    if (rec.mistakeKeys) {
      Object.entries(rec.mistakeKeys).forEach(([key, count]) => {
        aggregatedMistakes[key] = (aggregatedMistakes[key] || 0) + count;
      });
    }
  });

  const sortedWeakKeys = Object.entries(aggregatedMistakes)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  // Recent 10 tests for bar chart
  const recentTests = history.slice(0, 12).reverse();
  const maxRecentCpm = recentTests.reduce((max, r) => Math.max(max, r.cpm), 100);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-pop">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {language === 'th' ? 'ประวัติและสถิติการฝึกซ้อม' : 'Practice History & Analytics'}
              </h3>
              <p className="text-xs text-slate-400">
                {language === 'th'
                  ? 'ข้อมูลถูกเก็บเฉพาะในเบราว์เซอร์ของคุณ (Local-first)'
                  : 'Saved completely in local browser storage'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
            title="ปิดหน้าต่าง"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-6">
          {/* Summary KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3 flex flex-col">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-sky-400" />
                {language === 'th' ? 'ทดสอบทั้งหมด' : 'Total Tests'}
              </span>
              <span className="text-2xl font-bold font-mono text-white mt-1">
                {totalTests}
              </span>
              <span className="text-[10px] text-slate-500">
                {language === 'th' ? 'รอบการฝึกฝน' : 'sessions'}
              </span>
            </div>

            <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3 flex flex-col">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                {language === 'th' ? 'ความเร็วสูงสุด' : 'Peak CPM / WPM'}
              </span>
              <span className="text-2xl font-bold font-mono text-amber-400 mt-1">
                {bestCpm} <span className="text-xs text-slate-400 font-sans font-normal">CPM</span>
              </span>
              <span className="text-[10px] text-slate-500">
                ({bestWpm} WPM)
              </span>
            </div>

            <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3 flex flex-col">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Target className="w-3.5 h-3.5 text-emerald-400" />
                {language === 'th' ? 'ความแม่นยำเฉลี่ย' : 'Avg Accuracy'}
              </span>
              <span className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                {avgAccuracy}%
              </span>
              <span className="text-[10px] text-slate-500">
                {language === 'th' ? 'ของทุกการทดสอบ' : 'overall precision'}
              </span>
            </div>

            <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3 flex flex-col">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                {language === 'th' ? 'เวลาฝึกสะสม' : 'Total Practice'}
              </span>
              <span className="text-2xl font-bold font-mono text-indigo-300 mt-1">
                {formatTime(totalDurationSeconds)}
              </span>
              <span className="text-[10px] text-slate-500">
                {language === 'th' ? 'นาที:วินาที' : 'MM:SS'}
              </span>
            </div>
          </div>

          {/* Speed Trend Visual Chart */}
          {recentTests.length > 1 && (
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs text-slate-300 font-medium mb-1">
                <div className="flex items-center gap-1.5 text-sky-400">
                  <TrendingUp className="w-4 h-4" />
                  <span>
                    {language === 'th'
                      ? 'แนวโน้มความเร็ว (CPM ล่าสุด)'
                      : 'Speed Progression Trend (Recent CPM)'}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500">
                  {recentTests.length} {language === 'th' ? 'รอบล่าสุด' : 'recent sessions'}
                </span>
              </div>

              {/* Bar visualization */}
              <div className="h-32 flex items-end gap-2 pt-4 px-2 border-b border-slate-800">
                {recentTests.map((t, idx) => {
                  const heightPercent = Math.max(12, Math.round((t.cpm / maxRecentCpm) * 100));
                  return (
                    <div
                      key={t.id || idx}
                      className="flex-1 flex flex-col items-center gap-1.5 group relative"
                    >
                      {/* Tooltip on hover */}
                      <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-[10px] font-mono px-1.5 py-0.5 rounded border border-slate-700 pointer-events-none whitespace-nowrap z-20">
                        {t.cpm} CPM ({t.accuracy}%)
                      </div>

                      <div
                        className="w-full bg-gradient-to-t from-sky-600 to-sky-400 group-hover:from-sky-500 group-hover:to-indigo-400 rounded-t-md transition-all duration-200"
                        style={{ height: `${heightPercent}%` }}
                      />
                      <span className="text-[9px] font-mono text-slate-500">
                        #{idx + 1}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* All-time Weak Keys Heatmap */}
          {sortedWeakKeys.length > 0 && (
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col gap-2.5">
              <span className="text-xs font-semibold text-slate-200">
                {language === 'th'
                  ? 'แป้นที่สะสมข้อผิดพลาดบ่อยที่สุด (All-Time Weak Keys)'
                  : 'Cumulative Weak Keys'}
              </span>
              <div className="flex flex-wrap gap-2">
                {sortedWeakKeys.map(([key, count]) => (
                  <div
                    key={key}
                    className="flex items-center gap-1.5 bg-slate-900 border border-rose-500/30 px-2.5 py-1 rounded-xl"
                  >
                    <span className="font-bold text-white bg-slate-800 px-1.5 py-0.5 rounded text-xs">
                      {key === ' ' ? 'Space' : key}
                    </span>
                    <span className="text-[11px] text-rose-400 font-semibold">
                      {count} {language === 'th' ? 'ครั้ง' : 'misses'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* History Records Table */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-200">
              {language === 'th' ? 'บันทึกประวัติการพิมพ์' : 'Recent Test Log'}
            </span>

            {history.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500 bg-slate-950/40 rounded-2xl border border-slate-800">
                {language === 'th'
                  ? 'ยังไม่มีประวัติการฝึกซ้อม เริ่มฝึกบทเรียนแรกเลย!'
                  : 'No test history yet. Start your first lesson!'}
              </div>
            ) : (
              <div className="border border-slate-800 rounded-2xl overflow-hidden max-h-56 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 sticky top-0">
                    <tr>
                      <th className="py-2.5 px-3">
                        {language === 'th' ? 'วันที่/เวลา' : 'Date'}
                      </th>
                      <th className="py-2.5 px-3">
                        {language === 'th' ? 'บทเรียน / โหมด' : 'Lesson'}
                      </th>
                      <th className="py-2.5 px-3">CPM</th>
                      <th className="py-2.5 px-3">WPM</th>
                      <th className="py-2.5 px-3">
                        {language === 'th' ? 'ความแม่นยำ' : 'Acc'}
                      </th>
                      <th className="py-2.5 px-3">
                        {language === 'th' ? 'เวลา' : 'Time'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 bg-slate-900/40 font-mono">
                    {history.map((rec) => (
                      <tr key={rec.id} className="hover:bg-slate-800/40 text-slate-300">
                        <td className="py-2 px-3 text-slate-500 font-sans text-[11px]">
                          {new Date(rec.timestamp).toLocaleDateString('th-TH', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="py-2 px-3 font-sans text-[11px] text-slate-200">
                          {rec.levelTitle}
                        </td>
                        <td className="py-2 px-3 font-bold text-sky-400">
                          {rec.cpm}
                        </td>
                        <td className="py-2 px-3 text-indigo-400">
                          {rec.wpm}
                        </td>
                        <td className="py-2 px-3 text-emerald-400">
                          {rec.accuracy}%
                        </td>
                        <td className="py-2 px-3 text-slate-400">
                          {formatTime(rec.durationSeconds)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
          {history.length > 0 && (
            <button
              onClick={() => {
                if (
                  window.confirm(
                    language === 'th'
                      ? 'คุณต้องการล้างประวัติการฝึกซ้อมทั้งหมดใช่หรือไม่?'
                      : 'Are you sure you want to clear all history records?'
                  )
                ) {
                  onClearHistory();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:border-rose-500/40 text-xs transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{language === 'th' ? 'ล้างประวัติทั้งหมด' : 'Clear History'}</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="ml-auto px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold transition-all"
          >
            {language === 'th' ? 'ปิด' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
