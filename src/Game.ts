import { BallisticObject } from "./ballistic/ballistic-object.service";
import { handleUserMouseInput } from "./handle-user-mouse-input";
import { GameServices } from "./init";
import { isMobile } from "./isMobile";
import { TerroristType } from "./terrorist-type.enum";
import { Terrorist } from "./terrorist.service";

// TODO: Separate functionality in this class
export class Game extends GameServices {
  private spawnerInterval: number = 0;
  private deactivateUserMotion: () => void = () => {};

  isGameActive = false;

  start() {
    this.openGameMenu();
  }

  continueGame() {
    this.isGameActive = true;
    if(!isMobile()) this.canvas.requestPointerLock();

    this.startGameLoop();

    this.helicopterService.reloadAmmo();

    this.spawnerInterval = setInterval(() => {
      this.terroristWaves.spawnTerroristWave();

      this.helicopterBulletService.spawnAllBullets();
      this.helicopterMissileService.spawnAllMissiles();
    }, 100);

    this.deactivateUserMotion = handleUserMouseInput(
      this.canvas,
      this.recoilService,
      this.userBulletService,
      () => this.openShop(),
      () => this.openGameMenu()
    );

    this.gameButtons.handleGameButtonClick(
      () => this.openShop(),
      () => this.openGameMenu(),
      () => this.userBulletService.reload()
    )
  }

