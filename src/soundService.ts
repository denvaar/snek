import { ChildProcess } from 'child_process';

const player = require('play-sound')({});

export default class SoundService {
  private static instance: SoundService;
  public static readonly soundsPath = './assets/sounds/';

  private constructor() {}

  public static getInstance(): SoundService {
    if (!SoundService.instance) {
      SoundService.instance = new SoundService();
    }
    return SoundService.instance;
  }

  public playCoinSound(): void {
    this.play('coin.wav');
  }

  public playImpactSound(): void {
    this.play('impact.wav');
  }

  public playBackgroundSound(): ChildProcess {
    return this.play('background.mp3');
  }

  private play(soundName: string): ChildProcess {
    return player.play(`${SoundService.soundsPath}${soundName}`, (err: Error): void => {
      if (err) throw err;
    });
  }
}
