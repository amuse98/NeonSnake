import React, { useEffect, useRef, useState } from 'react';
import { ActiveBuff, Direction, FloatingText, FoodItem, Particle, Position, Skin } from '../types/game';
import { GRID_SIZE } from '../utils/gameConstants';

interface GameBoardProps {
  snake: Position[];
  direction: Direction;
  foodItems: FoodItem[];
  obstacles: Position[];
  skin: Skin;
  activeBuffs: ActiveBuff[];
  particles: Particle[];
  floatingTexts: FloatingText[];
  wallPassThrough: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  onSwipeDirection?: (dir: Direction) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  snake,
  direction,
  foodItems,
  obstacles,
  skin,
  activeBuffs,
  particles,
  floatingTexts,
  wallPassThrough,
  isPaused,
  isGameOver,
  onSwipeDirection,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [boardPixelSize, setBoardPixelSize] = useState<number>(560);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Resize listener
  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const size = Math.min(600, Math.max(280, width));
      setBoardPixelSize(size);
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = boardPixelSize * dpr;
    canvas.height = boardPixelSize * dpr;
    ctx.resetTransform();
    ctx.scale(dpr, dpr);

    const cellSize = boardPixelSize / GRID_SIZE;
    const now = Date.now();

    // 1. Cyberpunk Dark Arena Background
    ctx.fillStyle = '#05070f';
    ctx.fillRect(0, 0, boardPixelSize, boardPixelSize);

