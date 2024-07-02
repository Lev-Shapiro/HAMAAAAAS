import { BallisticObjectService } from "./ballistic/ballistic-object.service";
import { DataModel } from "./data/data.model";
import { GameUpgrades } from "./game-upgrades";

export class UserBulletService {
  constructor(
    private bulletService: BallisticObjectService,
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

    this.bulletService.spawnBallisticObject(x, y, angle);
    this.ammoLeftInfo.data.value--;
  }
}
