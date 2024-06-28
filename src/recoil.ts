export class RecoilService {
    isRecoiling = false;
    recoilDistance = 20;
    recoilDuration = 100; // in milliseconds

    cursorX: number = 0;
    cursorY: number = 0;

    constructor(private ctx: CanvasRenderingContext2D) {
    }

    drawCursor() {
        this.ctx.beginPath();
        this.ctx.arc(this.cursorX, this.cursorY, 5, 0, Math.PI * 2);
        this.ctx.fillStyle = 'black';
        this.ctx.fill();
    }

    updateCursorPosition(event: MouseEvent) {
        console.log(event.clientX, event.clientY);
        this.cursorX = event.clientX;
        this.cursorY = event.clientY;
        this.drawCursor();
    }

    recoil() {
        if (this.isRecoiling) return;
        this.isRecoiling = true;
    
        const originalX = this.cursorX;
        const originalY = this.cursorY;
    
        // Calculate the direction of recoil
        const recoilAngle = Math.random() * 2 * Math.PI;
        const recoilX = originalX - this.recoilDistance * Math.cos(recoilAngle);
        const recoilY = originalY - this.recoilDistance * Math.sin(recoilAngle);
    
        // Move the cursor back
        this.cursorX = recoilX;
        this.cursorY = recoilY;
        this.drawCursor();
    
        // Return the cursor to its original position after the duration
        setTimeout(() => {
            this.cursorX = originalX;
            this.cursorY = originalY;
            this.drawCursor();
            this.isRecoiling = false;
        }, this.recoilDuration);
    }
}