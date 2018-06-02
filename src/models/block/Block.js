import DisplayObject from '../../core/DisplayObject.js';
import Sprite from '../../core/Sprite.js';
import Texture from '../../core/Texture.js';

class Block extends DisplayObject {
    constructor(width, height, x, y) {
        super(width, height);

        this.position.x = x;
        this.position.y = y;
        this.texture = new Texture('images/sprite.png');
        this.sprite = new Sprite(this.texture, { x: 257, y: 1, w: 13, h: 13 });
        
        // TODO: think about necessary properties for different block types
    }
}

export default Block;