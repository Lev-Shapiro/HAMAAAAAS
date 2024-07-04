import { RecoilService } from "./recoil";

export class GameButtonsService {
  constructor(
    private canvas: HTMLCanvasElement,
    private ctx: CanvasRenderingContext2D,
    private recoilService: RecoilService
  ) {}

  private getButtonPosition(index: number) {
    const buttonX = this.canvas.width - 40;
    const buttonY = this.canvas.height - 80 - index * 60;

    return { buttonX, buttonY };
  }

  private drawButton(index: number, image: string) {
    const ctx = this.ctx;
    const { buttonX, buttonY } = this.getButtonPosition(index);

    // Draw circle button
    ctx.beginPath();
    ctx.arc(buttonX, buttonY, 25, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.stroke();

    // Draw image
    const img = new Image();
    img.src = image;
    ctx.drawImage(img, buttonX - 12.5, buttonY - 12.5, 25, 25);
  }

  async drawGameButtons() {
    // Reload, Shop and Menu buttons at the right-bottom of the screen
    this.drawButton(0, "/reload.webp");
    this.drawButton(1, "/shop.png");
    this.drawButton(2, "/menu.png");
  }

  handleGameButtonClick(
    openShop: () => void,
    openMenu: () => void,
    reload: () => void
  ) {
    const canvas = this.canvas;

    const reloadButton = this.getButtonPosition(0);
    const shopButton = this.getButtonPosition(1);
    const menuButton = this.getButtonPosition(2);

    canvas.addEventListener("click", () => {
      const mouseX = this.recoilService.cursorX;
      const mouseY = this.recoilService.cursorY;

      if (
        mouseX >= reloadButton.buttonX - 25 &&
        mouseX <= reloadButton.buttonX + 25 &&
        mouseY >= reloadButton.buttonY - 25 &&
        mouseY <= reloadButton.buttonY + 25
      ) {
        reload();
      } else if (
        mouseX >= shopButton.buttonX - 25 &&
        mouseX <= shopButton.buttonX + 25 &&
        mouseY >= shopButton.buttonY - 25 &&
        mouseY <= shopButton.buttonY + 25
      ) {
        openShop();
      } else if (
        mouseX >= menuButton.buttonX - 25 &&
        mouseX <= menuButton.buttonX + 25 &&
        mouseY >= menuButton.buttonY - 25 &&
        mouseY <= menuButton.buttonY + 25
      ) {
        openMenu();
      }
    });
  }
}
