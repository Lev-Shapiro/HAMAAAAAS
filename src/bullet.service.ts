import { DataModel } from "./data/data.model";
import { GameUpgrades } from "./game-upgrades";

interface BulletOptions {
  speed: number;
  width: number;
  height: number;
}

export interface Bullet {
  x: number;
  y: number;
  width: number;
  height: number;
  speedX: number;
  speedY: number;
  angle: number;
}

export class BulletService {
  private readonly bulletImage = new Image();

  bullets: Bullet[] = [];

  constructor(
    private canvas: HTMLCanvasElement,
    private ctx: CanvasRenderingContext2D,
    private options: BulletOptions,
    private gameUpgrades: GameUpgrades,
    private ammoLeftInfo: DataModel
  ) {
    this.bulletImage.src = "/bullet.webp";

    this.ammoLeftInfo.data.value = gameUpgrades.capacityItem.value;
  }

  reload() {
    setTimeout(() => {
      this.ammoLeftInfo.data.value = this.gameUpgrades.capacityItem.value;
    }, this.gameUpgrades.reloadSpeedItem.value);
  }

  drawBullet(bullet: Bullet) {
    this.ctx.save();
    this.ctx.translate(bullet.x, bullet.y);
    this.ctx.rotate(bullet.angle);
    this.ctx.drawImage(
      this.bulletImage,
      -bullet.width / 2,
      -bullet.height / 2,
      bullet.width,
      bullet.height
    );
    this.ctx.restore();
  }

  drawAllBullets() {
    const bullets = this.bullets;
    for (let i = bullets.length - 1; i >= 0; i--) {
      this.drawBullet(bullets[i]);
    }
  }

  rerenderBullets() {
    const bullets = this.bullets;

    for (let i = bullets.length - 1; i >= 0; i--) {
      bullets[i].x += bullets[i].speedX;
      bullets[i].y += bullets[i].speedY;
      if (
        bullets[i].x < 0 ||
        bullets[i].x > this.canvas.width ||
        bullets[i].y > this.canvas.height
      ) {
        bullets.splice(i, 1);
      }
    }
  }

  spawnBullet(x: number, y: number, angle: number): Bullet {
    if(this.ammoLeftInfo.data.value <= 0) {
      throw new Error('No more ammo left');
    }

    const bullet = {
      x,
      y,
      width: this.options.width,
      height: this.options.height,
      speedX: Math.cos(angle) * this.options.speed,
      speedY: Math.sin(angle) * this.options.speed,
      angle: angle + Math.PI / 2,
    };

    this.bullets.push(bullet);
    this.ammoLeftInfo.data.value--;
    
    return bullet;
  }
}
