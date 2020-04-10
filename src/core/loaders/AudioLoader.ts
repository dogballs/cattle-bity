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
  private readonly loaded: Map<string, Sound> = new Map();
  protected readonly log = new Logger(AudioLoader.name, Logger.Level.None);

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

    if (this.loaded.has(fullPath)) {
      return this.loaded.get(fullPath);
    }

    const audioElement = new Audio();

    const sound = new Sound(audioElement);
    sound.loaded.addListener(() => {
      this.log.debug('Loaded "%s"', fullPath);
    });

    audioElement.preload = 'auto';
    audioElement.src = fullPath;

    this.loaded.set(fullPath, sound);

    return sound;
  }

  public async loadAsync(id: string): Promise<Sound> {
    return new Promise((resolve) => {
      const sound = this.load(id);
      if (sound.isLoaded()) {
        resolve(sound);
      } else {
        sound.loaded.addListener(() => {
          resolve(sound);
        });
      }
    });
  }

  public preloadAll(): void {
    Object.keys(this.manifest).forEach((id) => {
      this.load(id);
    });
  }

  public async preloadAllAsync(): Promise<void> {
    await Promise.all(
      Object.keys(this.manifest).map((id) => {
        return this.loadAsync(id);
      }),
    );
  }

  public getAllLoaded(): Sound[] {
    return Array.from(this.loaded.values());
  }
}
