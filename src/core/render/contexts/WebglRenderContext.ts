import { ImageSource } from '../../graphics';

import { Matrix4 } from '../../Matrix4';
import { Rect } from '../../Rect';

import { RenderContext } from '../RenderContext';

const vertexShaderSource = `
attribute vec4 a_position;
attribute vec2 a_texcoord;

uniform mat4 u_matrix;
uniform mat4 u_textureMatrix;

varying vec2 v_texcoord;

void main() {
  gl_Position = u_matrix * a_position;
  v_texcoord = (u_textureMatrix * vec4(a_texcoord, 0, 1)).xy;;
}
`;

const fragmentShaderSource = `
precision mediump float;

uniform sampler2D u_texture;

varying vec2 v_texcoord;

void main() {
  gl_FragColor = texture2D(u_texture, v_texcoord);
}
`;

export class WebglRenderContext extends RenderContext {
  private gl: WebGLRenderingContext;
  private program: WebGLProgram;
  private positionAttributeLocation: number;
  private texcoordAttributeLocation: number;
  private matrixUniformLocation: WebGLUniformLocation;
  private textureUniformLocation: WebGLUniformLocation;
  private textureMatruxUniformLocation: WebGLUniformLocation;
  private resolutionUniformLocation: WebGLUniformLocation;
  private positionBuffer: WebGLBuffer;
  private texcoordBuffer: WebGLBuffer;
  private textureMap = new Map<HTMLImageElement, WebGLTexture>();

  public clear(): void {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }

  public clearRect(): void {
    return undefined;
  }

  public init(): void {
    this.gl = this.canvas.getContext('webgl');
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.gl.clearColor(0, 0, 0, 0);

    const vertexShader = this.createShader(
      this.gl.VERTEX_SHADER,
      vertexShaderSource,
    );
    const fragmentShader = this.createShader(
      this.gl.FRAGMENT_SHADER,
      fragmentShaderSource,
    );

    this.program = this.createProgram(vertexShader, fragmentShader);

    this.positionAttributeLocation = this.gl.getAttribLocation(
      this.program,
      'a_position',
    );
    this.texcoordAttributeLocation = this.gl.getAttribLocation(
      this.program,
      'a_texcoord',
    );

    this.matrixUniformLocation = this.gl.getUniformLocation(
      this.program,
      'u_matrix',
    );
    // this.resolutionUniformLocation = this.gl.getUniformLocation(
    //   this.program,
    //   'u_resolution',
    // );
    this.textureUniformLocation = this.gl.getUniformLocation(
      this.program,
      'u_texture',
    );
    this.textureMatruxUniformLocation = this.gl.getUniformLocation(
      this.program,
      'u_textureMatrix',
    );

    this.positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    const positions = [0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1];
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(positions),
      this.gl.STATIC_DRAW,
    );
    // this.setRectangle(0, 0, 1600, 1024);

    // const positions = [0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1];
    // this.gl.bufferData(
    //   this.gl.ARRAY_BUFFER,
    //   new Float32Array(positions),
    //   this.gl.STATIC_DRAW,
    // );

