import { handleUserMouseInput } from "./handle-user-mouse-input";
import { GameServices } from "./init";

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

    this.shopUI.renderItems();
  }

  continueGame() {
    this.isGameActive = true;
    this.canvas.requestPointerLock();

    this.startGameLoop();
    this.terroristWaves.handleWaves();
    handleUserMouseInput(
      this.canvas,
      this.recoilService,
      this.bulletService,
      () => this.openShop(),
      () => this.openMenu()
    );
  }

  private startGameLoop() {
    if (!this.isGameActive) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Motion of all objects
    this.terroristService.rerenderTerrorists();
    this.bulletService.rerenderBullets();
    this.checkCollisions();

    // Infographics
    this.ammoLeftInfo.drawData(0);
    this.healthInfo.drawData(1);
    this.coinBank.drawData(2);

    // Draw everything
    this.terroristService.drawAllTerrorists();
    this.bulletService.drawAllBullets();
    this.recoilService.drawCursor();

    requestAnimationFrame(() => this.startGameLoop());
  }

  private checkCollisions() {
    const bullets = this.bulletService.bullets,
      terrorists = this.terroristService.terrorists;

    for (let i = terrorists.length - 1; i >= 0; i--) {
      const terrorist = terrorists[i];

      for (let j = bullets.length - 1; j >= 0; j--) {
        const bullet = bullets[j];

        if (
          terrorist.x < bullet.x + bullet.width / 2 &&
          terrorist.x + terrorist.width > bullet.x - bullet.width / 2 &&
          terrorist.y < bullet.y + bullet.height &&
          terrorist.y + terrorist.height > bullet.y
        ) {
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
