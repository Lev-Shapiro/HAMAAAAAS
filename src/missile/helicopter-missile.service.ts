import { GameUpgrades } from "../game-upgrades";
import { Helicopter, HelicopterService } from "../helicopter.service";
import { Terrorist, TerroristService } from "../terrorist.service";
import { BallisticObjectService } from "./ballistic-object.service";

// TODO: Make this service more generic (appropriate for both bullets and missiles)

interface HelicopterMissileOptions {
  capacity: number;
}

export class HelicopterMissileService {
  constructor(
    private canvas: HTMLCanvasElement,
    private gameUpgrades: GameUpgrades,
    private terroristService: TerroristService,
    private helicopterService: HelicopterService,
    private missileService: BallisticObjectService,
    private options: HelicopterMissileOptions
  ) {}

  reload() {
    // TODO: Prevent it from reloading when the game is paused (clearInterval at some point)
    setInterval(() => {
      this.spawnAllMissiles();
    }, this.gameUpgrades.helicopterMissileReloadSpeed.value);
  }

  spawnMissile(helicopter: Helicopter, targetX: number, targetY: number) {
    const missileAngle = Math.atan2(
      targetY - helicopter.y,
      targetX - helicopter.x
    );

    this.missileService.spawnBallisticObject(
      helicopter.x,
      helicopter.y,
      missileAngle
    );
  }

  spawnAllMissiles() {
    //TODO: Make it appropiate for missiles (rather than bullets)

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

        this.spawnMissile(helicopter, terroristCenterX, terroristCenterY);
      }
    }
  }

  private terroristsByChunks() {
    //TODO: Make it appropiate for missiles (rather than bullets)

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

      const terroristChunkAssign = Math.floor(
        terrorist.x / (this.canvas.width / 4)
      );

      for (let j = 0; j < repeatUntilDead; j++) {
        targetByChunks[terroristChunkAssign].push(terrorist);
      }
    }

    return targetByChunks;
  }
}
