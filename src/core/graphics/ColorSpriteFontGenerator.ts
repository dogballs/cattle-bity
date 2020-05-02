import { SpriteFontLoader } from '../loaders';
import { SpriteFont } from '../text';

import { Rect } from '../Rect';

import { CanvasImage } from './sources';

interface ColorSpriteFontGeneratorIitem {
  defaultColor: string;
  defaultFont: SpriteFont;
  canvas?: NativeCanvas;
  generatedFonts: Map<string, SpriteFont>;
}

export class ColorSpriteFontGenerator {
  private spriteFontLoader: SpriteFontLoader;
  private map = new Map<string, ColorSpriteFontGeneratorIitem>();

  constructor(spriteFontLoader: SpriteFontLoader) {
    this.spriteFontLoader = spriteFontLoader;
  }

  public get(fontId: string, color: string = null): SpriteFont {
    const item = this.map.get(fontId);
    if (item === undefined) {
      throw new Error(`Font "${fontId}" not registered`);
    }

    const { defaultColor, defaultFont, generatedFonts } = item;

    if (color === null || color === defaultColor) {
      return defaultFont;
    }

    const generatedFont = generatedFonts.get(color);
    if (generatedFont === undefined) {
      throw new Error(`Font "${fontId}" color "${color}" not generated`);
    }

    return generatedFont;
  }

  public register(fontId: string, defaultColor: string): void {
    const defaultFont = this.spriteFontLoader.load(fontId);

    // Initial font is registered by it's default color.
    // Based on this initial font other colors are generated as separate fonts.
    const generatedFonts = new Map<string, SpriteFont>();

    const item = {
      defaultColor,
      defaultFont,
      generatedFonts,
    };

    this.map.set(fontId, item);
  }

  public generate(fontId: string, generatedColor: string): void {
    const item = this.map.get(fontId);
    if (item === undefined) {
      throw new Error(`Font "${fontId}" not registered`);
    }

    const { defaultFont } = item;

    const sourceRect = defaultFont.getImageSourceRect();

    let canvas = item.canvas;

    const isNewCanvas = canvas === undefined;
    if (isNewCanvas) {
      canvas = document.createElement('canvas');
      canvas.width = sourceRect.width;
      canvas.height = sourceRect.height;

      // Keep for debug
      // document.body.appendChild(canvas);

      // Save canvas for following fonts
      item.canvas = canvas;
    }

    const context = canvas.getContext('2d');

    const prevHeight = canvas.height;

    let prevImageData = null;
    if (!isNewCanvas) {
      // Make sure to save all drawings, because we are going to resize the
      // canvas
      prevImageData = context.getImageData(0, 0, canvas.width, canvas.height);

      // Calculate new area taken by all generated fonts on canvas.
      // New generated font will be added at the bottom.
      const prevHeight = canvas.height;
      const nextHeight = prevHeight + sourceRect.height;

      // WARNING: all drawing is erased when canvas is resized.
      // Update canvas size to include area for new generated font
      canvas.height = nextHeight;
    }

    const generatedY = isNewCanvas ? 0 : prevHeight;

    // New generated font area on canvas
    const generatedSourceRect = new Rect(
      0,
      generatedY,
      sourceRect.width,
      sourceRect.height,
    );

    // Draw original image onto canvas
    context.globalCompositeOperation = 'source-over';
    context.drawImage(
      defaultFont.image.getElement(),
      sourceRect.x,
      sourceRect.y,
      sourceRect.width,
      sourceRect.height,
      generatedSourceRect.x,
      generatedSourceRect.y,
      generatedSourceRect.width,
      generatedSourceRect.height,
    );

    // Use composite operation to create colored version of the font
    context.globalCompositeOperation = 'source-in';
    context.fillStyle = generatedColor;
    context.fillRect(
      generatedSourceRect.x,
      generatedSourceRect.y,
      generatedSourceRect.width,
      generatedSourceRect.height,
    );
    context.globalCompositeOperation = 'source-over';

    // Restore previously drawn fonts. Do it after new font is drawn,
    // because composite operations are applied on entire canvas and will
    // screw up existing fonts if they are drawn earlier.
    if (!isNewCanvas) {
      context.putImageData(prevImageData, 0, 0);
    }

    // Use canvas as image source for rendering the font
    const generatedImage = new CanvasImage(canvas);

    // Clone font config to specify location of characters on canvas
    const generatedFontConfig = Object.assign({}, defaultFont.config, {
      offsetX: generatedSourceRect.x,
      offsetY: generatedSourceRect.y,
    });

    const generatedFont = new SpriteFont(
      generatedFontConfig,
      generatedImage,
      defaultFont.options,
    );

    item.generatedFonts.set(generatedColor, generatedFont);
  }
}
