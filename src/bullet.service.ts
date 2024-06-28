import { DataModel } from "./data/data.model";

interface BulletOptions {
  speed: number;
  width: number;
  height: number;

  capacity: number;
  rearmTime: number;
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
    private ammoLeftInfo: DataModel
  ) {
    this.bulletImage.src = "/bullet.webp";

    this.ammoLeftInfo.data.value = options.capacity;
  }

  reload() {
    setTimeout(() => {
      this.ammoLeftInfo.data.value = this.options.capacity;
    }, this.options.rearmTime);
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
