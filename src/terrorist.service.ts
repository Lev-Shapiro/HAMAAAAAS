import { DataModel } from "./data/data.model";

interface TerrroristOptions {
  speed: number;
  width: number;
  height: number;
}

interface Terrorist {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
}

export class TerroristService {
  terrorists: Terrorist[] = [];

  constructor(
    private canvas: HTMLCanvasElement,
    private ctx: CanvasRenderingContext2D,
    private options: TerrroristOptions,
    private healthInfo: DataModel
  ) {}

  drawTerrorist(terrorist: Terrorist) {
    const image = new Image();
    image.src = "/terrorist.gif";

    this.ctx.drawImage(image, terrorist.x, terrorist.y, terrorist.width, terrorist.height);
  }

  drawAllTerrorists() {
    const terrorists = this.terrorists;
    for (let i = terrorists.length - 1; i >= 0; i--) {
      this.drawTerrorist(terrorists[i]);
    }
  }

  rerenderTerrorists() {
    for (let i = this.terrorists.length - 1; i >= 0; i--) {
      this.terrorists[i].y += this.terrorists[i].speed;
      if (this.terrorists[i].y > this.canvas.height * 0.83) {
        this.healthInfo.data.value -= 1;
        this.terrorists.splice(i, 1);
      }
    }
  }

  spawnTerrorists(count: number) {
    for (let i = 0; i < count; i++) {
      const terorrist: Terrorist = {
        x: this.canvas.width * (0.1 + Math.random() * 0.8),
        y: this.canvas.height * (0.2 + (Math.random() * 0.1)),
        width: this.options.width,
        height: this.options.height,
        speed: this.options.speed,
      };

      this.terrorists.push(terorrist);
    }
  }
}
