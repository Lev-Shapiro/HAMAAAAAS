import { UpgradeItem } from "../game-upgrades";

interface BallisticObjectOptions {
  speed: number;
  width: number;
  height: number;
  image: string;
  damage: UpgradeItem
}

export interface BallisticObject {
  x: number;
  y: number;
  width: number;
  height: number;
  speedX: number;
  speedY: number;
  angle: number;
  damage: number;
}

export class BallisticObjectService {
  private readonly objectImage: HTMLImageElement;

  objects: BallisticObject[] = [];

  constructor(
    private canvas: HTMLCanvasElement,
    private ctx: CanvasRenderingContext2D,
    private options: BallisticObjectOptions
  ) {
    const img = new Image();
    img.src = this.options.image;

    this.objectImage = img;
  }

  drawBallisticObject(object: BallisticObject) {
    this.ctx.save();
    this.ctx.translate(object.x, object.y);
    this.ctx.rotate(object.angle);
    this.ctx.drawImage(
      this.objectImage,
      -object.width / 2,
      -object.height / 2,
      object.width,
      object.height
    );
    this.ctx.restore();
  }

  drawAllBallisticObjects() {
    const objects = this.objects;
    for (let i = objects.length - 1; i >= 0; i--) {
      this.drawBallisticObject(objects[i]);
    }
  }

  rerenderBallisticObjects() {
    const objects = this.objects;

    for (let i = objects.length - 1; i >= 0; i--) {
      objects[i].x += objects[i].speedX;
      objects[i].y += objects[i].speedY;
      if (
        objects[i].x < 0 ||
        objects[i].x > this.canvas.width ||
        objects[i].y > this.canvas.height
      ) {
        objects.splice(i, 1);
      }
    }
  }

  spawnBallisticObject(x: number, y: number, angle: number): BallisticObject {
    const ballisticObject: BallisticObject = {
      x,
      y,
      speedX: Math.cos(angle) * this.options.speed,
      speedY: Math.sin(angle) * this.options.speed,
      angle: angle,
      width: this.options.width,
      height: this.options.height,
      damage: this.options.damage.value,
    };

    this.objects.push(ballisticObject);

    return ballisticObject;
  }
}
