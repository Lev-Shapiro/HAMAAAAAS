import { GameUpgrades } from "./game-upgrades";

interface HelicopterOptions {
    width: number;
    height: number;
    image: string;
}

export interface Helicopter {
  x: number;
  y: number;
  width: number;
  height: number;
  image: HTMLImageElement;
}

export class HelicopterService {
  helicopters: Helicopter[] = [];

  helicopterImage = new Image();

  constructor(
    private canvas: HTMLCanvasElement,
    private ctx: CanvasRenderingContext2D,
    private gameUpgrades: GameUpgrades,
    private options: HelicopterOptions
  ) {
    this.helicopterImage.src = options.image;
  }

  drawHelicopter(helicopter: Helicopter) {
    // TODO: Add how much is left ammunition
    
    this.ctx.drawImage(
      helicopter.image,
      helicopter.x,
      helicopter.y,
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
    const helicopterX = this.canvas.width * (0.3 + this.helicopters.length * 0.15);

    this.helicopters.push({
      x: helicopterX,
      y: this.canvas.height * (0.82 + Math.random() * 0.05),
      width: this.options.width,
      height: this.options.height,
      image: this.helicopterImage,
    });
  }

  rerenderHelicopters() {
    const helicopters = this.gameUpgrades.helicopter.value - this.helicopters.length;

    for(let i = 0; i < helicopters; i++) {
      this.spawnNewHelicopter();
    }
  }
}
