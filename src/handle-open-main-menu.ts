export class MenuService {
  constructor(
    private canvas: HTMLCanvasElement,
    private ctx: CanvasRenderingContext2D
  ) {}

  async waitUntilUserPressesContinue() {
    this.drawMenu();
    await this.handleCanvasClick();
  }

  drawMenu() {
    const canvas = this.canvas,
      ctx = this.ctx;

    const modalWidth = 400;
    const modalHeight = 200;
    const modalX = (canvas.width - modalWidth) / 2;
    const modalY = (canvas.height - modalHeight) / 2;

    // Draw modal background
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillRect(modalX, modalY, modalWidth, modalHeight);

    // Draw modal border
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 4;
    ctx.strokeRect(modalX, modalY, modalWidth, modalHeight);

    // Draw modal text
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "24px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
      'Click "Continue" to play the game',
      canvas.width / 2,
      modalY + 50
    );

    // Draw button
    const buttonWidth = 150;
    const buttonHeight = 50;
    const buttonX = (canvas.width - buttonWidth) / 2;
    const buttonY = modalY + 100;

    ctx.fillStyle = "#FF5722";
    ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 2;
    ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "20px Arial";
    ctx.fillText("Continue", canvas.width / 2, buttonY + 32);
  }

  handleCanvasClick() {
    return new Promise<void>((resolve) => {
      const handleClick = (event: MouseEvent) => {
        const canvas = this.canvas;

        // const modalWidth = 400;
        const modalHeight = 200;
        // const modalX = (canvas.width - modalWidth) / 2;
        const modalY = (canvas.height - modalHeight) / 2;

        const buttonWidth = 150;
        const buttonHeight = 50;
        const buttonX = (canvas.width - buttonWidth) / 2;
        const buttonY = modalY + 100;

        const clickX = event.clientX;
        const clickY = event.clientY;

        if (
          clickX >= buttonX &&
          clickX <= buttonX + buttonWidth &&
          clickY >= buttonY &&
          clickY <= buttonY + buttonHeight
        ) {
          canvas.requestPointerLock();
          this.canvas.removeEventListener("click", handleClick);
          this.ctx.clearRect(0, 0, canvas.width, canvas.height);
          resolve();
        }
      };

      this.canvas.addEventListener("click", handleClick);
    });
  }
}