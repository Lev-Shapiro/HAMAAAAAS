import { GameUpgrades } from "../game-upgrades";
import { Helicopter, HelicopterService } from "../helicopter.service";
import { TerroristService } from "../terrorist.service";
import { BulletService } from "./bullet.service";

interface HelicopterBulletOptions {
  capaity: number;
}
export class HelicopterBulletService {

  constructor(
    private gameUpgrades: GameUpgrades,
    private terroristService: TerroristService,
    private helicopterService: HelicopterService,
    private bulletService: BulletService,
    private options: HelicopterBulletOptions
  ) {}

  reload() {
    // TODO: Prevent it from reloading when the game is paused (clearInterval at some point)
    setInterval(() => {
      this.spawnAllBullets();
    }, this.gameUpgrades.helicopterBulletReloadSpeed.value);
  }

  spawnBullet(helicopter: Helicopter, targetX: number, targetY: number) {
    const bulletAngle = Math.atan2(
      targetY - helicopter.y,
      targetX - helicopter.x
    );

    this.bulletService.spawnBullet(helicopter.x, helicopter.y, bulletAngle);
  }

  spawnAllBullets() {
    const helicopters = this.helicopterService.helicopters;

    let allTerrorists = this.repeatTerroristsUntilDead();

    for (let i = 0; i < helicopters.length; i++) {
      const helicopter = helicopters[i];
      const terroristsToAttack = allTerrorists.splice(0, this.options.capaity);

      for (let j = 0; j < terroristsToAttack.length; j++) {
        const terrorist = terroristsToAttack[j];
        const terroristCenterX = terrorist.x + terrorist.width / 2;
        const terroristCenterY = terrorist.y + terrorist.height / 2;

        this.spawnBullet(helicopter, terroristCenterX, terroristCenterY);
      }
    }
  }

  private repeatTerroristsUntilDead() {
    const targets = [];

    //TODO: Separate into helicopter-chunks, per particular zone
    const terrorists = this.terroristService.terrorists;

    for (let i = 0; i < terrorists.length; i++) {
      const terrorist = terrorists[i];

      const repeatUntilDead = Math.ceil(
        terrorist.health / this.gameUpgrades.damageItem.value
      );

      for (let j = 0; j < repeatUntilDead; j++) {
        targets.push(terrorist);
      }
    }

    return targets;
  }
}
