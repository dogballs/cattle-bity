import { GameLoop, GameObject, GameRenderer, KeyboardInput } from './core';
import { Border, EditorBrush, EditorBrushType } from './gameObjects';
import { MapConfig } from './map';
import { TerrainType } from './terrain';
import * as config from './config';

const gameRenderer = new GameRenderer({
  debug: true,
  height: config.CANVAS_HEIGHT,
  width: config.CANVAS_WIDTH,
});
document.body.appendChild(gameRenderer.domElement);

const input = new KeyboardInput();
input.listen();

const scene = new GameObject();

scene.add(new Border());

const field = new GameObject(config.FIELD_SIZE, config.FIELD_SIZE);
field.position.set(config.BORDER_LEFT_WIDTH, config.BORDER_TOP_BOTTOM_HEIGHT);
scene.add(field);

const mapDto: MapConfig = {
  terrain: {
    regions: [],
  },
};

const brush = new EditorBrush();
brush.draw.addListener((event) => {
  console.log(event);

  const rect = event.box.toRect();

  // TODO: check if coordinates are already taken?

  if (event.brushType === EditorBrushType.BrickWall) {
    mapDto.terrain.regions.push({
      type: TerrainType.Brick,
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
    });
  }
});
field.add(brush);

const gameLoop = new GameLoop({
  onTick: (): void => {
    input.update();

    // TODO
    // const { walls } = MapFactory.create(mapConfig);

    // const nodes = [...walls, brush];
    const nodes = [brush];

    nodes.forEach((node) => {
      node.update({ input });
    });

    field.clear();
    field.add(...nodes);

    gameRenderer.render(scene);
  },
});

gameLoop.start();

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
window.gameLoop = gameLoop;
