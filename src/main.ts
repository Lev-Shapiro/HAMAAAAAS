import { Game } from "./Game";
import "./style.css";

const canvas = document.querySelector<HTMLCanvasElement>("#game")!;
if (!canvas) {
  throw new Error("Could not get canvas");
}

const ctx = canvas.getContext("2d")!;
if (!ctx) {
  throw new Error("Could not get 2d context");
}

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const shopModal = document.getElementById("modal-container")!;
const shopItemsContainer = document.getElementById("shop-items")!;
const modalClose = document.getElementById("modal-close")!;

const game = new Game(canvas, ctx, shopModal, shopItemsContainer);

// game.start()

modalClose.addEventListener("click", () => {
  game.shopUI.closeModalIfOpened();
  game.continueGame();
});

const img = new Image();
img.src = "/helicopter.png";
img.onload = () => {
  ctx.drawImage(img, window.innerWidth * 0.3, window.innerHeight * 0.7, 150, 150);
}