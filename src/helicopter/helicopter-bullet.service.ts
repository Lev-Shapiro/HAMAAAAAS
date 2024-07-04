import { BallisticObjectService } from "../ballistic/ballistic-object.service";
import { GameUpgrades } from "../game-upgrades";
import { TerroristType } from "../terrorist-type.enum";
import { Terrorist, TerroristService } from "../terrorist.service";
import { Helicopter } from "./helicopter";
import { HelicopterService } from "./helicopter.service";

export class HelicopterBulletService {
  constructor(
    private canvas: HTMLCanvasElement,
    private gameUpgrades: GameUpgrades,
    private terroristService: TerroristService,
    private helicopterService: HelicopterService,
    private bulletService: BallisticObjectService
  ) {}

  spawnBullet(helicopter: Helicopter, targetX: number, targetY: number) {
    const bulletAngle = Math.atan2(
      targetY - helicopter.y,
      targetX - helicopter.x
    );

    this.bulletService.spawnBallisticObject(
      helicopter.x + helicopter.width / 2,
      helicopter.y,
      bulletAngle
    );
  }

  async launchFromHelicopter(helicopter: Helicopter, targets: Terrorist[]) {
    var j = helicopter.bulletCapacity - 1;

    for (; j >= 0; j--) {
      const terrorist = targets[j];

      if (!terrorist) break;

      const targetX = terrorist.x + terrorist.width / 2;
      var targetY = terrorist.y + terrorist.height / 2;

      if(terrorist.type === TerroristType.SINWAR) {
        targetY = terrorist.y + terrorist.height / 1.5;
      }

      if (Math.abs(targetX - helicopter.x) > this.canvas.width * 0.4) break;

      this.spawnBullet(helicopter, targetX, targetY);
    }

    helicopter.bulletCapacity = j;
  }

  async spawnAllBullets() {
    /**
     * * Algorithm
     * * 1. Create array of targets, sorted by distance from the bottom of the screen
     * * 2. For each target, spawn a bullet with an interval of 50ms
     * * 2.LOOP: Repeat step 2 until helicopter has no more bullets
     */

    const availableHelicopters = this.helicopterService.helicopters.filter(
      (h) => h.bulletCapacity > 0
    );
    if (availableHelicopters.length === 0) return;

    const terrorists = this.terroristService.terrorists
      .sort((a, b) => b.x - a.x)
      .reduce<Terrorist[]>((acc, t) => {
        const repeats = Math.ceil(
          t.health / this.gameUpgrades.damageItem.value
        );
        return acc.concat(Array(repeats).fill(t));
      }, []);

    for (let i = 0; i < availableHelicopters.length; i++) {
      const helicopter = availableHelicopters[i];

      const { startIndex, lastIndex } = this.findLegitRange(
        helicopter,
        terrorists
      );

      const targets = terrorists.slice(startIndex, lastIndex).sort(
        // Distance from helicopter
        (a, b) =>
          Math.sqrt(
            Math.pow(a.x - helicopter.x, 2) + Math.pow(a.y - helicopter.y, 2)
          ) -
          Math.sqrt(
            Math.pow(b.x - helicopter.x, 2) + Math.pow(b.y - helicopter.y, 2)
          )
      );

      this.launchFromHelicopter(helicopter, targets);
    }
  }

  private findLegitRange(helicoper: Helicopter, terrorists: Terrorist[]) {
    let startIndex = 0,
      lastIndex = 0;

    for (let i = 0; i < terrorists.length; i++) {
      const targetX = terrorists[i].x + terrorists[i].width / 2;

      if (targetX - helicoper.x > -this.canvas.width * 0.2) {
        startIndex = i;
      }

      if (targetX - helicoper.x > this.canvas.width * 0.2) {
        lastIndex = i;
        break;
      }
    }

    if (lastIndex === 0) {
      lastIndex = terrorists.length;
    }

    return { startIndex, lastIndex };
  }
}
