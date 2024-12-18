import { BallisticObjectService } from "../ballistic/ballistic-object.service";
import { GameUpgrades } from "../game-upgrades";
import { Terrorist, TerroristService } from "../terrorist.service";
import { Helicopter } from "./helicopter";
import { HelicopterService } from "./helicopter.service";

export class HelicopterMissileService {
  constructor(
    private canvas: HTMLCanvasElement,
    private gameUpgrades: GameUpgrades,
    private terroristService: TerroristService,
    private helicopterService: HelicopterService,
    private missileService: BallisticObjectService
  ) {}

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

  async launchFromHelicopter(helicopter: Helicopter, targets: Terrorist[]) {
    var j = 0;

    for (; j < helicopter.missileCapacity; j++) {
      const terrorist = targets[j];

      if (!terrorist) break;

      const targetX = terrorist.x + terrorist.width / 2;
      const targetY = terrorist.y + terrorist.height / 2;

      if (Math.abs(targetX - helicopter.x) > this.canvas.width * 0.4) break;

      this.spawnMissile(helicopter, targetX, targetY);
    }

    helicopter.missileCapacity -= j;
  }

  spawnAllMissiles() {
    /**
     * * Algorithm
     * * 1. Create array of targets, sorted by distance from the bottom of the screen
     * * 2. For each target, spawn a missile with an interval of 50ms
     * * 2.LOOP: Repeat step 2 until helicopter has no more missiles
     */

    const availableHelicopters = this.helicopterService.helicopters.filter(
      (helicopter) => helicopter.missileCapacity > 0
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

      if (helicopter.missileCapacity <= 0) continue;
    
      const { startIndex, lastIndex } = this.findLegitRange(
        helicopter,
        terrorists
      );

      const targets = terrorists.slice(startIndex, lastIndex);

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
