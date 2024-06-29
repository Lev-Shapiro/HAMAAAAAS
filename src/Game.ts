import { handleUserMouseInput } from "./handle-user-mouse-input";
import { GameServices } from "./init";

export class Game extends GameServices {
  isGameActive = false;
  async handleMenu() {
    this.isGameActive = false;

    await this.menuService.waitUntilUserPressesContinue();

    this.handleStartGame();
  }

  handleStartGame() {
    this.isGameActive = true;
    this.canvas.requestPointerLock();

    this.startGameLoop();
    this.terroristWaves.handleWaves();
    handleUserMouseInput(
      this.canvas,
      this.recoilService,
      this.bulletService,
      () => {
        this.handleMenu();
      }
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
      for (let j = bullets.length - 1; j >= 0; j--) {
        if (
          terrorists[i].x < bullets[j].x + bullets[j].width / 2 &&
          terrorists[i].x + terrorists[i].width >
            bullets[j].x - bullets[j].width / 2 &&
          terrorists[i].y < bullets[j].y + bullets[j].height &&
          terrorists[i].y + terrorists[i].height > bullets[j].y
        ) {
          terrorists.splice(i, 1);
          bullets.splice(j, 1);

          this.coinBank.data.value += 1;
          break;
        }
      }
    }
  }
}
