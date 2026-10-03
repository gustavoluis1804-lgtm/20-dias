// Utilidade para sintetizar áudio ambiente acolhedor e seguro via Web Audio API (caso não haja mp3)
// e também tocar efeitos sonoros discretos de carinho/descoberta.

class SoundManager {
  private ctx: AudioContext | null = null;
  private ambientGain: GainNode | null = null;
  private isAmbientPlaying = false;
  private timer: number | null = null;

  private init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // Toca um acorde etéreo/delicado (celesta / piano suave)
  playChime() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Tríade suave em Lá maior / Mi pentatônica (afinação doce)
      const freqs = [587.33, 739.99, 880.0, 1174.66]; // D5, F#5, A5, D6
      freqs.forEach((f, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.07);

        gain.gain.setValueAtTime(0.0001, now + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.08 / (i + 1), now + i * 0.07 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.00001, now + i * 0.07 + 1.6);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + i * 0.07);
        osc.stop(now + i * 0.07 + 1.7);
      });
    } catch {
      // silencioso se bloqueado
    }
  }

  // Toca um toque suave de porta se abrindo / entrar
  playEnter() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.8);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.04, now + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.00001, now + 1.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 1.3);
    } catch {}
  }

  // Trilha sintética ambiente suave (warm ambient pads gerados em tempo real)
  startAmbient() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.isAmbientPlaying) return;
      this.isAmbientPlaying = true;

      const master = this.ctx.createGain();
      master.gain.setValueAtTime(0.0001, this.ctx.currentTime);
      master.gain.linearRampToValueAtTime(0.045, this.ctx.currentTime + 3);
      master.connect(this.ctx.destination);
      this.ambientGain = master;

      const notes = [220, 277.18, 329.63, 440, 554.37, 659.25]; // A major pad

      const playPuff = () => {
        if (!this.isAmbientPlaying || !this.ctx || !this.ambientGain) return;
        const note = notes[Math.floor(Math.random() * notes.length)];
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(note, this.ctx.currentTime);

        const now = this.ctx.currentTime;
        const dur = 4 + Math.random() * 3;
        g.gain.setValueAtTime(0.00001, now);
        g.gain.linearRampToValueAtTime(0.02, now + dur * 0.4);
        g.gain.linearRampToValueAtTime(0.00001, now + dur);

        osc.connect(g);
        g.connect(this.ambientGain);

        osc.start(now);
        osc.stop(now + dur + 0.1);

        this.timer = window.setTimeout(playPuff, 2000 + Math.random() * 2000);
      };

      playPuff();
    } catch {}
  }

  stopAmbient() {
    this.isAmbientPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.ambientGain && this.ctx) {
      try {
        this.ambientGain.gain.linearRampToValueAtTime(0.00001, this.ctx.currentTime + 1.5);
      } catch {}
    }
  }

  toggleAmbient(): boolean {
    if (this.isAmbientPlaying) {
      this.stopAmbient();
      return false;
    } else {
      this.startAmbient();
      return true;
    }
  }

  isPlaying(): boolean {
    return this.isAmbientPlaying;
  }
}

export const sounds = new SoundManager();
