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

  private play(soundName: string): void {
    player.play(`${SoundService.soundsPath}${soundName}`, (err: Error): void => {
      if (err) throw err;
    });
  }
}
