export class RecoilService {
  isRecoiling = false;
  recoilDistance = 10;

  constructor(
    private ctx: CanvasRenderingContext2D,
    public cursorX: number,
    public cursorY: number,
  ) {}

  drawCursor() {
    this.ctx.beginPath();
    this.ctx.arc(this.cursorX, this.cursorY, 5, 0, Math.PI * 2);
    this.ctx.fillStyle = "black";
    this.ctx.fill();
  }

  updateCursorPosition({ movementX, movementY }: MouseEvent) {
    this.cursorX += movementX;
    this.cursorY += movementY;
  }

  recoil() {
    this.cursorY -= this.recoilDistance;
  }
}