    this.texcoordBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texcoordBuffer);

    // const texcoords = [0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1];
    const texcoords = [0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1];
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(texcoords),
      this.gl.STATIC_DRAW,
    );

    // const positions = [10, 20, 80, 20, 10, 30, 10, 30, 80, 20, 80, 30];

    // this.gl.bufferData(
    //   this.gl.ARRAY_BUFFER,
    //   new Float32Array(positions),
    //   this.gl.STATIC_DRAW,
    // );
  }

  public drawImage(
    image: ImageSource,
    sourceRect: Rect,
    destinationRect: Rect,
  ): void {
    // console.log(image, sourceRect, destinationRect);

    const imageElement = image.getElement() as HTMLImageElement;

    let texture;
    if (this.textureMap.has(imageElement)) {
      texture = this.textureMap.get(imageElement);
    } else {
      texture = this.gl.createTexture();
      this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
      this.gl.texImage2D(
        this.gl.TEXTURE_2D,
        0,
        this.gl.RGBA,
        this.gl.RGBA,
        this.gl.UNSIGNED_BYTE,
        imageElement,
      );
      this.gl.texParameteri(
        this.gl.TEXTURE_2D,
        this.gl.TEXTURE_WRAP_S,
        this.gl.CLAMP_TO_EDGE,
      );
      this.gl.texParameteri(
        this.gl.TEXTURE_2D,
        this.gl.TEXTURE_WRAP_T,
        this.gl.CLAMP_TO_EDGE,
      );
      this.gl.texParameteri(
        this.gl.TEXTURE_2D,
        this.gl.TEXTURE_MIN_FILTER,
        this.gl.LINEAR,
      );
      this.textureMap.set(imageElement, texture);
    }

    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

    this.gl.useProgram(this.program);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    this.gl.enableVertexAttribArray(this.positionAttributeLocation);
    this.gl.vertexAttribPointer(
      this.positionAttributeLocation,
      2,
      this.gl.FLOAT,
      false,
      0,
      0,
    );

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texcoordBuffer);
    this.gl.enableVertexAttribArray(this.texcoordAttributeLocation);
    this.gl.vertexAttribPointer(
      this.texcoordAttributeLocation,
      2,
      this.gl.FLOAT,
      false,
      0,
      0,
    );

    // this.gl.uniform2f(
    //   this.resolutionUniformLocation,
    //   this.gl.canvas.width,
    //   this.gl.canvas.height,
    // );

    // const matrix = Matrix4.createOrthographic(
    //   0,
    //   this.gl.canvas.width,
    //   this.gl.canvas.height,
    //   0,
    //   -1,
    //   1,
    // );

    const matrix = Matrix4.createProjection(
      this.gl.canvas.width,
      this.gl.canvas.height,
      1,
    );
    matrix.translate(destinationRect.x, destinationRect.y, 0);
    matrix.scale(destinationRect.width, destinationRect.height, 1);

    this.gl.uniformMatrix4fv(
      this.matrixUniformLocation,
      false,
      matrix.elements,
    );

    const textureMatrix = Matrix4.createTranslation(
      sourceRect.x / imageElement.naturalWidth,
      sourceRect.y / imageElement.naturalHeight,
      0,
    );
    textureMatrix.scale(
      sourceRect.width / imageElement.naturalWidth,
      sourceRect.height / imageElement.naturalHeight,
      1,
    );

    this.gl.uniformMatrix4fv(
      this.textureMatruxUniformLocation,
      false,
      textureMatrix.elements,
    );

    // this.gl.uniform1i(this.textureUniformLocation, 0);

    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
  }

  public fillRect(): void {
    return undefined;
  }
  public getGlobalAlpha(): number {
    return 1;
  }
  public setGlobalAlpha(): number {
    return 1;
  }
  public strokeRect(): void {
    return undefined;
  }
  public strokePath(): void {
    return undefined;
  }

  public render(): void {
    // this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    // this.gl.useProgram(this.program);
    // this.gl.uniform2f(
    //   this.resolutionUniformLocation,
    //   this.gl.canvas.width,
    //   this.gl.canvas.height,
    // );
    // this.gl.uniform4f(this.colorUniformLocation, 255, 0, 0, 1);
    // this.gl.enableVertexAttribArray(this.positionAttributeLocation);
    // this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    // this.gl.vertexAttribPointer(
    //   this.positionAttributeLocation,
    //   2,
    //   this.gl.FLOAT,
    //   false,
    //   0,
    //   0,
    // );
    // this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
  }

  private createShader(type: number, source: string): WebGLShader {
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    const success = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);
    if (!success) {
      console.log(this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      throw new Error('Failed to create shader');
      return;
    }

    return shader;
  }

  private createProgram(
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader,
  ): WebGLProgram {
    const program = this.gl.createProgram();
    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);

    const success = this.gl.getProgramParameter(program, this.gl.LINK_STATUS);
    if (!success) {
      console.log(this.gl.getProgramInfoLog(program));
      this.gl.deleteProgram(program);
      throw new Error('Failed to create program');
    }

    return program;
  }

  private setRectangle(x, y, width, height): void {
    const x1 = x;
    const x2 = x + width;
    const y1 = y;
    const y2 = y + height;

    // prettier-ignore
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
      x1, y1,
      x2, y1,
      x1, y2,
      x1, y2,
      x2, y1,
      x2, y2,
    ]), this.gl.STATIC_DRAW);
  }
}
