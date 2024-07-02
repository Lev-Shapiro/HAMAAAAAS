import { GameUpgrades } from "../game-upgrades";
import { Helicopter } from "./helicopter";

interface HelicopterOptions {
  width: number;
  height: number;
  image: string;
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

  rerenderAmmunition() {
    for (let i = 0; i < this.helicopters.length; i++) {
      const helicopter = this.helicopters[i];

      if(helicopter.bulletCapacity === 0) {
        helicopter.reloadBullets();
      }

      if(helicopter.missileCapacity === 0) {
        helicopter.reloadMissiles();
      }
    }
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
    const helicopterX =
      this.canvas.width * (0.3 + this.helicopters.length * 0.15);

    const helicopterY = this.canvas.height * (0.82 + Math.random() * 0.05);

    this.helicopters.push(
      new Helicopter(
        this.gameUpgrades,
        helicopterX,
        helicopterY,
        this.options.width,
        this.options.height,
        this.helicopterImage
      )
    );
  }

  rerenderHelicopters() {
    const helicopters =
      this.gameUpgrades.helicopter.value - this.helicopters.length;

    for (let i = 0; i < helicopters; i++) {
      this.spawnNewHelicopter();
    }
  }
}
