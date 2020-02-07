import { AudioSource } from './AudioSource';
import { Logger } from './Logger';

export class AudioLoader {
  public static cache: Map<string, AudioSource> = new Map();

  protected static log = new Logger('AudioLoader');

  public static load(src: string): AudioSource {
    if (this.cache.has(src)) {
      return this.cache.get(src);
    }

    const audioElement = new Audio();
    audioElement.preload = 'auto';
    audioElement.addEventListener('loadeddata', () => {
      this.log.debug('Loaded "%s"', src);
    });
    audioElement.src = src;

    const source = new AudioSource(audioElement);

    this.cache.set(src, source);

    return source;
  }
}
