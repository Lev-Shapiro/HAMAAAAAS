export interface Data {
  value: number;
  icon: string;
  iconWidth: number;
  iconHeight: number;
}

export class DataModel {
  private readonly dataImage = new Image();
  constructor(
    private canvas: HTMLCanvasElement,
    private ctx: CanvasRenderingContext2D,
    public data: Data
  ) {
    this.dataImage.src = this.data.icon;
  }

  drawData(index: number): void {
    const ctx = this.ctx,
      canvas = this.canvas;

    const ammoText = `${this.data.value}`;
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "right";
    ctx.textBaseline = "top";

    const outerPadding = 5, paddingX = 30;
    const heightIndexMargin = outerPadding + index * 50;

    const { width: textWidth } = ctx.measureText(ammoText);
    const boxWidth = textWidth + paddingX * 2;
    const boxHeight = 40;
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)"; // Semi-transparent background
    ctx.fillRect(
      canvas.width - boxWidth - outerPadding,
      heightIndexMargin,
      boxWidth,
      boxHeight
    );

    ctx.fillStyle = "white";
    ctx.fillText(ammoText, canvas.width - outerPadding - 10, heightIndexMargin + boxHeight / 2 - 7.5);
    ctx.drawImage(this.dataImage, this.canvas.width - boxWidth, heightIndexMargin + boxHeight / 2 - this.data.iconHeight / 2, this.data.iconWidth, this.data.iconHeight);
  }

  rerenderData(newValue: number): void {
    this.data.value = newValue;
  }
}
