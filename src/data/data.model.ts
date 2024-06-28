export interface Data {
  value: number;
  icon?: string;
}

export class DataModel {
  constructor(
    private canvas: HTMLCanvasElement,
    private ctx: CanvasRenderingContext2D,
    public data: Data,
  ) {}

  drawData(index: number): void {
    const d = this.data;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const x = this.canvas.width - 150;
    const y = 20 + index * 30;
    this.ctx.fillStyle = "black";
    this.ctx.font = "16px Arial";
    this.ctx.fillText(d.value.toString(), x, y);
    if (d.icon) {
      const img = new Image();
      img.src = d.icon;
      img.onload = () => {
        this.ctx.drawImage(img, x - 30, y - 15, 20, 20);
      };
    }
  }

  rerenderData(newValue: number): void {
    this.data.value = newValue;
  }
}
