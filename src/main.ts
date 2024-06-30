import { Game } from "./Game";
import { ShopUI } from "./shop-ui";
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

const shopUI = new ShopUI(shopModal, shopItemsContainer);

const game = new Game(canvas, ctx, shopUI);

game.start()

modalClose.addEventListener("click", () => {
  game.shopUI.closeModalIfOpened();
  game.continueGame();
});