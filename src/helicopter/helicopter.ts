import { GameUpgrades } from "../game-upgrades";

export class Helicopter {
  bulletInterval: number = 0;
  missileInterval: number = 0;
  
  bulletCapacity: number = 0;
  missileCapacity: number = 0;

  constructor(
    private upgrades: GameUpgrades,
    public x: number,
    public y: number,
    public width: number,
    public height: number,
    public image: HTMLImageElement
  ) {}

  reloadBullets() {
    this.bulletInterval = setInterval(() => {
      this.bulletCapacity = 10;
    }, this.upgrades.helicopterBulletReloadSpeed.value);
  }

  reloadMissiles() {
    this.missileInterval = setInterval(() => {
      this.missileCapacity = 1;
    }, this.upgrades.helicopterMissileReloadSpeed.value);
  }

  developerResetReloadIntervals() {
    this.bulletInterval = 0;
    this.missileInterval = 0;
  }
}
