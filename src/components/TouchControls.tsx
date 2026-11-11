import React from 'react';
import { Direction } from '../types/game';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface TouchControlsProps {
  onDirectionChange: (dir: Direction) => void;
  vibrationEnabled: boolean;
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  onDirectionChange,
  vibrationEnabled,
}) => {
  const handlePress = (dir: Direction) => {
    if (vibrationEnabled && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(20);
      } catch {}
    }
    onDirectionChange(dir);
  };

  return (
    <div className="w-full max-w-[560px] flex flex-col items-center gap-2 pt-1 pb-4">
      {/* Cyber Virtual D-Pad */}
      <div className="grid grid-cols-3 gap-2 w-48 h-48 select-none touch-manipulation">
        {/* Row 1 */}
        <div />
        <button
          onClick={() => handlePress('UP')}
          aria-label="위쪽 이동"
          className="flex items-center justify-center bg-slate-900/90 active:bg-cyan-500 active:text-slate-950 text-cyan-400 rounded-xl border border-cyan-500/40 active:border-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.12)] active:scale-95 transition-all touch-manipulation cursor-pointer"
        >
          <ChevronUp className="w-7 h-7" />
        </button>
        <div />

        {/* Row 2 */}
        <button
          onClick={() => handlePress('LEFT')}
          aria-label="왼쪽 이동"
          className="flex items-center justify-center bg-slate-900/90 active:bg-cyan-500 active:text-slate-950 text-cyan-400 rounded-xl border border-cyan-500/40 active:border-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.12)] active:scale-95 transition-all touch-manipulation cursor-pointer"
        >
          <ChevronLeft className="w-7 h-7" />
        </button>
        <div className="flex items-center justify-center text-[9px] font-mono text-cyan-500/60 font-bold tracking-widest uppercase">
          NAV.PAD
        </div>
        <button
          onClick={() => handlePress('RIGHT')}
          aria-label="오른쪽 이동"
          className="flex items-center justify-center bg-slate-900/90 active:bg-cyan-500 active:text-slate-950 text-cyan-400 rounded-xl border border-cyan-500/40 active:border-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.12)] active:scale-95 transition-all touch-manipulation cursor-pointer"
        >
          <ChevronRight className="w-7 h-7" />
        </button>

        {/* Row 3 */}
        <div />
        <button
          onClick={() => handlePress('DOWN')}
          aria-label="아래쪽 이동"
          className="flex items-center justify-center bg-slate-900/90 active:bg-cyan-500 active:text-slate-950 text-cyan-400 rounded-xl border border-cyan-500/40 active:border-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.12)] active:scale-95 transition-all touch-manipulation cursor-pointer"
        >
          <ChevronDown className="w-7 h-7" />
        </button>
        <div />
      </div>

      {/* Keyboard & Swipe Hint */}
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] font-mono text-slate-400 pt-1">
        <span>KEYBOARD: [W A S D] / [방향키]</span>
        <span aria-hidden="true" className="text-slate-600">·</span>
        <span>SPACE: [PAUSE]</span>
        <span aria-hidden="true" className="text-slate-600">·</span>
        <span>R: [RELOAD]</span>
      </div>
    </div>
  );
};
