import React from 'react';
import { ActiveBuff, GameMode } from '../types/game';
import { Pause, Play, Flame, ShieldAlert, Cpu } from 'lucide-react';

interface ScoreBoardProps {
  score: number;
  highScore: number;
  length: number;
  combo: number;
  comboTimeLeft: number; // 0 to 1 ratio
  mode: GameMode;
  timeLeft?: number; // For TIME_ATTACK mode
  activeBuffs: ActiveBuff[];
  wallPassThrough: boolean;
  isPaused: boolean;
  onTogglePause: () => void;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  score,
  highScore,
  length,
  combo,
  comboTimeLeft,
  mode,
  timeLeft,
  activeBuffs,
  wallPassThrough,
  isPaused,
  onTogglePause,
}) => {
  const modeLabels: Record<GameMode, string> = {
    CLASSIC: '클래식 프로토콜',
    ARCADE: '사이버 아케이드',
    OBSTACLES: '방화벽 미로',
    TIME_ATTACK: '오버클럭 타임',
  };

  return (
    <div className="w-full max-w-[560px] flex flex-col gap-2 select-none">
      {/* Top Cyber Telemetry Line */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono px-1">
        <div className="flex items-center gap-2">
          <span className="text-cyan-400 font-semibold tracking-wider uppercase">
            {modeLabels[mode]}
          </span>
          <span aria-hidden="true" className="text-slate-600">/</span>
          <span className={wallPassThrough ? 'text-emerald-400' : 'text-rose-400'}>
            {wallPassThrough ? 'WARP [ACTIVE]' : 'BARRIER [LETHAL]'}
          </span>
        </div>

        {mode === 'TIME_ATTACK' && typeof timeLeft === 'number' && (
          <div className="flex items-center gap-1 font-mono font-bold text-amber-400">
            <span className="text-slate-400">SYNC:</span>
            <span className="tabular-nums text-xs bg-amber-950/60 border border-amber-500/40 px-2 py-0.5 rounded text-amber-300">
              {Math.max(0, Math.ceil(timeLeft))}s
            </span>
          </div>
        )}
      </div>

      {/* Main Metric Cyber HUD Box */}
      <div className="grid grid-cols-4 gap-2 bg-slate-950/90 border border-cyan-500/30 p-2.5 rounded-xl shadow-[0_0_20px_rgba(0,240,255,0.06)] relative overflow-hidden">
        {/* Subtle grid background texture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,240,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,240,255,0.03)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

        {/* Current Score */}
        <div className="flex flex-col relative z-10">
          <span className="text-[10px] font-mono tracking-wider text-slate-400">SCORE</span>
          <span className="font-mono tabular-nums text-xl md:text-2xl font-extrabold text-cyan-400 tracking-tight drop-shadow-[0_0_8px_rgba(0,240,255,0.4)]">
            {score}
          </span>
        </div>

        {/* Record Score */}
        <div className="flex flex-col relative z-10">
          <span className="text-[10px] font-mono tracking-wider text-slate-400">RECORD</span>
          <span className="font-mono tabular-nums text-xl md:text-2xl font-extrabold text-amber-400 tracking-tight drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]">
            {highScore}
          </span>
        </div>

        {/* Exoskeleton Length */}
        <div className="flex flex-col relative z-10">
          <span className="text-[10px] font-mono tracking-wider text-slate-400">MODULES</span>
          <span className="font-mono tabular-nums text-xl md:text-2xl font-extrabold text-pink-400 tracking-tight drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]">
            {length}
          </span>
        </div>

        {/* Controls / Pause */}
        <div className="flex items-center justify-end relative z-10">
          <button
            onClick={onTogglePause}
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-900 border border-cyan-500/40 hover:border-cyan-400 hover:bg-cyan-950/40 active:scale-95 text-cyan-300 transition-all cursor-pointer shadow-[0_0_10px_rgba(0,240,255,0.15)]"
            title={isPaused ? '프로토콜 재개 (Space)' : '프로토콜 일시정지 (Space)'}
          >
            {isPaused ? <Play className="w-4 h-4 fill-current ml-0.5" /> : <Pause className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Dynamic Energy Bar: Combo Overdrive & Active Buffs */}
      <div className="flex flex-col gap-1.5 px-0.5 min-h-[22px]">
        {/* Overdrive Combo Meter */}
        {combo > 1 && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-amber-400 whitespace-nowrap">
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              <span>OVERDRIVE x{combo}</span>
            </div>
            <div className="flex-1 h-2 bg-slate-900 border border-slate-800 rounded-sm overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-amber-400 via-rose-500 to-cyan-400 shadow-[0_0_10px_rgba(251,191,36,0.6)] transition-all duration-75"
                style={{ width: `${Math.max(0, Math.min(100, comboTimeLeft * 100))}%` }}
              />
            </div>
          </div>
        )}

        {/* Cyber Buff Modules */}
        {activeBuffs.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            {activeBuffs.map((buff) => {
              const secondsLeft = Math.max(0, Math.ceil((buff.expiresAt - Date.now()) / 1000));
              const labels: Record<string, { name: string; color: string; border: string; icon: string }> = {
                SPEED_CHILI: {
                  name: 'OVERCLOCK 2X',
                  color: 'text-amber-400',
                  border: 'border-amber-500/40 bg-amber-950/40',
                  icon: '⚡',
                },
                FREEZE_BERRY: {
                  name: 'CRYO EMP',
                  color: 'text-cyan-400',
                  border: 'border-cyan-500/40 bg-cyan-950/40',
                  icon: '❄️',
                },
                MAGNET: {
                  name: 'GRAVITON FLUX',
                  color: 'text-purple-400',
                  border: 'border-purple-500/40 bg-purple-950/40',
                  icon: '🧲',
                },
              };
              const item = labels[buff.type] || {
                name: 'SYSTEM BUFF',
                color: 'text-slate-200',
                border: 'border-slate-700 bg-slate-900',
                icon: '✨',
              };

              return (
                <div
                  key={buff.type}
                  className={`flex items-center gap-1.5 text-[11px] font-mono px-2 py-0.5 rounded border ${item.border}`}
                >
                  <span>{item.icon}</span>
                  <span className={`font-bold ${item.color}`}>{item.name}</span>
                  <span className="text-slate-400 tabular-nums">[{secondsLeft}s]</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
