/**
 * Synthesized keyboard sounds using browser Web Audio API.
 * Multiple mechanical switch sound profiles without external audio files!
 */

import { SoundProfile } from '../types/typing';

class SoundEffects {
  private ctx: AudioContext | null = null;
  private profile: SoundProfile = 'clicky';
  private volume: number = 0.8;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setProfile(profile: SoundProfile) {
    this.profile = profile;
  }

  public getProfile(): SoundProfile {
    return this.profile;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public getVolume(): number {
    return this.volume;
  }

  public setEnabled(enabled: boolean) {
    this.profile = enabled ? (this.profile === 'off' ? 'clicky' : this.profile) : 'off';
  }

  public getEnabled(): boolean {
    return this.profile !== 'off';
  }

  public playClick() {
    if (this.profile === 'off' || this.volume <= 0) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      if (this.profile === 'thock') {
        // Deep tactile switch thock sound
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(280, now);
        osc.frequency.exponentialRampToValueAtTime(70, now + 0.05);

        gain.gain.setValueAtTime(0.2 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.055);
      } else if (this.profile === 'bubble') {
        // Gentle bubble pop
        osc.type = 'sine';
        osc.frequency.setValueAtTime(420, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.035);

        gain.gain.setValueAtTime(0.12 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.04);
      } else {
        // Clicky (Blue switch crisp click)
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(750, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.035);

        gain.gain.setValueAtTime(0.12 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.04);
      }
    } catch {
      // Audio playback fails gracefully if blocked
    }
  }

  public playError() {
    if (this.profile === 'off' || this.volume <= 0) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.linearRampToValueAtTime(110, now + 0.1);

      gain.gain.setValueAtTime(0.16 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.11);
    } catch {
      // Audio playback fails gracefully
    }
  }

  public playComplete() {
    if (this.profile === 'off' || this.volume <= 0) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.09);

        gain.gain.setValueAtTime(0.14 * this.volume, now + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 0.23);
      });
    } catch {
      // Audio playback fails gracefully
    }
  }
}

export const soundManager = new SoundEffects();
