import Scene from '../core/Scene.js';
import Block from '../models/block/Block.js';

class MapBuilder {
    constructor(scene) {
        this.scene = scene;
    }

    buildMap(map) {
        if (map && map.blocks) {
            map.blocks.forEach(block => {
                this.scene.add(new Block(block.width, block.height, block.x, block.y));
              });
        }
    }
}

export default MapBuilder;