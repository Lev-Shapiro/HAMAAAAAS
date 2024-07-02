import { DynamicState, DynamicType } from "../dynamic-state";

interface BallisticObjectOptions {
  speed: number;
  width: number;
  height: number;
  image: string;
  damageKeyReference: DynamicType
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
  private readonly objectImage = new Image();

  objects: BallisticObject[] = [];

  constructor(
    private canvas: HTMLCanvasElement,
    private ctx: CanvasRenderingContext2D,
    private options: BallisticObjectOptions,
    private state: DynamicState 
  ) {
    this.objectImage.src = options.image;
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
    const ballisticObject = {
      x,
      y,
      width: this.options.width,
      height: this.options.height,
      speedX: Math.cos(angle) * this.options.speed,
      speedY: Math.sin(angle) * this.options.speed,
      angle: angle,
      damage: this.state.accessors[this.options.damageKeyReference].value,
    };

    this.objects.push(ballisticObject);
    
    return ballisticObject;
  }
}
