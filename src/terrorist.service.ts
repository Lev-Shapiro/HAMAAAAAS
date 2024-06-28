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
    private options: TerrroristOptions
  ) {}

  drawTerrorist(terrorist: Terrorist) {
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(terrorist.x, terrorist.y, terrorist.width, terrorist.height);
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
        this.terrorists.splice(i, 1);
      }
    }
  }

  spawnTerrorists(count: number) {
    for (let i = 0; i < count; i++) {
      const terorrist: Terrorist = {
        x: Math.random() * this.canvas.width,
        y: 50 + Math.random() * 50,
        width: this.options.width,
        height: this.options.height,
        speed: this.options.speed,
      };

      this.terrorists.push(terorrist);
    }
  }
}
