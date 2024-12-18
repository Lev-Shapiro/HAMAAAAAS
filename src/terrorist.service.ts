import { DataModel } from "./data/data.model";
import { isMobile } from "./isMobile";
import { TerroristType } from "./terrorist-type.enum";

type TerroristInformation = {
  [key in TerroristType]: {
    speed: number;
    health: number;
    width: number;
    height: number;
  };
};

export interface Terrorist {
  type: TerroristType;

  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  health: number;
}

export class TerroristService {
  terrorists: Terrorist[] = [];

  constructor(
    private canvas: HTMLCanvasElement,
    private ctx: CanvasRenderingContext2D,
    private terroristInfo: TerroristInformation,
    private healthInfo: DataModel
  ) {}

  drawTerrorist(terrorist: Terrorist) {
    const image = new Image();

    switch (terrorist.type) {
      case TerroristType.SOLIDER:
        image.src = "/terrorist.webp";
        image.alt = "Terrorist image";
        break;
      case TerroristType.BOMBER:
        image.src = "/suicide-bomber.webp";
        image.alt = "Suicide Bomber image";
        break;
      case TerroristType.CAR_TERRORIST:
        image.src = "/terrorist_wcar.webp";
        image.alt = "Car image";
        break;
      case TerroristType.SINWAR:
        image.src = "/sinwar.webp";
        image.alt = "Sinwar image";
        break;
    }

    // Draw health bar
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(terrorist.x, terrorist.y - 10, terrorist.width, 5);
    this.ctx.fillStyle = "green";
    this.ctx.fillRect(
      terrorist.x,
      terrorist.y - 10,
      terrorist.width *
        (terrorist.health / this.terroristInfo[terrorist.type].health),
      5
    );

    // Draw terrorist
    this.ctx.drawImage(
      image,
      terrorist.x,
      terrorist.y,
      terrorist.width,
      terrorist.height
    );
  }

  drawAllTerrorists() {
    const terrorists = this.terrorists;
    for (let i = terrorists.length - 1; i >= 0; i--) {
      this.drawTerrorist(terrorists[i]);
    }
  }

  rerenderTerrorists() {
    const terrorists = this.terrorists;

    for (let i = terrorists.length - 1; i >= 0; i--) {
      const terrorist = terrorists[i];

      // Let's assume that 100mph = 1px per second
      // When on mobile device then the speed will be slower
      terrorist.y += terrorist.speed / (isMobile() ? 150 : 100);

      if (terrorist.y + terrorist.height > this.canvas.height * 0.83) {
        this.lowerHealth(terrorist);
        terrorists.splice(i, 1);
      }
    }
  }

  spawnTerrorists(count: number) {
    for (let i = 0; i < count; i++) {
      const terorrist: Terrorist = {
        type: TerroristType.SOLIDER,
        ...this.getTerroristOptions(TerroristType.SOLIDER),
      };

      this.terrorists.push(terorrist);
    }
  }

  spawnBombers(count: number) {
    for (let i = 0; i < count; i++) {
      const terorrist: Terrorist = {
        type: TerroristType.BOMBER,
        ...this.getTerroristOptions(TerroristType.BOMBER),
      };

      this.terrorists.push(terorrist);
    }
  }

  spawnCarTerrorists(count: number) {
    for (let i = 0; i < count; i++) {
      const terorrist: Terrorist = {
        type: TerroristType.CAR_TERRORIST,
        ...this.getTerroristOptions(TerroristType.CAR_TERRORIST),
      };

      this.terrorists.push(terorrist);
    }
  }

  spawnSinwar(count: number) {
    for (let i = 0; i < count; i++) {
      const terorrist: Terrorist = {
        type: TerroristType.SINWAR,
        ...this.getTerroristOptions(TerroristType.SINWAR),
      };

      this.terrorists.push(terorrist);
    }
  }

  private getTerroristOptions(type: TerroristType) {
    return {
      x: this.canvas.width * (0.1 + Math.random() * 0.8),
      y: this.canvas.height * (0.2 + Math.random() * 0.1),
      ...this.terroristInfo[type],
    };
  }

  private lowerHealth(terrorist: Terrorist) {
    switch (terrorist.type) {
      case TerroristType.SOLIDER:
        this.healthInfo.data.value -= 1;
        break;
      case TerroristType.BOMBER:
        this.healthInfo.data.value -= 20;
        break;
      case TerroristType.CAR_TERRORIST:
        this.healthInfo.data.value -= 5;
        break;
      case TerroristType.SINWAR:
        this.healthInfo.data.value -= 50;
        break;
    }
  }
}
