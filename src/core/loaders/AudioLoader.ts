import { Logger } from '../Logger';
import { Sound } from '../Sound';
import { Subject } from '../Subject';

interface AudioManifestItem {
  file: string;
}

interface AudioManifest {
  [id: string]: AudioManifestItem;
}

export class AudioLoader {
  public loaded = new Subject<Sound>();
  private manifest: AudioManifest;
  private readonly sounds: Map<string, Sound> = new Map();
  protected readonly log = new Logger(AudioLoader.name, Logger.Level.None);

  constructor(manifest: AudioManifest) {
    this.manifest = manifest;
  }

  public load(id: string): Sound {
    const item = this.manifest[id];
    if (item === undefined) {
      throw new Error(`Invalid audio id = "${id}"`);
    }

    const { file: filePath } = item;

    if (this.sounds.has(filePath)) {
      return this.sounds.get(filePath);
    }

    const audioElement = new Audio();

    const sound = new Sound(audioElement);
    sound.loaded.addListener(() => {
      this.log.debug('Loaded "%s"', filePath);
      this.loaded.notify(sound);
    });

    audioElement.preload = 'auto';
    audioElement.src = filePath;

    this.sounds.set(filePath, sound);

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
    return Array.from(this.sounds.values());
  }
}
