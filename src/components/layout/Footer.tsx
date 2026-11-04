import React from 'react';
import { ShieldCheck, Sparkles, RefreshCw } from 'lucide-react';
import { Language } from '../../types/typing';

interface FooterProps {
  language: Language;
}

export const Footer: React.FC<FooterProps> = ({ language }) => {
  return (
    <footer className="mt-auto border-t border-slate-800/80 py-6 text-xs text-slate-500">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Privacy & Local-first info */}
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>
            {language === 'th'
              ? 'Privacy-first: บันทึกข้อมูลและสถิติใน LocalStorage ในเครื่องคุณ 100%'
              : 'Privacy-first: Statistics stored locally in your browser'}
          </span>
        </div>

        {/* Shortcuts hint */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded border border-slate-800 text-slate-400">
            <RefreshCw className="w-3 h-3 text-sky-400" />
            <span>
              <kbd className="font-mono bg-slate-800 px-1 py-0.5 rounded text-slate-300">
                Tab
              </kbd>
              {' + '}
              <kbd className="font-mono bg-slate-800 px-1 py-0.5 rounded text-slate-300">
                Enter
              </kbd>{' '}
              {language === 'th' ? 'เริ่มใหม่' : 'Restart'}
            </span>
          </div>

          <div className="flex items-center gap-1 text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Kedmanee & QWERTY</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

