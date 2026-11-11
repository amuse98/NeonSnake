import React from 'react';
import { X, Trophy, Award, BarChart3, RotateCcw } from 'lucide-react';
import { GameMode, GameStats } from '../types/game';
import { ACHIEVEMENTS } from '../utils/gameConstants';

interface StatsModalProps {
  stats: GameStats;
  onResetStats: () => void;
  onClose: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({ stats, onResetStats, onClose }) => {
  const modeLabels: Record<GameMode, string> = {
    CLASSIC: '클래식 프로토콜',
    ARCADE: '사이버 아케이드',
    OBSTACLES: '방화벽 미로',
    TIME_ATTACK: '오버클럭 타임',
  };

  const unlockedCount = stats.achievementsUnlocked.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-slate-900 border border-amber-500/40 rounded-2xl p-6 shadow-[0_0_35px_rgba(251,191,36,0.15)] flex flex-col text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="font-display text-lg font-bold text-white tracking-wide">
              CYBER ARCHIVES // 기록실 & 업적
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* High scores by mode */}
        <div className="mb-6 font-mono">
          <div className="flex items-center gap-2 mb-2.5">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <label className="text-xs font-semibold text-cyan-400 tracking-wider uppercase">
              // RECORD BY PROTOCOL
            </label>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {(Object.keys(modeLabels) as GameMode[]).map((mode) => (
              <div
                key={mode}
                className="bg-slate-950/70 border border-slate-800 p-3 rounded-xl flex flex-col"
              >
                <span className="text-[10px] text-slate-400 mb-0.5">{modeLabels[mode]}</span>
                <span className="font-mono tabular-nums text-xl font-bold text-amber-400">
                  {stats.highestScore[mode] || 0}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Overall Lifetime Stats */}
        <div className="mb-6 bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 font-mono">
          <div className="text-xs font-semibold text-slate-400 tracking-wide mb-3 uppercase">
            // LIFETIME TELEMETRY
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-[10px] text-slate-400">SORTIES</div>
              <div className="font-mono font-bold text-base text-slate-200 mt-0.5">
                {stats.gamesPlayed}회
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400">ABSORBED</div>
              <div className="font-mono font-bold text-base text-cyan-400 mt-0.5">
                {stats.totalFoodEaten}개
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400">MAX MODULES</div>
              <div className="font-mono font-bold text-base text-pink-400 mt-0.5">
                {stats.maxLengthEver}개
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              <label className="text-xs font-mono font-semibold text-emerald-400 tracking-wider uppercase">
                // PROTOCOL ACHIEVEMENTS
              </label>
            </div>
            <span className="text-xs font-mono text-emerald-400">
              [{unlockedCount} / {ACHIEVEMENTS.length} 해금]
            </span>
          </div>

          <div className="space-y-2">
            {ACHIEVEMENTS.map((ach) => {
              const isUnlocked = stats.achievementsUnlocked.includes(ach.id);
              return (
                <div
                  key={ach.id}
                  className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${
                    isUnlocked
                      ? 'bg-slate-950/70 border-emerald-500/40'
                      : 'bg-slate-950/20 border-slate-800/50 opacity-60'
                  }`}
                >
                  <div className="text-2xl w-8 h-8 flex items-center justify-center shrink-0">
                    {isUnlocked ? ach.icon : '🔒'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5 font-mono">
                      <span>{ach.title}</span>
                      {isUnlocked && (
                        <span className="text-[10px] text-emerald-400 font-normal">UNLOCKED</span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">{ach.description}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reset Records Button */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between font-mono">
          <button
            onClick={() => {
              if (window.confirm('기록 보관소의 모든 최고 기록과 업적을 초기화(FACTORY RESET)하시겠습니까?')) {
                onResetStats();
              }
            }}
            className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 py-1.5 px-2.5 rounded-lg hover:bg-rose-950/30 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>PURGE LOGS</span>
          </button>

          <button
            onClick={onClose}
            className="py-2 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase transition-colors cursor-pointer"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
