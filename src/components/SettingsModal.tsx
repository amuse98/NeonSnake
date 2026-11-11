import React from 'react';
import { X, Check, Sliders, Palette, Zap, ShieldAlert, Volume2, Smartphone } from 'lucide-react';
import { Difficulty, GameMode, GameSettings, SkinId } from '../types/game';
import { SKINS } from '../utils/gameConstants';

interface SettingsModalProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onClose,
}) => {
  const modes: Array<{ id: GameMode; label: string; desc: string }> = [
    { id: 'CLASSIC', label: '클래식 프로토콜', desc: '데이터 코어 수집 및 안정 생존 모드' },
    { id: 'ARCADE', label: '사이버 아케이드', desc: '오버클럭, 크라이오 EMP, 퀀텀 싱귤래리티 등 특수 코어 출현' },
    { id: 'OBSTACLES', label: '방화벽 미로', desc: '섹터에 배치된 고전압 레이저 장애물을 피해 기체 제어' },
    { id: 'TIME_ATTACK', label: '오버클럭 타임', desc: '60초 카운트다운 내 코어를 흡수하여 시간을 연장하며 최고점 경신' },
  ];

  const difficulties: Array<{ id: Difficulty; label: string; speedMs: string }> = [
    { id: 'EASY', label: '초심자', speedMs: 'SAFE' },
    { id: 'NORMAL', label: '스탠다드', speedMs: 'OPT' },
    { id: 'HARD', label: '하이퍼', speedMs: 'FAST' },
    { id: 'EXTREME', label: '오버클럭', speedMs: 'MAX' },
  ];

  // Distinct cyber skins list
  const cyberSkinIds: SkinId[] = ['CYBER_VIPER', 'NEO_TOKYO', 'MATRIX_RUNNER', 'BLADE_PHANTOM', 'GHOST_SHELL'];
  const skinList = cyberSkinIds.map((id) => SKINS[id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-slate-900 border border-cyan-500/40 rounded-2xl p-6 shadow-[0_0_35px_rgba(0,240,255,0.15)] flex flex-col text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h2 className="font-display text-lg font-bold text-white tracking-wide">
              SYSTEM CONFIG // 설정
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section 1: Game Mode */}
        <div className="mb-6">
          <label className="text-xs font-mono font-semibold text-cyan-400 tracking-wider mb-2.5 block uppercase">
            // PROTOCOL SELECT (게임 모드)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {modes.map((m) => {
              const active = settings.mode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => onUpdateSettings({ ...settings, mode: m.id })}
                  className={`text-left p-3 rounded-xl border transition-all cursor-pointer ${
                    active
                      ? 'border-cyan-400 bg-cyan-950/50 text-white shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                      : 'border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold text-sm mb-1">
                    <span>{m.label}</span>
                    {active && <Check className="w-4 h-4 text-cyan-400" />}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">{m.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Cybernetic Skin Selection */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2.5">
            <Palette className="w-4 h-4 text-fuchsia-400" />
            <label className="text-xs font-mono font-semibold text-fuchsia-400 tracking-wider uppercase">
              // EXOSKELETON CHASSIS (기체 스킨)
            </label>
          </div>
          <div className="space-y-2">
            {skinList.map((skin) => {
              const active = settings.skin === skin.id || (settings.skin === 'NEON' && skin.id === 'CYBER_VIPER');
              return (
                <button
                  key={skin.id}
                  onClick={() => onUpdateSettings({ ...settings, skin: skin.id })}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    active
                      ? 'border-fuchsia-500 bg-fuchsia-950/30 text-white shadow-[0_0_12px_rgba(236,72,153,0.25)]'
                      : 'border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {/* High-tech Swatch */}
                  <div
                    className="w-9 h-9 rounded-lg border border-slate-700 shrink-0 shadow-sm flex items-center justify-center p-1 relative overflow-hidden"
                    style={{ backgroundColor: skin.secondaryColor }}
                  >
                    <div
                      className="w-4 h-4 rounded-sm"
                      style={{ backgroundColor: skin.primaryColor, boxShadow: `0 0 8px ${skin.coreGlowColor}` }}
                    />
                    <div
                      className="absolute bottom-0 inset-x-0 h-1"
                      style={{ backgroundColor: skin.visorColor }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-white truncate">{skin.name}</span>
                      <span className="text-[10px] font-mono text-cyan-400 px-1 py-0.2 rounded bg-cyan-950/60 border border-cyan-800/60">
                        {skin.theme}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 truncate mt-0.5">{skin.description}</div>
                  </div>

                  {active && <Check className="w-4 h-4 text-fuchsia-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 3: Clock Frequency / Speed */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2.5">
            <Zap className="w-4 h-4 text-amber-400" />
            <label className="text-xs font-mono font-semibold text-amber-400 tracking-wider uppercase">
              // CLOCK FREQUENCY (난이도)
            </label>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {difficulties.map((d) => {
              const active = settings.difficulty === d.id;
              return (
                <button
                  key={d.id}
                  onClick={() => onUpdateSettings({ ...settings, difficulty: d.id })}
                  className={`py-2 px-1 text-center rounded-xl border text-xs font-mono font-semibold transition-all cursor-pointer ${
                    active
                      ? 'border-amber-400 bg-amber-950/40 text-white shadow-[0_0_10px_rgba(251,191,36,0.25)]'
                      : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div>{d.label}</div>
                  <div className="text-[10px] font-normal text-amber-400/80 mt-0.5">{d.speedMs}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 4: System Parameters */}
        <div className="space-y-3 mb-6 bg-slate-950/60 border border-slate-800 rounded-xl p-3.5">
          {/* Wall pass through */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-200">워프 게이트 (Wrap Around)</div>
              <div className="text-[11px] text-slate-400">화면 경계에 도달 시 반대편 좌표로 즉시 전송됩니다.</div>
            </div>
            <button
              onClick={() =>
                onUpdateSettings({ ...settings, wallPassThrough: !settings.wallPassThrough })
              }
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                settings.wallPassThrough ? 'bg-cyan-500 justify-end' : 'bg-slate-700 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-slate-950 shadow-md" />
            </button>
          </div>

          <div className="h-px bg-slate-800/80" />

          {/* Sound toggle */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-200">신디사이저 오디오 (SFX)</div>
              <div className="text-[11px] text-slate-400">코어 흡수, 콤보 및 EMP 펄스 사운드</div>
            </div>
            <button
              onClick={() =>
                onUpdateSettings({ ...settings, soundEnabled: !settings.soundEnabled })
              }
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                settings.soundEnabled ? 'bg-cyan-500 justify-end' : 'bg-slate-700 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-slate-950 shadow-md" />
            </button>
          </div>

          <div className="h-px bg-slate-800/80" />

          {/* D-Pad visibility toggle */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-200">화면 가상 D-Pad 컨트롤러</div>
              <div className="text-[11px] text-slate-400">터치 디스플레이용 방향키 패드 표시</div>
            </div>
            <button
              onClick={() =>
                onUpdateSettings({
                  ...settings,
                  touchControlsVisible: !settings.touchControlsVisible,
                })
              }
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                settings.touchControlsVisible ? 'bg-cyan-500 justify-end' : 'bg-slate-700 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-slate-950 shadow-md" />
            </button>
          </div>
        </div>

        {/* Footer Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-sm tracking-wider uppercase transition-all cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.3)]"
        >
          // 설정 저장 및 프로토콜 복귀
        </button>
      </div>
    </div>
  );
};
