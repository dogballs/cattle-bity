import Texture from './Texture.js';

class TextureLoader {
  load(url = '', onSuccess = () => {}) {
    const texture = new Texture();

    texture.imageElement.onload = () => {
      onSuccess(texture);
    };

    texture.imageElement.src = url;

    return texture;
  }
}

export default TextureLoader;
