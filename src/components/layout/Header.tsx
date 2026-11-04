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
} from 'lucide-react';
import { Language, SoundProfile } from '../../types/typing';

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

  const soundProfiles: { id: SoundProfile; label: string; desc: string }[] = [
    { id: 'clicky', label: 'Clicky (Blue Switch)', desc: 'เสียงคมชัด แบบบลูสวิตช์' },
    { id: 'thock', label: 'Thock (Brown Switch)', desc: 'เสียงนุ่มทุ้ม แน่น หนักแน่น' },
    { id: 'bubble', label: 'Bubble Pop', desc: 'เสียงฟองสบู่นุ่มนวล' },
    { id: 'off', label: 'Mute (ปิดเสียง)', desc: 'ไม่มีเสียงพิมพ์' },
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20 text-white">
            <Keyboard className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white font-sans">
                Thai Typing Lab
              </h1>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                v1.2
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              {language === 'th'
                ? 'ห้องแล็บฝึกพิมพ์สัมผัสไทย-สากล (Kedmanee & Pattachote & QWERTY)'
                : 'Touch Typing Practice & Analytics'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* History & Statistics Button */}
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-xs font-medium text-slate-200 hover:text-white transition-all relative"
            title={language === 'th' ? 'ดูสถิติและประวัติการฝึกพิมพ์' : 'View History & Statistics'}
          >
            <BarChart2 className="w-3.5 h-3.5 text-sky-400" />
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
          <div className="flex items-center bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/60 text-xs font-medium">
            <button
              onClick={() => onLanguageChange('th')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md transition-all ${
                language === 'th'
                  ? 'bg-sky-500 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
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
                  : 'text-slate-400 hover:text-slate-200'
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
                  ? 'bg-slate-800 border-slate-700 text-sky-400 hover:bg-slate-700'
                  : 'bg-slate-800/50 border-slate-800 text-slate-500 hover:text-slate-300'
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
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-pop">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 border-b border-slate-800 mb-1 flex items-center justify-between">
                  <span>{language === 'th' ? 'เสียงคีย์บอร์ด' : 'Keyboard Sound'}</span>
                  <span className="text-[10px] text-sky-400 font-mono">{Math.round(soundVolume * 100)}%</span>
                </div>

                {/* Volume Slider */}
                <div className="px-3 py-2 flex items-center gap-2 border-b border-slate-800/80 mb-1">
                  <Sliders className="w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={soundVolume}
                    onChange={(e) => onSoundVolumeChange(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                  />
                </div>

                {soundProfiles.map((p) => {
                  const isSelected = soundProfile === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        onSoundProfileChange(p.id);
                        if (p.id !== 'off' && soundVolume === 0) {
                          onSoundVolumeChange(0.8);
                        }
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex flex-col gap-0.5 transition-all ${
                        isSelected
                          ? 'bg-sky-500/15 text-sky-300 font-semibold'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      <span>{p.label}</span>
                      <span className="text-[10px] text-slate-500 font-normal">
                        {p.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition-all"
            title={isDark ? 'Switch to Light' : 'Switch to Dark'}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