  private startGameLoop() {
    if (!this.isGameActive) return;

    if (this.healthInfo.data.value <= 0) {
      return this.openGameMenu();
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Motion of all objects
    this.terroristService.rerenderTerrorists();
    if (this.terroristWaves.currentWave < 200)
      this.bulletService.rerenderBallisticObjects();
    this.missileService.rerenderBallisticObjects();
    this.helicopterService.rerenderHelicopters();
    this.checkBulletCollisions();
    this.checkMissileCollisions();

    // Infographics
    this.ammoLeftInfo.drawData(0);
    this.healthInfo.drawData(1);
    this.coinBank.drawData(2);

    // Draw everything
    this.terroristWaves.drawWaveNumber();
    this.helicopterService.drawAllHelicopters();
    if (this.terroristWaves.currentWave < 200)
      this.bulletService.drawAllBallisticObjects();
    this.missileService.drawAllBallisticObjects();
    this.terroristService.drawAllTerrorists();
    this.recoilService.drawCursor();
    this.gameButtons.drawGameButtons();

    requestAnimationFrame(() => this.startGameLoop());
  }

  private checkBulletCollisions() {
    const bullets = this.bulletService.objects,
      terrorists = this.terroristService.terrorists;

    for (let i = terrorists.length - 1; i >= 0; i--) {
      const terrorist = terrorists[i];

      for (let j = bullets.length - 1; j >= 0; j--) {
        const bullet = bullets[j];

        if (this.isCollisionWithTerrorist(terrorist, bullet)) {
          bullets.splice(j, 1);

          if (terrorist.health > bullet.damage) {
            terrorist.health -= bullet.damage;
            continue;
          } else {
            terrorists.splice(i, 1);
            this.scoreCounter.incrementScore();
            this.getMoneyForKill(terrorist);
          }

          break;
        }
      }
    }
  }

  private checkMissileCollisions() {
    const HIT_RADIUS = 150;

    const missiles = this.missileService.objects,
      terrorists = this.terroristService.terrorists;

    /**
     * * Algorithm:
     * * 1. Measure the distance between missile and terrorist
     * * 2. If it is NOT less than half of the width of the terrorist, then skip
     * * Otherwise:
     * * 3.D. Remove the missile
     * * 3.A. Find ALL terrorists within the radius of 200px from the missile
     * * 3.B. Determine the damage of the missile on every terrorist that is within the radius (closer to the explosion = more damage)
     * * 3.C. Remove all the terrorists that no longer have health
     */

    for (let i = missiles.length - 1; i >= 0; i--) {
      const possibleCollisions: {
        distance: number;
        actualIndex: number;
        terrorist: Terrorist;
      }[] = [];

      var terroristCollidedWith: {
        distance: number;
        terrorist: Terrorist;
      } | null = null;

      const missile = missiles[i];
      const missileCenterX = missile.x + missile.width / 2;
      const missileCenterY = missile.y + missile.height / 2;

      for (let j = terrorists.length - 1; j >= 0; j--) {
        const terrorist = terrorists[j];
        const terroristCenterX = terrorist.x + terrorist.width / 2;
        const terroristCenterY = terrorist.y + terrorist.height / 2;
        const distanceX = Math.abs(terroristCenterX - missileCenterX);
        const distanceY = Math.abs(terroristCenterY - missileCenterY);
        const distance = Math.sqrt(
          distanceX * distanceX + distanceY * distanceY
        );

        if (distance < HIT_RADIUS) {
          possibleCollisions.push({
            terrorist,
            actualIndex: j,
            distance,
          });
        }

        // Find the closest one terrorist
        if (
          this.isCollisionWithTerrorist(terrorist, missile) &&
          (!terroristCollidedWith || distance < terroristCollidedWith.distance)
        ) {
          terroristCollidedWith = {
            distance,
            terrorist,
          };
        }
      }

      if (terroristCollidedWith) {
        // Remove the missile
        missiles.splice(i, 1);

        const t = terroristCollidedWith.terrorist;
        const terroristCenterX = t.x + t.width / 2;
        const terroristCenterY = t.y + t.height / 2;

        this.explosionService.drawExplosion(terroristCenterX, terroristCenterY);

        for (let j = 0; j < possibleCollisions.length; j++) {
          const collision = possibleCollisions[j];

          // Closer to explosion = more damage
          const damage = this.upgrades.helicopterMissileDamage.value;

          if (collision.terrorist.health > damage) {
            collision.terrorist.health -= damage;
          } else {
            this.terroristService.terrorists.splice(collision.actualIndex, 1);
            this.scoreCounter.incrementScore();
            this.getMoneyForKill(collision.terrorist);
          }
        }
      }
    }
  }

  private isCollisionWithTerrorist(
    terrorist: Terrorist,
    object: BallisticObject
  ) {
    return (
      object.x < terrorist.x + terrorist.width &&
      object.x + object.width > terrorist.x &&
      object.y < terrorist.y + terrorist.height &&
      object.height + object.y > terrorist.y
    );
  }

  async openShop() {
    clearInterval(this.spawnerInterval);
    this.deactivateUserMotion();
    this.helicopterService.developerResetReloadIntervals();

    if(!isMobile()) document.exitPointerLock();
    this.isGameActive = false;
    this.refreshShop();
    this.shopUI.openModalIfClosed();
  }

  private refreshShop() {
    this.shopUI.reset();

    const upgrades = this.upgrades;

    this.shopUI.addItem(upgrades.damageItem);
    this.shopUI.addItem(upgrades.capacityItem);
    this.shopUI.addItem(upgrades.reloadSpeedItem);

    this.shopUI.addItem(upgrades.helicopter);

    if (upgrades.helicopter.value) {
      this.shopUI.addItem(upgrades.helicopterBulletReloadSpeed);
      this.shopUI.addItem(upgrades.helicopterMissileReloadSpeed);
    }

    this.shopUI.renderItems();
  }

  private getMoneyForKill(terrorist: Terrorist) {
    switch (terrorist.type) {
      case TerroristType.SOLIDER:
        this.coinBank.data.value += 1;
        break;

      case TerroristType.BOMBER:
        this.coinBank.data.value += 25;
        break;

      case TerroristType.CAR_TERRORIST:
        this.coinBank.data.value += 10;
        break;

      case TerroristType.SINWAR:
        this.coinBank.data.value += 2222;
        break;
    }
  }

  async openGameMenu() {
    clearInterval(this.spawnerInterval);
    this.deactivateUserMotion();
    this.helicopterService.developerResetReloadIntervals();

    this.isGameActive = false;
    if(!isMobile()) document.exitPointerLock();

    this.shopUI.closeModalIfOpened();
    await this.menuService.waitUntilUserPressesContinue();

    if(this.healthInfo.data.value > 0) {
      this.continueGame();
    } else {
      this.terminateToAshes();
    }
  }
}
