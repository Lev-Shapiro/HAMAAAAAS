import { isMobile } from "./isMobile";

export class GameButtonsService {
  constructor(
    private canvas: HTMLCanvasElement,
    private ctx: CanvasRenderingContext2D
  ) {}

  private getButtonPosition(index: number) {
    const buttonX = this.canvas.width - 40;
    const buttonY = this.canvas.height - index * 60 - (isMobile() ? 80 : 40);

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
    const img = new Image(25, 25);
    img.src = image;

    ctx.drawImage(img, buttonX - 12.5, buttonY - 12.5, 25, 25);
  }

  drawGameButtons() {
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
    const canvas = this.canvas,
      rect = canvas.getBoundingClientRect();

    const reloadButton = this.getButtonPosition(0);
    const shopButton = this.getButtonPosition(1);
    const menuButton = this.getButtonPosition(2);

    const handleClick = (event: MouseEvent) => {
      const cursorX = event.clientX - rect.left;
      const cursorY = event.clientY - rect.top;

      if (
        cursorX >= reloadButton.buttonX - 25 &&
        cursorX <= reloadButton.buttonX + 25 &&
        cursorY >= reloadButton.buttonY - 25 &&
        cursorY <= reloadButton.buttonY + 25
      ) {
        reload();
      } else if (
        cursorX >= shopButton.buttonX - 25 &&
        cursorX <= shopButton.buttonX + 25 &&
        cursorY >= shopButton.buttonY - 25 &&
        cursorY <= shopButton.buttonY + 25
      ) {
        openShop();
      } else if (
        cursorX >= menuButton.buttonX - 25 &&
        cursorX <= menuButton.buttonX + 25 &&
        cursorY >= menuButton.buttonY - 25 &&
        cursorY <= menuButton.buttonY + 25
      ) {
        canvas.removeEventListener("click", handleClick);
        openMenu();
      }
    };

    canvas.addEventListener("click", handleClick);
  }
}
