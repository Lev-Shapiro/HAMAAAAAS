interface HelicopterOptions {
    width: number;
    height: number;
    image: string;
}

interface HelicopterType {
  x: number;
  y: number;
  width: number;
  height: number;
  image: HTMLImageElement;
}

export class HelicopterService {
  helicopters: HelicopterType[] = [];

  helicopterImage = new Image();

  constructor(
    private canvas: HTMLCanvasElement,
    private ctx: CanvasRenderingContext2D,
    private options: HelicopterOptions
  ) {
    this.helicopterImage.src = options.image;
  }

  drawHelicopter(helicopter: HelicopterType) {
    this.ctx.drawImage(
      helicopter.image,
      -helicopter.width / 2,
      -helicopter.height / 2,
      helicopter.width,
      helicopter.height
    );
  }

  drawAllHelicopters() {
    const helicopters = this.helicopters;
    for (let i = helicopters.length - 1; i >= 0; i--) {
      this.drawHelicopter(helicopters[i]);
    }
  }

  spawnNewHelicopter() {
    this.drawHelicopter({
      x: this.canvas.width * (0.4 + Math.random() * 0.2),
      y: this.canvas.height * (0.82 + Math.random() * 0.05),
      width: this.options.width,
      height: this.options.height,
      image: this.helicopterImage,
    });
  }
}
