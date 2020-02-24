import { Sound } from '../Sound';
import { Logger } from '../Logger';

import { PathUtils } from '../utils';

interface AudioManifestItem {
  file: string;
}

interface AudioManifest {
  [id: string]: AudioManifestItem;
}

export class AudioLoader {
  private manifest: AudioManifest;
  private basePath = '';
  private readonly cache: Map<string, Sound> = new Map();
  protected readonly log = new Logger(AudioLoader.name, Logger.Level.Debug);

  constructor(manifest: AudioManifest, basePath = '') {
    this.manifest = manifest;
    this.basePath = basePath;
  }

  public load(id: string): Sound {
    const item = this.manifest[id];
    if (item === undefined) {
      throw new Error(`Invalid audio id = "${id}"`);
    }

    const { file: fileName } = item;
    const fullPath = PathUtils.join(this.basePath, fileName);

    if (this.cache.has(fullPath)) {
      return this.cache.get(fullPath);
    }

    const audioElement = new Audio();
    audioElement.preload = 'auto';
    audioElement.addEventListener('loadeddata', () => {
      this.log.debug('Loaded "%s"', fullPath);
    });
    audioElement.src = fullPath;

    const sound = new Sound(audioElement);

    this.cache.set(fullPath, sound);

    return sound;
  }

  public preloadAll(): void {
    Object.keys(this.manifest).forEach((id) => {
      this.load(id);
    });
  }

  public pauseAll(): void {
    const sounds = this.getAllLoaded();
    sounds.forEach((sound) => {
      sound.pause();
    });
  }

  public resumeAll(): void {
    const sounds = this.getAllLoaded();
    sounds.forEach((sound) => {
      if (sound.canResume()) {
        sound.resume();
      }
    });
  }

  private getAllLoaded(): Sound[] {
    return Array.from(this.cache.values());
  }
}