    // Subtle dark gradient from center
    const bgGrad = ctx.createRadialGradient(
      boardPixelSize / 2,
      boardPixelSize / 2,
      boardPixelSize * 0.1,
      boardPixelSize / 2,
      boardPixelSize / 2,
      boardPixelSize * 0.7
    );
    bgGrad.addColorStop(0, 'rgba(12, 19, 36, 0.75)');
    bgGrad.addColorStop(1, 'rgba(4, 6, 13, 0.98)');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, boardPixelSize, boardPixelSize);

    // 2. High-Tech Digital Grid Lines
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      const pos = i * cellSize;
      // Highlighting major grid intersections
      const isMajor = i % 4 === 0;
      ctx.strokeStyle = isMajor
        ? 'rgba(0, 240, 255, 0.12)'
        : 'rgba(255, 255, 255, 0.025)';

      ctx.beginPath();
      ctx.moveTo(pos, 0);
      ctx.lineTo(pos, boardPixelSize);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, pos);
      ctx.lineTo(boardPixelSize, pos);
      ctx.stroke();
    }

    // 3. Flowing Cyber Energy Conduits across grid
    const pulseT = (now / 1600) % 1;
    const pulseY = (Math.floor((now / 5000) % GRID_SIZE) + pulseT) * cellSize;
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, pulseY);
    ctx.lineTo(boardPixelSize, pulseY);
    ctx.stroke();

    // 4. Cyber Arena Border & Firewall
    if (!wallPassThrough) {
      // Solid Wall: Red Warning Laser Grid
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 10;
      ctx.strokeRect(2, 2, boardPixelSize - 4, boardPixelSize - 4);
      ctx.shadowBlur = 0;

      // Hazard dashes
      ctx.setLineDash([8, 8]);
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
      ctx.lineWidth = 2;
      ctx.strokeRect(6, 6, boardPixelSize - 12, boardPixelSize - 12);
      ctx.setLineDash([]);
    } else {
      // Pass-Through: Glowing Cyan Tech Frame
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
      ctx.lineWidth = 2;
      ctx.shadowColor = 'rgba(0, 240, 255, 0.5)';
      ctx.shadowBlur = 8;
      ctx.strokeRect(1, 1, boardPixelSize - 2, boardPixelSize - 2);
      ctx.shadowBlur = 0;

      // Chamfered corner brackets
      const bSize = 14;
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 2;
      // Top-Left
      ctx.beginPath();
      ctx.moveTo(1, bSize);
      ctx.lineTo(1, 1);
      ctx.lineTo(bSize, 1);
      ctx.stroke();
      // Top-Right
      ctx.beginPath();
      ctx.moveTo(boardPixelSize - bSize, 1);
      ctx.lineTo(boardPixelSize - 1, 1);
      ctx.lineTo(boardPixelSize - 1, bSize);
      ctx.stroke();
      // Bottom-Left
      ctx.beginPath();
      ctx.moveTo(1, boardPixelSize - bSize);
      ctx.lineTo(1, boardPixelSize - 1);
      ctx.lineTo(bSize, boardPixelSize - 1);
      ctx.stroke();
      // Bottom-Right
      ctx.beginPath();
      ctx.moveTo(boardPixelSize - bSize, boardPixelSize - 1);
      ctx.lineTo(boardPixelSize - 1, boardPixelSize - 1);
      ctx.lineTo(boardPixelSize - 1, boardPixelSize - bSize);
      ctx.stroke();
    }

    // 5. Draw Obstacles (Holographic Laser Pylons)
    obstacles.forEach((obs) => {
      const ox = obs.x * cellSize;
      const oy = obs.y * cellSize;
      const pad = 2;

      ctx.save();
      // Armored Chassis
      ctx.fillStyle = '#090d1a';
      ctx.fillRect(ox + pad, oy + pad, cellSize - pad * 2, cellSize - pad * 2);

      // Neon warning rim
      ctx.strokeStyle = '#ff0055';
      ctx.lineWidth = 1.5;
      ctx.shadowColor = 'rgba(255, 0, 85, 0.8)';
      ctx.shadowBlur = 6;
      ctx.strokeRect(ox + pad, oy + pad, cellSize - pad * 2, cellSize - pad * 2);
      ctx.shadowBlur = 0;

      // Hazard Diagonal Stripe
      ctx.fillStyle = 'rgba(255, 0, 85, 0.2)';
      ctx.beginPath();
      ctx.moveTo(ox + pad, oy + pad);
      ctx.lineTo(ox + cellSize - pad, oy + cellSize - pad);
      ctx.lineTo(ox + cellSize - pad, oy + cellSize - pad - 4);
      ctx.lineTo(ox + pad + 4, oy + pad);
      ctx.closePath();
      ctx.fill();

      // Pulsing red core diode
      const p = (Math.sin(now / 200 + obs.x + obs.y) + 1) * 0.5;
      ctx.fillStyle = `rgba(255, 0, 85, ${0.4 + p * 0.5})`;
      ctx.fillRect(ox + cellSize * 0.35, oy + cellSize * 0.35, cellSize * 0.3, cellSize * 0.3);

      ctx.restore();
    });

    // 6. Draw Food Items (Cyber Hologram Data Cores)
    foodItems.forEach((food) => {
      const fx = (food.x + 0.5) * cellSize;
      const fy = (food.y + 0.5) * cellSize;
      const radius = cellSize * 0.44;
      const rot = (now / 400 + food.x * 2) % (Math.PI * 2);

      ctx.save();
      ctx.translate(fx, fy);

      // Light beam vertical beacon
      const beamGrad = ctx.createLinearGradient(0, -radius * 2, 0, radius * 2);
      beamGrad.addColorStop(0, 'rgba(0, 240, 255, 0)');
      beamGrad.addColorStop(0.5, 'rgba(0, 240, 255, 0.2)');
      beamGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');
      ctx.fillStyle = beamGrad;
      ctx.fillRect(-radius * 0.4, -radius * 2, radius * 0.8, radius * 4);

      switch (food.type) {
        case 'APPLE': {
          // Cyberpunk Data Core (Octahedron Prism)
          const pulse = 1 + Math.sin(now / 150) * 0.08;
          const r = radius * pulse;

          // Outer Neon Hologram Ring
          ctx.strokeStyle = '#00f0ff';
          ctx.lineWidth = 1.5;
          ctx.shadowColor = '#00f0ff';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.ellipse(0, 0, r * 1.3, r * 0.45, rot, 0, Math.PI * 2);
          ctx.stroke();

          // Core Crystal (Diamond / Octahedron)
          ctx.fillStyle = '#06b6d4';
          ctx.beginPath();
          ctx.moveTo(0, -r * 0.95);
          ctx.lineTo(r * 0.75, 0);
          ctx.lineTo(0, r * 0.95);
          ctx.lineTo(-r * 0.75, 0);
          ctx.closePath();
          ctx.fill();

          // Inner High-Voltage White Core
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.moveTo(0, -r * 0.45);
          ctx.lineTo(r * 0.35, 0);
          ctx.lineTo(0, r * 0.45);
          ctx.lineTo(-r * 0.35, 0);
          ctx.closePath();
          ctx.fill();

          // Orbiting micro data particles
          ctx.fillStyle = '#00f0ff';
          const px = Math.cos(rot * 2) * (r * 1.1);
          const py = Math.sin(rot * 2) * (r * 0.4);
          ctx.fillRect(px - 1.5, py - 1.5, 3, 3);
          break;
        }

        case 'GOLDEN_APPLE': {
          // Quantum Singularity Core
          const pulse = 1 + Math.sin(now / 100) * 0.12;
          const r = radius * pulse * 1.1;

          // Multi-layer rotating golden rings
          ctx.strokeStyle = '#facc15';
          ctx.lineWidth = 2;
          ctx.shadowColor = '#facc15';
          ctx.shadowBlur = 14;

          ctx.beginPath();
          ctx.ellipse(0, 0, r * 1.3, r * 0.5, rot, 0, Math.PI * 2);
          ctx.stroke();

          ctx.strokeStyle = '#fbbf24';
          ctx.beginPath();
          ctx.ellipse(0, 0, r * 1.3, r * 0.5, -rot * 1.5, 0, Math.PI * 2);
          ctx.stroke();

          // Glowing plasma core
          const radGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
          radGrad.addColorStop(0, '#ffffff');
          radGrad.addColorStop(0.4, '#fde047');
          radGrad.addColorStop(1, 'rgba(234, 179, 8, 0.1)');
          ctx.fillStyle = radGrad;
          ctx.beginPath();
          ctx.arc(0, 0, r * 0.8, 0, Math.PI * 2);
          ctx.fill();

          // Rotating cross flare
          ctx.fillStyle = '#ffffff';
          ctx.save();
          ctx.rotate(rot);
          ctx.fillRect(-1.5, -r, 3, r * 2);
          ctx.fillRect(-r, -1.5, r * 2, 3);
          ctx.restore();
          break;
        }

        case 'SPEED_CHILI': {
          // Overclock Hyper-Reactor Module
          const r = radius * 1.05;
          ctx.strokeStyle = '#ff0055';
          ctx.lineWidth = 1.8;
          ctx.shadowColor = '#ff0055';
          ctx.shadowBlur = 10;

          // Hexagonal capacitor
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            const x = Math.cos(angle) * r;
            const y = Math.sin(angle) * r;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.fillStyle = '#831843';
          ctx.fill();
          ctx.stroke();

          // Lightning Bolt glyph in center
          ctx.fillStyle = '#fde047';
          ctx.font = `bold ${Math.round(r * 1.2)}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.shadowColor = '#fde047';
          ctx.shadowBlur = 8;
          ctx.fillText('⚡', 0, 0);
          break;
        }

        case 'FREEZE_BERRY': {
          // Cryo EMP Matrix Core
          const r = radius * 1.05;
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 1.8;
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 12;

          // Crystalline Octagon
          ctx.beginPath();
          for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI) / 4 + rot;
            const x = Math.cos(angle) * r;
            const y = Math.sin(angle) * r;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.fillStyle = '#0369a1';
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#e0f2fe';
          ctx.font = `bold ${Math.round(r * 1.1)}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('❄️', 0, 1);
          break;
        }

        case 'DIET_MUSHROOM': {
          // Nanite Trim Decoupler
          const r = radius;
          ctx.strokeStyle = '#c084fc';
          ctx.lineWidth = 1.8;
          ctx.shadowColor = '#c084fc';
          ctx.shadowBlur = 10;

          ctx.fillStyle = '#581c87';
          ctx.beginPath();
          ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#f3e8ff';
          ctx.font = `bold ${Math.round(r * 0.95)}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('✂️', 0, 0);
          break;
        }

        case 'MAGNET': {
          // Graviton Flux Node
          const r = radius * 1.05;
          ctx.strokeStyle = '#a855f7';
          ctx.lineWidth = 2;
          ctx.shadowColor = '#a855f7';
          ctx.shadowBlur = 12;

          // Pulsing magnetic arcs
          const wave = (now / 300) % 1;
          ctx.beginPath();
          ctx.arc(0, 0, r * (0.8 + wave * 0.4), 0, Math.PI * 2);
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.font = `bold ${Math.round(r * 1.1)}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('🧲', 0, 0);
          break;
        }
      }

      ctx.restore();
    });

    // 7. Draw Cyber Snake Exoskeleton
    if (snake.length > 0) {
      const head = snake[0];

      // Draw continuous glowing spinal conduit along whole snake body
      ctx.save();
      ctx.strokeStyle = skin.primaryColor;
      ctx.lineWidth = cellSize * 0.22;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowColor = skin.coreGlowColor;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      snake.forEach((seg, idx) => {
        const sx = (seg.x + 0.5) * cellSize;
        const sy = (seg.y + 0.5) * cellSize;
        if (idx === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      });
      ctx.stroke();
      ctx.restore();

      // Draw Segmented Mecha Armor Plates (Tail to Segment 1)
      for (let i = snake.length - 1; i > 0; i--) {
        const seg = snake[i];
        const sx = (seg.x + 0.5) * cellSize;
        const sy = (seg.y + 0.5) * cellSize;

        // Taper slightly toward tail
        const progress = 1 - (i / snake.length) * 0.35;
        const segSize = (cellSize * 0.44) * progress;

        ctx.save();
        ctx.translate(sx, sy);

        // Wave pulse running down the spine
        const waveOffset = Math.sin((now / 120) - i * 0.45);
        const isPulse = waveOffset > 0.4;

        // Outer Dark Carbon Armor Plate (Rounded Hexagon / Chamfer)
        ctx.fillStyle = skin.secondaryColor;
        ctx.strokeStyle = isPulse ? skin.primaryColor : skin.circuitColor;
        ctx.lineWidth = isPulse ? 2 : 1.2;
        ctx.shadowColor = skin.coreGlowColor;
        ctx.shadowBlur = isPulse ? 8 : 2;

        ctx.beginPath();
        const r = segSize;
        ctx.roundRect(-r, -r, r * 2, r * 2, 4);
        ctx.fill();
        ctx.stroke();

        // Inner glowing core diode
        ctx.fillStyle = isPulse ? '#ffffff' : skin.primaryColor;
        ctx.beginPath();
        ctx.arc(0, 0, segSize * 0.4, 0, Math.PI * 2);
        ctx.fill();

        // Tail thruster particle emitter at the very last segment
        if (i === snake.length - 1) {
          ctx.fillStyle = skin.particleColor;
          ctx.shadowColor = skin.particleColor;
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(0, 0, segSize * 0.28, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      // Draw Mecha Cyber Head
      const hx = (head.x + 0.5) * cellSize;
      const hy = (head.y + 0.5) * cellSize;
      const headSize = cellSize * 0.48;

      ctx.save();
      ctx.translate(hx, hy);

      // Orientation angle
      let angle = 0;
      if (direction === 'UP') angle = -Math.PI / 2;
      else if (direction === 'DOWN') angle = Math.PI / 2;
      else if (direction === 'LEFT') angle = Math.PI;
      else if (direction === 'RIGHT') angle = 0;

      ctx.rotate(angle);

      // Forward Scanner Volumetric Laser Cones
      const scanPulse = (Math.sin(now / 120) + 1) * 0.5;
      const coneGrad = ctx.createRadialGradient(
        headSize * 0.6,
        0,
        2,
        headSize * 1.8,
        0,
        headSize * 2.2
      );
      coneGrad.addColorStop(0, `rgba(0, 240, 255, ${0.4 + scanPulse * 0.3})`);
      coneGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');
      ctx.fillStyle = coneGrad;
      ctx.beginPath();
      ctx.moveTo(headSize * 0.5, -headSize * 0.35);
      ctx.lineTo(headSize * 2.4, -headSize * 1.1);
      ctx.lineTo(headSize * 2.4, headSize * 1.1);
      ctx.lineTo(headSize * 0.5, headSize * 0.35);
      ctx.closePath();
      ctx.fill();

      // Forward Laser Data Probe (Cyber Tongue)
      const tongueFlick = (now / 220) % 1;
      if (tongueFlick < 0.6) {
        ctx.strokeStyle = skin.visorColor;
        ctx.lineWidth = 2.2;
        ctx.shadowColor = skin.visorColor;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(headSize * 0.8, 0);
        ctx.lineTo(headSize * 1.5, 0);
        // Split laser fork
        ctx.lineTo(headSize * 1.7, -headSize * 0.22);
        ctx.moveTo(headSize * 1.5, 0);
        ctx.lineTo(headSize * 1.7, headSize * 0.22);
        ctx.stroke();
      }

      // Armored Aerodynamic Mecha Cockpit (Head Hull)
      ctx.fillStyle = skin.secondaryColor;
      ctx.strokeStyle = skin.primaryColor;
      ctx.lineWidth = 2;
      ctx.shadowColor = skin.coreGlowColor;
      ctx.shadowBlur = 14;

      ctx.beginPath();
      ctx.moveTo(-headSize * 0.8, -headSize * 0.7);
      ctx.lineTo(headSize * 0.4, -headSize * 0.65);
      ctx.lineTo(headSize * 0.9, 0);
      ctx.lineTo(headSize * 0.4, headSize * 0.65);
      ctx.lineTo(-headSize * 0.8, headSize * 0.7);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Glowing Cyber Visor Optical Band
      ctx.fillStyle = skin.visorColor;
      ctx.shadowColor = skin.visorColor;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(headSize * 0.25, -headSize * 0.48);
      ctx.lineTo(headSize * 0.75, 0);
      ctx.lineTo(headSize * 0.25, headSize * 0.48);
      ctx.lineTo(headSize * 0.12, 0);
      ctx.closePath();
      ctx.fill();

      // Twin Laser Reticle Optics
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(headSize * 0.38, -headSize * 0.24, 2, 0, Math.PI * 2);
      ctx.arc(headSize * 0.38, headSize * 0.24, 2, 0, Math.PI * 2);
      ctx.fill();

      // Dorsal Cyber Exhaust vents on head
      ctx.fillStyle = skin.primaryColor;
      ctx.fillRect(-headSize * 0.5, -headSize * 0.4, headSize * 0.35, 2);
      ctx.fillRect(-headSize * 0.5, headSize * 0.4 - 2, headSize * 0.35, 2);

      ctx.restore();
    }

    // 8. Draw Cyber Particles (Sparklers & Thruster Sparks)
    particles.forEach((p) => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // 9. Floating Cyber Text (+100 PTS [OVERCLOCK])
    floatingTexts.forEach((ft) => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, ft.alpha);
      ctx.fillStyle = ft.color;
      ctx.font = `bold ${Math.round(14 * ft.scale)}px 'Outfit', monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = ft.color;
      ctx.shadowBlur = 8;
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    });

    // 10. Pause Overlay (Cyber Hologram Lockout)
    if (isPaused && !isGameOver) {
      ctx.fillStyle = 'rgba(5, 7, 15, 0.75)';
      ctx.fillRect(0, 0, boardPixelSize, boardPixelSize);

      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(boardPixelSize * 0.15, boardPixelSize * 0.35, boardPixelSize * 0.7, boardPixelSize * 0.3);

      ctx.fillStyle = '#00f0ff';
      ctx.font = '800 24px "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 10;
      ctx.fillText('// 시스템 일시 정지 //', boardPixelSize / 2, boardPixelSize / 2 - 12);
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#94a3b8';
      ctx.font = '500 12px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('SPACE 또는 화면을 탭하여 프로토콜 재개', boardPixelSize / 2, boardPixelSize / 2 + 18);
    }
  }, [
    snake,
    direction,
    foodItems,
    obstacles,
    skin,
    activeBuffs,
    particles,
    floatingTexts,
    wallPassThrough,
    isPaused,
    isGameOver,
    boardPixelSize,
  ]);

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || !onSwipeDirection) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (Math.max(absX, absY) > 25) {
      if (absX > absY) {
        onSwipeDirection(dx > 0 ? 'RIGHT' : 'LEFT');
      } else {
        onSwipeDirection(dy > 0 ? 'DOWN' : 'UP');
      }
    }
    touchStartRef.current = null;
  };

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center w-full max-w-[560px] aspect-square rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,240,255,0.15)] border border-cyan-500/40 bg-slate-950 p-1 select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Cyber Corner Decals */}
      <div className="absolute top-2 left-2 z-10 pointer-events-none text-[9px] font-mono text-cyan-500/70 tracking-widest uppercase">
        SYS.VIPER // SECTOR 24x24
      </div>
      <div className="absolute top-2 right-2 z-10 pointer-events-none text-[9px] font-mono text-cyan-500/70 tracking-widest uppercase">
        {wallPassThrough ? 'WARP: ONLINE' : 'WARP: RESTRICTED'}
      </div>

      <canvas
        ref={canvasRef}
        style={{ width: `${boardPixelSize}px`, height: `${boardPixelSize}px` }}
        className="rounded-xl block touch-none"
      />
    </div>
  );
};
