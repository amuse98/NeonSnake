import React from 'react';
import { RotateCcw, Trophy, Sparkles, Settings } from 'lucide-react';
import { GameMode } from '../types/game';

interface GameOverModalProps {
  score: number;
  highScore: number;
  isNewRecord: boolean;
  length: number;
  foodEatenCount: number;
  maxComboThisGame: number;
  mode: GameMode;
  newAchievements: string[];
  onRestart: () => void;
  onOpenSettings: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  highScore,
  isNewRecord,
  length,
  foodEatenCount,
  maxComboThisGame,
  mode,
  newAchievements,
  onRestart,
  onOpenSettings,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-cyan-500/40 rounded-2xl p-6 shadow-[0_0_40px_rgba(0,240,255,0.2)] flex flex-col items-center text-center relative overflow-hidden">
        {/* Cyberpunk hazard line */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-rose-500 via-amber-400 to-cyan-400" />

        {/* Record Trophy or Alert */}
        <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.2)] flex items-center justify-center mb-3">
          {isNewRecord ? (
            <Trophy className="w-8 h-8 text-amber-400 animate-bounce" />
          ) : (
            <span className="text-3xl">⚡</span>
          )}
        </div>

        <h2 className="font-display text-2xl font-black text-white mb-1 tracking-tight">
          {isNewRecord ? '신기록 수립 // RECORD OVERCLOCK' : '기체 회로 단절 // SYSTEM DOWN'}
        </h2>

        <p className="text-xs text-slate-400 mb-5 font-mono">
          {isNewRecord
            ? '최고 점수를 갱신했습니다! 최고 프로토콜에 도달했습니다.'
            : '충돌로 인해 외골격 시스템이 정지되었습니다.'}
        </p>

        {/* Scores summary */}
        <div className="w-full grid grid-cols-2 gap-3 mb-4 font-mono">
          <div className="bg-slate-950/80 border border-cyan-500/30 p-3 rounded-xl flex flex-col items-center shadow-[0_0_10px_rgba(0,240,255,0.08)]">
            <span className="text-[10px] text-cyan-400 tracking-wider mb-0.5">FINAL SCORE</span>
            <span className="font-mono tabular-nums text-2xl font-black text-cyan-300 drop-shadow-[0_0_8px_rgba(0,240,255,0.4)]">
              {score}
            </span>
          </div>

          <div className="bg-slate-950/80 border border-amber-500/30 p-3 rounded-xl flex flex-col items-center shadow-[0_0_10px_rgba(251,191,36,0.08)]">
            <span className="text-[10px] text-amber-400 tracking-wider mb-0.5">BEST RECORD</span>
            <span className="font-mono tabular-nums text-2xl font-black text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]">
              {highScore}
            </span>
          </div>
        </div>

        {/* Telemetry breakdown */}
        <div className="w-full bg-slate-950/60 border border-slate-800 rounded-xl p-3 mb-5 text-xs text-slate-300 flex justify-around font-mono">
          <div className="flex flex-col items-center">
            <span className="text-slate-400 text-[11px]">최종 모듈</span>
            <span className="font-bold text-sm text-cyan-400 mt-0.5">{length}개</span>
          </div>
          <div className="w-px bg-slate-800" />
          <div className="flex flex-col items-center">
            <span className="text-slate-400 text-[11px]">흡수 코어</span>
            <span className="font-bold text-sm text-rose-400 mt-0.5">{foodEatenCount}개</span>
          </div>
          <div className="w-px bg-slate-800" />
          <div className="flex flex-col items-center">
            <span className="text-slate-400 text-[11px]">최대 오버드라이브</span>
            <span className="font-bold text-sm text-amber-400 mt-0.5">x{maxComboThisGame}</span>
          </div>
        </div>

        {/* Newly Unlocked Achievements */}
        {newAchievements.length > 0 && (
          <div className="w-full mb-5 bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-left">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>새로운 프로토콜 업적 해금!</span>
            </div>
            <ul className="text-xs text-slate-300 space-y-1">
              {newAchievements.map((title, idx) => (
                <li key={idx} className="flex items-center gap-1.5">
                  <span>✨</span>
                  <span>{title}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="w-full flex items-center gap-3">
          <button
            onClick={onOpenSettings}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold tracking-wider uppercase transition-colors cursor-pointer"
          >
            <Settings className="w-4 h-4" />
            <span>CONFIG</span>
          </button>

          <button
            onClick={onRestart}
            autoFocus
            className="flex-2 flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl bg-cyan-400 hover:bg-cyan-300 active:scale-98 text-slate-950 text-xs font-mono font-black tracking-wider uppercase shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>REBOOT SYSTEM</span>
          </button>
        </div>
      </div>
    </div>
  );
};
