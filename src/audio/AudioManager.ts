import { AudioLoader, AudioSource } from '../core';
import { PathUtils } from '../utils';
import { AUDIO_BASE_PATH } from '../config';

import config from './audio.config';

// TODO: refactor, used as a singleton

export class AudioManager {
  public static load(id: string): AudioSource {
    const audioConfig = config[id];
    if (audioConfig === undefined) {
      throw new Error(`Invalid audio id = "${id}"`);
    }

    const audioName = audioConfig;
    const audioPath = PathUtils.join(AUDIO_BASE_PATH, audioName);

    const audioSource = AudioLoader.load(audioPath);

    return audioSource;
  }

  public static preloadAll(): void {
    Object.keys(config).forEach((id) => {
      this.load(id);
    });
  }

  public static pauseAll(): void {
    const audioSources = this.getAllLoaded();
    audioSources.forEach((audio) => {
      audio.pause();
    });
  }

  public static resumeAll(): void {
    const audioSources = this.getAllLoaded();
    audioSources.forEach((audio) => {
      if (audio.canResume()) {
        audio.resume();
      }
    });
  }

  private static getAllLoaded(): AudioSource[] {
    return Array.from(AudioLoader.cache.values());
  }
}
