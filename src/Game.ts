import { BallisticObject } from "./ballistic/ballistic-object.service";
import { handleUserMouseInput } from "./handle-user-mouse-input";
import { GameServices } from "./init";
import { Terrorist } from "./terrorist.service";

export class Game extends GameServices {
  isGameActive = false;

  start() {
    this.syncShop();
    this.openMenu();
  }

  syncShop() {
    const upgrades = this.upgrades;

    this.shopUI.addItem(upgrades.damageItem);
    this.shopUI.addItem(upgrades.capacityItem);
    this.shopUI.addItem(upgrades.reloadSpeedItem);

    this.shopUI.addItem(upgrades.helicopter);
    this.shopUI.addItem(upgrades.helicopterBulletReloadSpeed);
    this.shopUI.addItem(upgrades.helicopterMissileReloadSpeed);

    this.shopUI.renderItems();
  }

  continueGame() {
    this.isGameActive = true;
    this.canvas.requestPointerLock();

    this.startGameLoop();
    
    setInterval(() => {
      this.terroristWaves.handleWaves();
      
      this.helicopterBulletService.spawnAllBullets();
      this.helicopterMissileService.spawnAllMissiles();
    }, 1000);

    handleUserMouseInput(
      this.canvas,
      this.recoilService,
      this.userBulletService,
      () => this.openShop(),
      () => this.openMenu()
    );
  }

  private startGameLoop() {
    if (!this.isGameActive) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Motion of all objects
    this.terroristService.rerenderTerrorists();
    this.bulletService.rerenderBallisticObjects();
    this.missileService.rerenderBallisticObjects();
    this.helicopterService.rerenderHelicopters();
    this.helicopterService.rerenderAmmunition();
    this.checkBulletCollisions();
    this.checkMissileCollisions();

    // Infographics
    this.ammoLeftInfo.drawData(0);
    this.healthInfo.drawData(1);
    this.coinBank.drawData(2);

    // Draw everything
    this.helicopterService.drawAllHelicopters();
    this.bulletService.drawAllBallisticObjects();
    this.missileService.drawAllBallisticObjects();
    this.terroristService.drawAllTerrorists();
    this.recoilService.drawCursor();

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
          if (terrorist.health > bullet.damage) {
            terrorist.health -= bullet.damage;
          } else {
            terrorists.splice(i, 1);
            this.coinBank.data.value += 1;
          }

          bullets.splice(j, 1);
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
      const possibleCollisions: { distance: number; actualIndex: number; terrorist: Terrorist }[] =
        [];

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
          const damage = this.upgrades.helicopterMissileDamage.value

          if (collision.terrorist.health > damage) {
            collision.terrorist.health -= damage;
          } else {
            this.terroristService.terrorists.splice(collision.actualIndex, 1);
            this.coinBank.data.value += 1;
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
      object.y + object.height > terrorist.y
    );
  }

  private async openShop() {
    document.exitPointerLock();
    this.isGameActive = false;
    this.shopUI.openModalIfClosed();
  }

  async openMenu() {
    this.isGameActive = false;
    document.exitPointerLock();

    this.shopUI.closeModalIfOpened();
    await this.menuService.waitUntilUserPressesContinue();

    this.continueGame();
  }
}
