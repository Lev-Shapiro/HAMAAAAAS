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

  reloadAmmo() {
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

  developerResetReloadIntervals() {
    for (let i = 0; i < this.helicopters.length; i++) {
      const helicopter = this.helicopters[i];
      helicopter.developerResetReloadIntervals();
    }
  }

  drawHelicopter(helicopter: Helicopter) {
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
    const updatedHelicopLen = this.helicopters.length + 1;

    const minX = this.canvas.width * 0.35;
    const maxX = this.canvas.width * 0.8;

    // Update axisX position for all helicopters in the last chunk equally spaced between minX and maxX, assuming that another helicopter will be added
    const spaceForHelicopter = (maxX - minX) / (updatedHelicopLen + 1);

    this.helicopters.forEach((helicopter, i) => {
      const helicopterX = minX + spaceForHelicopter * i;
      
      helicopter.x = helicopterX;
    });

    const helicopterX = minX + spaceForHelicopter * updatedHelicopLen;
    const helicopterY = this.canvas.height * (0.82 + Math.random() * 0.06);

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

  resetBulletCapacity(hIndex: number, newValue: number) {
    this.helicopters[hIndex].bulletCapacity = newValue;
  }

  resetMissileCapacity(hIndex: number, newValue: number) {
    this.helicopters[hIndex].missileCapacity = newValue;
  }
}
