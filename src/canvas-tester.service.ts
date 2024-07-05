export class CanvasTester {
  constructor(private ctx: CanvasRenderingContext2D) {}

  drawRectangle(x: number, y: number, width: number, height: number) {
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(x, y, width, height);
  }

  drawPoint(x: number, y: number, color?: string) {
    this.ctx.fillStyle = color ? color : "red";
    this.ctx.fillRect(x, y, 3, 3);
  }
}
