import { GameUpgrades } from "../game-upgrades";
import { Helicopter, HelicopterService } from "../helicopter.service";
import { BallisticObjectService } from "../missile/ballistic-object.service";
import { Terrorist, TerroristService } from "../terrorist.service";

interface HelicopterBulletOptions {
  capacity: number;
}
export class HelicopterBulletService {
  constructor(
    private canvas: HTMLCanvasElement,
    private gameUpgrades: GameUpgrades,
    private terroristService: TerroristService,
    private helicopterService: HelicopterService,
    private bulletService: BallisticObjectService,
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

    this.bulletService.spawnBallisticObject(helicopter.x, helicopter.y, bulletAngle);
  }

  async spawnAllBullets() {
    const helicopters = this.helicopterService.helicopters;

    let chunkedTerrorists = this.terroristsByChunks();
    for (let i = 0; i < helicopters.length; i++) {
      const helicopter = helicopters[i];
      const terroristsToAttack =
        i === helicopters.length - 1
          ? chunkedTerrorists.slice(i, chunkedTerrorists.length + 1).flat()
          : chunkedTerrorists[i];

      const shootAmount =
        this.options.capacity < terroristsToAttack.length
          ? this.options.capacity
          : terroristsToAttack.length;

      for (let j = 0; j < shootAmount; j++) {
        const terrorist = terroristsToAttack[j];
        const terroristCenterX = terrorist.x + terrorist.width / 2;
        const terroristCenterY = terrorist.y + terrorist.height / 2;

        await new Promise((resolve) => setTimeout(resolve, 50));
        this.spawnBullet(helicopter, terroristCenterX, terroristCenterY);
      }
    }
  }

  private terroristsByChunks() {
    const targetByChunks: Terrorist[][] = [
      // 0 - 1/4
      [],
      // 1/4 - 2/4
      [],
      // 2/4 - 3/4
      [],
      // 3/4 - 4/4
      [],
    ];

    const terrorists = this.terroristService.terrorists;

    for (let i = 0; i < terrorists.length; i++) {
      const terrorist = terrorists[i];

      const repeatUntilDead = Math.ceil(
        terrorist.health / this.gameUpgrades.damageItem.value
      );

      const repeatUntilLimit = repeatUntilDead > 10 ? 10 : repeatUntilDead;

      const terroristChunkAssign = Math.floor(
        terrorist.x / (this.canvas.width / 4)
      );

      for (let j = 0; j < repeatUntilLimit; j++) {
        targetByChunks[terroristChunkAssign].push(terrorist);
      }
    }

    return targetByChunks;
  }
}
