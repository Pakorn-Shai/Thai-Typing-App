import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Zap,
  Target,
  Clock,
  RotateCcw,
  ArrowRight,
  Share2,
  Check,
  Flame,
  Download,
  Image as ImageIcon,
  Star,
} from 'lucide-react';
import { TypingStats, Language } from '../../types/typing';
import { formatTime } from '../../utils/metrics';
import {
  downloadResultCardImage,
  copyResultCardImage,
} from '../../utils/cardImage';

interface ResultCardProps {
  stats: TypingStats;
  language: Language;
  title: string;
  onRestart: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  stats,
  language,
  title,
  onRestart,
  onNext,
  hasNext = false,
}) => {
  const [copiedText, setCopiedText] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    // Fire celebration confetti!
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // Confetti fallback
    }
  }, []);

  const handleCopyText = async () => {
    const text = [
      `⌨️ Thai Typing Lab | ผลการทดสอบพิมพ์สัมผัส`,
      `🎯 ${title}`,
      `⚡ CPM: ${stats.cpm} | 🚀 WPM: ${stats.wpm}`,
      `🎯 ความแม่นยำ: ${stats.accuracy}% (${stats.correctChars}/${stats.totalTyped} คีย์)`,
      `⏱ เวลาที่ใช้: ${formatTime(stats.elapsedSeconds)}`,
      `🔗 ฝึกพิมพ์ฟรีได้ที่: Thai Typing Lab`,
    ].join('\n');

    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    } catch {
      // Clipboard fallback
    }
  };

  const handleCopyImage = async () => {
    const success = await copyResultCardImage(stats, title);
    if (success) {
      setCopiedImage(true);
      setTimeout(() => setCopiedImage(false), 2500);
    }
  };

  const handleDownloadImage = async () => {
    setIsDownloading(true);
    try {
      await downloadResultCardImage(stats, title);
    } finally {
      setIsDownloading(false);
    }
  };

  // Performance rating badge
  const getSpeedRating = (cpm: number) => {
    if (cpm >= 250) return { label: 'ระดับเซียน (Expert)', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
    if (cpm >= 180) return { label: 'รวดเร็วมาก (Advanced)', color: 'text-sky-400 bg-sky-500/10 border-sky-500/30' };
    if (cpm >= 120) return { label: 'คล่องแคล่วดี (Intermediate)', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
    return { label: 'กำลังพัฒนา (Beginner)', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30' };
  };

  // Star rating calculation
  const getStars = (cpm: number, accuracy: number): number => {
    if (accuracy < 85) return 1;
    if (cpm >= 180 && accuracy >= 95) return 3;
    if (cpm >= 120 && accuracy >= 90) return 2;
    return 1;
  };

  const starsCount = getStars(stats.cpm, stats.accuracy);
  const rating = getSpeedRating(stats.cpm);

  return (
    <div className="w-full bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl flex flex-col gap-6 animate-pop">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-white">
                {language === 'th' ? 'ผลลัพธ์การฝึกซ้อม' : 'Test Completed!'}
              </h3>
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${rating.color}`}>
                {rating.label}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              {/* Star Rating display */}
              <div className="flex items-center gap-0.5">
                {[1, 2, 3].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= starsCount
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-slate-400">• {title}</span>
            </div>
          </div>
        </div>

        {/* Share Action Buttons */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Download Image Button */}
          <button
            onClick={handleDownloadImage}
            disabled={isDownloading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all text-xs font-semibold"
            title={language === 'th' ? 'ดาวน์โหลดรูปภาพผลคะแนน (PNG)' : 'Download Result Image'}
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span>{language === 'th' ? 'บันทึกรูป PNG' : 'Save Image'}</span>
          </button>

          {/* Copy Image Button */}
          <button
            onClick={handleCopyImage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all text-xs font-semibold"
            title={language === 'th' ? 'คัดลอกรูปภาพลง Clipboard' : 'Copy Image to Clipboard'}
          >
            {copiedImage ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">
                  {language === 'th' ? 'คัดลอกรูปแล้ว!' : 'Copied Image!'}
                </span>
              </>
            ) : (
              <>
                <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                <span>{language === 'th' ? 'คัดลอกรูป' : 'Copy Image'}</span>
              </>
            )}
          </button>

          {/* Copy Text Button */}
          <button
            onClick={handleCopyText}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all text-xs font-semibold"
          >
            {copiedText ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">
                  {language === 'th' ? 'คัดลอกข้อความแล้ว!' : 'Copied Text!'}
                </span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-sky-400" />
                <span>{language === 'th' ? 'แชร์ข้อความ' : 'Copy Text'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Metric Highlight Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* CPM */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-1.5 text-xs text-sky-400 font-semibold mb-1">
            <Zap className="w-4 h-4" />
            <span>CPM</span>
          </div>
          <div className="text-4xl font-extrabold font-mono tracking-tight text-white my-1">
            {stats.cpm}
          </div>
          <div className="text-[11px] text-slate-400">
            {language === 'th' ? 'อักขระ/นาที' : 'Chars / Min'}
          </div>
        </div>

        {/* WPM */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-semibold mb-1">
            <Flame className="w-4 h-4" />
            <span>WPM</span>
          </div>
          <div className="text-4xl font-extrabold font-mono tracking-tight text-white my-1">
            {stats.wpm}
          </div>
          <div className="text-[11px] text-slate-400">
            {language === 'th' ? 'คำ/นาที (CPM/5)' : 'Words / Min'}
          </div>
        </div>

        {/* Accuracy */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold mb-1">
            <Target className="w-4 h-4" />
            <span>{language === 'th' ? 'ความแม่นยำ' : 'Accuracy'}</span>
          </div>
          <div className="text-4xl font-extrabold font-mono tracking-tight text-white my-1">
            {stats.accuracy}%
          </div>
          <div className="text-[11px] text-slate-400">
            {stats.correctChars} / {stats.totalTyped} {language === 'th' ? 'เคาะ' : 'keys'}
          </div>
        </div>

        {/* Time */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold mb-1">
            <Clock className="w-4 h-4" />
            <span>{language === 'th' ? 'เวลาที่ใช้' : 'Duration'}</span>
          </div>
          <div className="text-4xl font-extrabold font-mono tracking-tight text-amber-300 my-1">
            {formatTime(stats.elapsedSeconds)}
          </div>
          <div className="text-[11px] text-slate-400">
            {stats.incorrectChars} {language === 'th' ? 'ข้อผิดพลาด' : 'errors'}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
        <button
          onClick={onRestart}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 font-medium text-sm transition-all"
        >
          <RotateCcw className="w-4 h-4 text-sky-400" />
          <span>{language === 'th' ? 'ฝึกซ้ำอีกครั้ง' : 'Try Again'}</span>
        </button>

        {hasNext && onNext && (
          <button
            onClick={onNext}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-sky-500/25 transition-all"
          >
            <span>{language === 'th' ? 'แบบฝึกหัดถัดไป' : 'Next Exercise'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
