import { GameUpgrades } from "../game-upgrades";

export class Helicopter {
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
    setInterval(() => {
      this.bulletCapacity = 10;
    }, this.upgrades.helicopterBulletReloadSpeed.value);
  }

  reloadMissiles() {
    setInterval(() => {
      this.missileCapacity = 1;
    }, this.upgrades.helicopterMissileReloadSpeed.value);
  }
}
