import React, { useState, useRef, useEffect } from 'react';
import {
  Keyboard,
  Volume2,
  VolumeX,
  Moon,
  Sun,
  Globe,
  BarChart2,
  Volume1,
  ChevronDown,
  Sliders,
  Play,
  Trophy,
} from 'lucide-react';
import { Language, SoundProfile } from '../../types/typing';
import { soundManager } from '../../utils/sound';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  soundProfile: SoundProfile;
  onSoundProfileChange: (profile: SoundProfile) => void;
  soundVolume: number;
  onSoundVolumeChange: (vol: number) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenHistory: () => void;
  historyCount: number;
  onOpenLeaderboard?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  soundProfile,
  onSoundProfileChange,
  soundVolume,
  onSoundVolumeChange,
  isDark,
  onToggleTheme,
  onOpenHistory,
  historyCount,
  onOpenLeaderboard,
}) => {
  const [showSoundMenu, setShowSoundMenu] = useState(false);
  const soundMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        soundMenuRef.current &&
        !soundMenuRef.current.contains(e.target as Node)
      ) {
        setShowSoundMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePreviewSound = (p: SoundProfile, e: React.MouseEvent) => {
    e.stopPropagation();
    if (p === 'off') return;
    const oldP = soundManager.getProfile();
    soundManager.setProfile(p);
    soundManager.playClick();
    setTimeout(() => soundManager.playClick(), 110);
    setTimeout(() => soundManager.playClick(), 220);
    setTimeout(() => soundManager.setProfile(oldP), 300);
  };

  const soundProfiles: { id: SoundProfile; label: string; desc: string }[] = [
    { id: 'clicky', label: 'Clicky (Blue Switch)', desc: 'เสียงคมชัด แบบบลูสวิตช์' },
    { id: 'thock', label: 'Thock (Brown Switch)', desc: 'เสียงนุ่มทุ้ม แน่น หนักแน่น' },
    { id: 'bubble', label: 'Bubble Pop', desc: 'เสียงฟองสบู่นุ่มนวล' },
    { id: 'off', label: 'Mute (ปิดเสียง)', desc: 'ไม่มีเสียงพิมพ์' },
  ];

  return (
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20 text-white shrink-0">
            <Keyboard className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white font-sans">
                Thai Typing Lab
              </h1>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                v1.2
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              {language === 'th'
                ? 'ห้องแล็บฝึกพิมพ์สัมผัสไทย-สากล (Kedmanee & Pattachote & QWERTY)'
                : 'Touch Typing Practice & Analytics'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Top 10 Leaderboard Button */}
          {onOpenLeaderboard && (
            <button
              onClick={onOpenLeaderboard}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-semibold transition-all"
              title={language === 'th' ? 'ดูกระดานผู้นำ Top 10' : 'View Top 10 Leaderboard'}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">Top 10</span>
            </button>
          )}

          {/* History & Statistics Button */}
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 hover:text-slate-900 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 dark:border-slate-700/60 dark:text-slate-200 dark:hover:text-white text-xs font-medium transition-all relative"
            title={language === 'th' ? 'ดูสถิติและประวัติการฝึกพิมพ์' : 'View History & Statistics'}
          >
            <BarChart2 className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
            <span className="hidden sm:inline">
              {language === 'th' ? 'สถิติ' : 'Analytics'}
            </span>
            {historyCount > 0 && (
              <span className="h-4 min-w-[16px] px-1 rounded-full bg-sky-500 text-[10px] font-bold text-white flex items-center justify-center">
                {historyCount}
              </span>
            )}
          </button>

          {/* Language Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700/60 text-xs font-medium">
            <button
              onClick={() => onLanguageChange('th')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md transition-all ${
                language === 'th'
                  ? 'bg-sky-500 text-white shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
              title="สลับเป็นภาษาไทย"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>ไทย</span>
            </button>
            <button
              onClick={() => onLanguageChange('en')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md transition-all ${
                language === 'en'
                  ? 'bg-sky-500 text-white shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
              title="Switch to English"
            >
              <span>EN</span>
            </button>
          </div>

          {/* Sound Profile Selector */}
          <div className="relative" ref={soundMenuRef}>
            <button
              onClick={() => setShowSoundMenu((prev) => !prev)}
              className={`flex items-center gap-1 p-2 rounded-lg border transition-all text-xs font-medium ${
                soundProfile !== 'off'
                  ? 'bg-slate-100 border-slate-200 text-sky-600 hover:bg-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-sky-400 dark:hover:bg-slate-700'
                  : 'bg-slate-100/60 border-slate-200 text-slate-400 hover:text-slate-600 dark:bg-slate-800/50 dark:border-slate-800 dark:text-slate-500 dark:hover:text-slate-300'
              }`}
              title={language === 'th' ? 'เลือกโปรไฟล์เสียงพิมพ์' : 'Sound Profiles'}
            >
              {soundProfile === 'off' ? (
                <VolumeX className="w-4 h-4" />
              ) : soundProfile === 'thock' ? (
                <Volume1 className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {/* Sound Dropdown Menu */}
            {showSoundMenu && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50 animate-pop">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 mb-1 flex items-center justify-between">
                  <span>{language === 'th' ? 'เสียงคีย์บอร์ด' : 'Keyboard Sound'}</span>
                  <span className="text-[10px] text-sky-500 dark:text-sky-400 font-mono">{Math.round(soundVolume * 100)}%</span>
                </div>

                {/* Volume Slider */}
                <div className="px-3 py-2 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/80 mb-1">
                  <Sliders className="w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={soundVolume}
                    onChange={(e) => onSoundVolumeChange(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                  />
                </div>

                {soundProfiles.map((p) => {
                  const isSelected = soundProfile === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => {
                        onSoundProfileChange(p.id);
                        if (p.id !== 'off' && soundVolume === 0) {
                          onSoundVolumeChange(0.8);
                        }
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-sky-500/10 text-sky-600 dark:bg-sky-500/15 dark:text-sky-300 font-semibold'
                          : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/80 dark:hover:text-white'
                      }`}
                    >
                      <div className="flex flex-col gap-0.5">
                        <span>{p.label}</span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">
                          {p.desc}
                        </span>
                      </div>

                      {p.id !== 'off' && (
                        <button
                          onClick={(e) => handlePreviewSound(p.id, e)}
                          className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-sky-500 transition-all shrink-0 ml-2"
                          title="ทดสอบฟังเสียง"
                        >
                          <Play className="w-3 h-3 fill-current" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 hover:text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-700 transition-all"
            title={isDark ? 'สลับเป็นโหมดสว่าง' : 'สลับเป็นโหมดมืด'}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>
        </div>
      </div>
    </header>
  );
};
