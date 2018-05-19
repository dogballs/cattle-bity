import Texture from './Texture.js';

class TextureLoader {
  load(url = '', onSuccess = () => {}) {
    const imageElement = new window.Image();

    imageElement.onload = () => {
      const texture = new Texture(imageElement);

      onSuccess(texture);
    };

    imageElement.src = url;
  }
}

export default TextureLoader;
