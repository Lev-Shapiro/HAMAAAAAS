import { DataModel } from "./data/data.model";
import { ScoreCounter } from "./score-counter";

export class MenuService {
  private BUTTON_WIDTH = 200;
  private BUTTON_HEIGHT = 50;

  canvasW: number;
  canvasH: number;

  constructor(
    private canvas: HTMLCanvasElement,
    private ctx: CanvasRenderingContext2D,
    // Used to identify the status of the game to generate appropriate menu
    private scoreCounter: ScoreCounter,
    private healthInfo: DataModel
  ) {
    this.canvasW = this.canvas.width;
    this.canvasH = this.canvas.height;
  }

  async waitUntilUserPressesContinue() {
    this.drawMenu();
    await this.handleCanvasClick();
  }

  drawColorfulText(
    startX: number,
    startY: number,
    textArray: { text: string; color?: string }[]
  ): void {
    let currentX =
      startX -
      this.ctx.measureText(textArray.reduce((acc, { text }) => acc + text, ""))
        .width /
        2;

    this.ctx.save();
    this.ctx.textBaseline = "top";

    textArray.forEach(({ text, color }) => {
      if (color) {
        this.ctx.fillStyle = color;
      }

      this.ctx.fillText(text, currentX, startY);

      // Move the x-coordinate for the next piece of text
      currentX += this.ctx.measureText(text).width;
    });

    this.ctx.restore();
  }

  drawMenu() {
    const ctx = this.ctx;
    ctx.textAlign = "left";

    const modalWidth = 400;
    const modalHeight = 500;
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

    if (this.healthInfo.data.value <= 0) {
      if (this.scoreCounter.score >= 2) {
        this.drawColorfulText(this.canvasW / 2, modalY + 50, [
          {
            text:
              "Killed " + this.scoreCounter.score + " terrorists!",
          },
        ]);
      } else {
        this.drawColorfulText(this.canvasW / 2, modalY + 50, [
          { text: "GAME ENDED" },
        ]);
      }

      ctx.font = "bold 24px Arial";
      
      this.drawColorfulText(this.canvasW / 2, modalY + 150, [
        { text: `SCORE: ${this.scoreCounter.score}`, color: "#4CAF50" },
      ]);
    } else {
      this.drawColorfulText(this.canvasW / 2, modalY + 50, [
        { text: "Freeing Palestine from HAMAS" },
      ]);

      ctx.font = "18px Arial";

      this.drawColorfulText(this.canvasW / 2, modalY + 100, [
        { text: "Press M", color: "#FF5722" },
        { text: " - open menu", color: "#FFFFFF" },
      ]);

      this.drawColorfulText(this.canvasW / 2, modalY + 125, [
        { text: "Press R", color: "#FF5722" },
        { text: " - reload gun", color: "#FFFFFF" },
      ]);

      this.drawColorfulText(this.canvasW / 2, modalY + 150, [
        { text: "Press S", color: "#FF5722" },
        { text: " - open shop", color: "#FFFFFF" },
      ]);
    }

    ctx.textAlign = "center";

    if (this.healthInfo.data.value <= 0) {
      this.drawButton(0, "Play Again", "#4CAF50");
    } else if (this.scoreCounter.score === 0) {
      this.drawButton(0, "Start game", "#4CAF50");
    } else {
      this.drawButton(0, "Continue", "#FF5722");
    }

    ctx.font = "16px Arial";
    ctx.fillText(
      "© 2024 Lev Shapiro - All rights reserved",
      this.canvasW / 2,
      modalY + modalHeight - 60
    );

    // Add a link to Linkedin Profile
    ctx.font = "14px Arial";

    ctx.fillText(
      "Linkedin: https://www.linkedin.com/in/levshapiro/",
      this.canvasW / 2,
      modalY + modalHeight - 20
    );
  }

  handleCanvasClick() {
    return new Promise<void>((resolve) => {
      let lastSetupTime = 0;

      const rect = this.canvas.getBoundingClientRect();

      const handleClick = async (event: MouseEvent) => {
        const elapsedTime = Date.now() - lastSetupTime;
        if (elapsedTime < 1500) {
          await new Promise((r) => setTimeout(r, 1500 - elapsedTime));
        }

        const { buttonX, buttonY } = this.getButtonCoordsByIndex(0);

        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;

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
    const buttonY =
      (this.canvasH - this.BUTTON_HEIGHT) / 2 +
      (30 + this.BUTTON_HEIGHT) * index;

    return {
      buttonX,
      buttonY,
    };
  }

  private drawButton(index: number, text: string, color: string) {
    const ctx = this.ctx;

    const { buttonX, buttonY } = this.getButtonCoordsByIndex(index);

    ctx.fillStyle = color;
    ctx.fillRect(buttonX, buttonY, this.BUTTON_WIDTH, this.BUTTON_HEIGHT);

    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 2;
    ctx.strokeRect(buttonX, buttonY, this.BUTTON_WIDTH, this.BUTTON_HEIGHT);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "20px Arial";
    ctx.fillText(text, this.canvasW / 2, buttonY + 32);
  }
}
