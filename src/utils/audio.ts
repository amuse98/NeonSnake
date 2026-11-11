// Web Audio API Synthesizer for Arcade Sound FX

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Soft tone generator
  private playTone(freq: number, type: OscillatorType, duration: number, gainVal: number = 0.15, pitchBend?: { target: number; time: number }) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      if (pitchBend) {
        osc.frequency.exponentialRampToValueAtTime(
          Math.max(20, pitchBend.target),
          this.ctx.currentTime + pitchBend.time
        );
      }

      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio autoplay policy or silent catch
    }
  }

  // Data Core Absorb (Laser chime)
  public playEat() {
    this.playTone(587.33, 'sawtooth', 0.08, 0.12, { target: 1174.66, time: 0.07 });
  }

  // Hyper Quantum Core (Synth arpeggio)
  public playSpecialEat() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const notes = [659.25, 880, 1046.5, 1318.51, 1760];
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          this.playTone(freq, 'sine', 0.14, 0.15);
        }, idx * 40);
      });
    } catch {}
  }

  // Combo Overdrive (rising resonant pulse)
  public playCombo(comboCount: number) {
    const baseFreq = 520;
    const step = Math.min(comboCount, 10) * 65;
    this.playTone(baseFreq + step, 'sawtooth', 0.1, 0.13, { target: baseFreq + step + 220, time: 0.08 });
  }

  // Overclock Speed Boost
  public playSpeedUp() {
    this.playTone(220, 'sawtooth', 0.25, 0.14, { target: 1200, time: 0.2 });
  }

  // Cryo EMP Freeze
  public playFreeze() {
    if (this.isMuted) return;
    const notes = [1046.5, 987.77, 880, 659.25];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'sine', 0.18, 0.12);
      }, idx * 50);
    });
  }

  // Nanite Decoupler Trim
  public playShrink() {
    this.playTone(880, 'square', 0.14, 0.09, { target: 260, time: 0.12 });
  }

  // Cybernetic Micro-Turn Tap
  public playTurn() {
    this.playTone(320, 'triangle', 0.025, 0.04);
  }

  // Cyber Crash & EMP Shutdown (Low Sub-Bass Explosion)
  public playGameOver() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      // Sub bass hit
      this.playTone(180, 'sawtooth', 0.45, 0.22, { target: 40, time: 0.4 });
      setTimeout(() => {
        this.playTone(90, 'triangle', 0.5, 0.2, { target: 25, time: 0.5 });
      }, 100);
    } catch {}
  }

  // High Score Cyber Fanfare
  public playHighScore() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const fanfare = [523.25, 659.25, 783.99, 1046.5, 1567.98];
      fanfare.forEach((freq, idx) => {
        setTimeout(() => {
          this.playTone(freq, 'sawtooth', 0.22, 0.16);
        }, idx * 70);
      });
    } catch {}
  }
}

export const soundManager = new SoundManager();
