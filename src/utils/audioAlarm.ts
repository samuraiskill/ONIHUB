class AudioEngine {
  private ctx: AudioContext | null = null;
  private sirenInterval: any = null;
  private isMuted: boolean = false;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
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
    if (muted) {
      this.stopAlarm();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public playScanBeep(frequency = 880, duration = 0.08) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio Context playback ignored", e);
    }
  }

  public playAuthSuccess() {
    if (this.isMuted) return;
    this.playScanBeep(523.25, 0.1); // C5
    setTimeout(() => this.playScanBeep(659.25, 0.1), 100); // E5
    setTimeout(() => this.playScanBeep(783.99, 0.2), 200); // G5
  }

  public playAuthFailure() {
    if (this.isMuted) return;
    this.playScanBeep(300, 0.2);
    setTimeout(() => this.playScanBeep(220, 0.3), 150);
  }

  public startBreachAlarm() {
    if (this.isMuted || this.sirenInterval) return;
    this.initCtx();
    if (!this.ctx) return;

    let high = false;
    const playFreq = () => {
      if (this.isMuted || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(high ? 950 : 650, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.35);

        high = !high;
      } catch (e) {
        console.warn("Alarm audio exception", e);
      }
    };

    playFreq();
    this.sirenInterval = setInterval(playFreq, 400);
  }

  public stopAlarm() {
    if (this.sirenInterval) {
      clearInterval(this.sirenInterval);
      this.sirenInterval = null;
    }
  }
}

export const audioEngine = new AudioEngine();
