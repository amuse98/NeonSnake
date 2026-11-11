import React from 'react';
import { Volume2, VolumeX, Settings, Trophy, HelpCircle, RotateCcw } from 'lucide-react';

interface HeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenSettings: () => void;
  onOpenStats: () => void;
  onOpenHelp: () => void;
  onRestart: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  soundEnabled,
  onToggleSound,
  onOpenSettings,
  onOpenStats,
  onOpenHelp,
  onRestart,
}) => {
  return (
    <header className="w-full flex items-center justify-between gap-4 md:gap-8 px-4 md:px-8 py-3.5 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="font-display font-black text-xl md:text-2xl tracking-tighter bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-amber-300 bg-clip-text text-transparent whitespace-nowrap drop-shadow-[0_0_12px_rgba(0,240,255,0.4)]">
          CYBER SNAKE 2077
        </span>
      </div>

      {/* Zone 2: Single-line navigation links / modal openers */}
      <nav className="flex items-center gap-1 sm:gap-4 md:gap-6 text-xs md:text-sm font-medium text-slate-400">
        <button
          onClick={onOpenSettings}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:text-slate-100 hover:bg-slate-800/60 transition-colors whitespace-nowrap shrink-0"
          title="모드 및 스킨 설정"
        >
          <Settings className="w-4 h-4 text-cyan-400" />
          <span className="hidden sm:inline">설정</span>
        </button>

        <button
          onClick={onOpenStats}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:text-slate-100 hover:bg-slate-800/60 transition-colors whitespace-nowrap shrink-0"
          title="최고 기록 및 업적"
        >
          <Trophy className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">기록실</span>
        </button>

        <button
          onClick={onOpenHelp}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:text-slate-100 hover:bg-slate-800/60 transition-colors whitespace-nowrap shrink-0"
          title="조작법 및 아이템 도감"
        >
          <HelpCircle className="w-4 h-4 text-purple-400" />
          <span className="hidden sm:inline">도움말</span>
        </button>

        <button
          onClick={onToggleSound}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:text-slate-100 hover:bg-slate-800/60 transition-colors whitespace-nowrap shrink-0"
          title={soundEnabled ? '효과음 끄기' : '효과음 켜기'}
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <VolumeX className="w-4 h-4 text-slate-500" />
          )}
          <span className="hidden sm:inline">{soundEnabled ? '소리 ON' : '소리 OFF'}</span>
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onRestart}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs md:text-sm font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-300 active:scale-95 rounded-lg transition-all shadow-sm shadow-emerald-500/20 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>다시 시작</span>
        </button>
      </div>
    </header>
  );
};
