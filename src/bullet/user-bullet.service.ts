import { DataModel } from "../data/data.model";
import { GameUpgrades } from "../game-upgrades";
import { BulletService } from "./bullet.service";

export class UserBulletService {
  constructor(
    private bulletService: BulletService,
    private ammoLeftInfo: DataModel,
    private gameUpgrades: GameUpgrades
  ) {
    this.ammoLeftInfo.data.value = gameUpgrades.capacityItem.value;
  }

  reload() {
    setTimeout(() => {
      this.ammoLeftInfo.data.value = this.gameUpgrades.capacityItem.value;
    }, this.gameUpgrades.reloadSpeedItem.value);
  }

  spawnBullet(x: number, y: number, angle: number) {
    if (this.ammoLeftInfo.data.value <= 0) {
      throw new Error("No more ammo left");
    }

    this.bulletService.spawnBullet(x, y, angle);
    this.ammoLeftInfo.data.value--;
  }
}
