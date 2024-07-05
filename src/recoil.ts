import { isMobile } from "./isMobile";

export class RecoilService {
  recoilDistance = 10;

  centerX: number;
  centerY: number;
  cursorX: number
  cursorY: number;

  constructor(
    private canvas: HTMLCanvasElement,
    private ctx: CanvasRenderingContext2D,
  ) {
    this.centerX = this.canvas.width / 2;
    this.centerY = this.canvas.height / 2;
  
    this.cursorX = this.centerX;
    this.cursorY = this.centerY;
  }

  drawCursor() {
    if(isMobile()) return;
    
    this.ctx.beginPath();
    const img = new Image();
    img.src = "/cursor.png";
    this.ctx.drawImage(img, this.cursorX - 5, this.cursorY - 5, 20, 20);
  }

  updateCursorPosition({ movementX, movementY }: MouseEvent) {
    this.cursorX += movementX;
    this.cursorY += movementY;

    if(this.cursorX < 0) this.cursorX = 20;
    if(this.cursorX > this.canvas.width) this.cursorX = this.canvas.width - 20;
    if(this.cursorY < 0) this.cursorY = 20;
    if(this.cursorY > this.canvas.height) this.cursorY = this.canvas.height - 20;
  }

  updateCursorPositionTouch(touch: Touch) {
    console.log(touch);
    
    this.cursorX = touch.clientX;
    this.cursorY = touch.clientY;
  }

  recoil() {
    if(isMobile()) return;
    
    this.cursorY -= this.recoilDistance;
  }
}
