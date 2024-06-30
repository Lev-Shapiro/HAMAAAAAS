export class MenuService {
  private BUTTON_WIDTH = 200;
  private BUTTON_HEIGHT = 50;

  canvasW: number;
  canvasH: number;

  constructor(
    private canvas: HTMLCanvasElement,
    private ctx: CanvasRenderingContext2D
  ) {
    this.canvasW = this.canvas.width;
    this.canvasH = this.canvas.height;
  }

  async waitUntilUserPressesContinue() {
    this.drawMenu();
    await this.handleCanvasClick();
  }

  drawMenu() {
    const ctx = this.ctx;

    const modalWidth = 400;
    const modalHeight = 400;
    const modalX = (this.canvasW - modalWidth) / 2;
    const modalY = (this.canvasH - modalHeight) / 2;

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
      this.canvasW / 2,
      modalY + 50
    );

    ctx.font = "16px Arial";

    ctx.fillText(
      "Press M to open the menu during the game",
      this.canvasW / 2,
      modalY + 100
    )

    ctx.fillText(
      "Press R to reload your gun during the game",
      this.canvasW / 2,
      modalY + 150
    )

    ctx.fillText(
      "Press S to open the shop during the game",
      this.canvasW / 2,
      modalY + 200
    )


    this.drawButton(1, "Continue")
  }

  handleCanvasClick() {
    return new Promise<void>((resolve) => {
      let lastSetupTime = 0;

      const handleClick = async (event: MouseEvent) => {
        const elapsedTime = Date.now() - lastSetupTime;
        if (elapsedTime < 1500) {
          await new Promise((r) => setTimeout(r, 1500 - elapsedTime));
        }

        const { buttonX, buttonY } = this.getButtonCoordsByIndex(1);

        const clickX = event.clientX;
        const clickY = event.clientY;

        if (
          clickX >= buttonX &&
          clickX <= buttonX + this.BUTTON_WIDTH &&
          clickY >= buttonY &&
          clickY <= buttonY + this.BUTTON_HEIGHT
        ) {
          this.canvas.removeEventListener("click", handleClick);
          resolve();
        }
      };

      lastSetupTime = Date.now();
      this.canvas.addEventListener("click", handleClick);
    });
  }

  private getButtonCoordsByIndex(index: number) {
    const buttonX = (this.canvasW - this.BUTTON_WIDTH) / 2;
    const buttonY = (this.canvasH - this.BUTTON_HEIGHT) / 2 + 30 * (index + 1) + this.BUTTON_HEIGHT * index;

    return {
      buttonX,
      buttonY
    }
  }

  private drawButton(index: number, text: string) {
    const ctx = this.ctx;

    const { buttonX, buttonY } = this.getButtonCoordsByIndex(index);

    ctx.fillStyle = "#FF5722";
    ctx.fillRect(buttonX, buttonY, this.BUTTON_WIDTH, this.BUTTON_HEIGHT);

    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 2;
    ctx.strokeRect(buttonX, buttonY, this.BUTTON_WIDTH, this.BUTTON_HEIGHT);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "20px Arial";
    ctx.fillText(text, this.canvasW / 2, buttonY + 32);
  }
}
