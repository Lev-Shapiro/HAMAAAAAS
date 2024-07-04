import { BallisticObjectService } from "./ballistic/ballistic-object.service";
import { DataModel } from "./data/data.model";
import { GameUpgrades } from "./game-upgrades";

export class UserBulletService {
  isReloading = false;
  constructor(
    private bulletService: BallisticObjectService,
    private ammoLeftInfo: DataModel,
    private gameUpgrades: GameUpgrades,
    private reloadScreen: HTMLElement
  ) {
    this.ammoLeftInfo.data.value = gameUpgrades.capacityItem.value;
  }

  reload() {
    if (this.isReloading) return;
    this.isReloading = true;
    this.reloadScreen.classList.add("active");

    setTimeout(() => {
      this.ammoLeftInfo.data.value = this.gameUpgrades.capacityItem.value;
      this.isReloading = false;
      this.reloadScreen.classList.remove("active");
    }, this.gameUpgrades.reloadSpeedItem.value);
  }


  spawnBullet(x: number, y: number, angle: number) {
    if (this.isReloading) {
      throw new Error("Reloading");
    }

    if (this.ammoLeftInfo.data.value <= 0) {
      throw new Error("No more ammo left");
    }

    this.bulletService.spawnBallisticObject(x, y, angle);
    this.ammoLeftInfo.data.value--;
  }
}
