import React from 'react';
import { X, HelpCircle, Keyboard, Smartphone, Sparkles, Flame } from 'lucide-react';

interface HelpModalProps {
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  const items = [
    {
      icon: '💎',
      name: '데이터 코어 (Standard Core)',
      points: '+10 PTS',
      desc: '기체의 외골격 모듈이 1칸 확장되며 기본 연산 점수를 획득합니다.',
    },
    {
      icon: '🌟',
      name: '퀀텀 싱귤래리티 코어 (Quantum Core)',
      points: '+50 PTS & OVERDRIVE +2',
      desc: '희귀 홀로그램 코어로 고득점과 오버드라이브 게이지를 대폭 충전합니다.',
    },
    {
      icon: '⚡',
      name: '오버클럭 리액터 (Overclock Reactor)',
      points: '+20 PTS & 6s 2X BOOST',
      desc: '6초간 추진기가 가속되며 모든 코어 획득 점수가 2배로 증폭됩니다.',
    },
    {
      icon: '❄️',
      name: '크라이오 EMP 노드 (Cryo EMP)',
      points: '+15 PTS & 7s SLOW-MO',
      desc: '7초간 극저온 냉각 펄스를 가동하여 초정밀 감속 조작이 가능해집니다.',
    },
    {
      icon: '✂️',
      name: '나노 트림 디커플러 (Nanite Trim)',
      points: '+25 PTS & LENGTH -2',
      desc: '꼬리 모듈을 2칸 나노 분해하여 협소한 코스에서의 충돌 위험을 줄입니다.',
    },
    {
      icon: '🧲',
      name: '그래비톤 플럭스 (Graviton Flux)',
      points: '+20 PTS & 5s PULL',
      desc: '5초 동안 반경 4타일 이내의 데이터 코어를 머리 센서로 끌어당깁니다.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-slate-900 border border-purple-500/40 rounded-2xl p-6 shadow-[0_0_35px_rgba(168,85,247,0.15)] flex flex-col text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-purple-400" />
            <h2 className="font-display text-lg font-bold text-white tracking-wide">
              PROTOCOL GUIDE // 가이드 & 코어 도감
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2.5">
            <Keyboard className="w-4 h-4 text-cyan-400" />
            <label className="text-xs font-mono font-semibold text-cyan-400 tracking-wider uppercase">
              // CONTROL PROTOCOLS
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
            <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-xl">
              <div className="font-bold text-cyan-300 mb-1 flex items-center gap-1.5">
                <span>⌨️ 터미널 키보드</span>
              </div>
              <ul className="text-slate-400 space-y-1 text-[11px]">
                <li><strong className="text-slate-200">[방향키]</strong> 또는 <strong className="text-slate-200">[W A S D]</strong>: 비행 추진</li>
                <li><strong className="text-slate-200">[SPACE]</strong>: 시스템 일시정지</li>
                <li><strong className="text-slate-200">[R]</strong>: 핫 리부트 (재시작)</li>
              </ul>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-xl">
              <div className="font-bold text-cyan-300 mb-1 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span>모바일 / 터치 HUD</span>
              </div>
              <ul className="text-slate-400 space-y-1 text-[11px]">
                <li>화면 하단 <strong className="text-slate-200">가상 D-Pad</strong> 터치</li>
                <li>캔버스 화면 직접 <strong className="text-slate-200">스와이프</strong></li>
                <li>화면 탭으로 일시정지 해제 가능</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Combo Strategy Tip */}
        <div className="mb-6 bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-cyan-500/10 border border-amber-500/30 rounded-xl p-3.5">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 mb-1">
            <Flame className="w-4 h-4 text-rose-500" />
            <span>오버드라이브 시스템 (OVERDRIVE COMBO)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            데이터 코어를 연속으로 빠르게 수집하면 오버드라이브 게이지가 점등되며 <strong className="text-amber-300 font-bold">최대 5배(x5)</strong>의 배율 점수를 부여합니다! 게이지가 방전되기 전에 다음 코어를 흡수하세요.
          </p>
        </div>

        {/* Special Food & Items */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2.5">
            <Sparkles className="w-4 h-4 text-fuchsia-400" />
            <label className="text-xs font-mono font-semibold text-fuchsia-400 tracking-wider uppercase">
              // DATA CORE MATRIX (특수 코어 목록)
            </label>
          </div>

          <div className="space-y-2">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-950/60 border border-slate-800/80 p-2.5 rounded-xl flex items-center gap-3"
              >
                <div className="text-2xl w-8 h-8 flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">{item.name}</span>
                    <span className="text-[11px] font-mono font-bold text-cyan-400">
                      {item.points}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold text-xs tracking-wider uppercase transition-all cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.3)]"
        >
          // 가이드 확인 완료
        </button>
      </div>
    </div>
  );
};
