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

const explosionContainer = document.body;
const reloadScreen = document.getElementById("reload-screen")!;
const shopModal = document.getElementById("modal-container")!;
const shopItemsContainer = document.getElementById("shop-items")!;
const modalClose = document.getElementById("modal-close")!;

const terminateToAshes = () => {
  game = new Game(canvas, ctx, explosionContainer, shopModal, shopItemsContainer, reloadScreen, terminateToAshes);
  game.start()
}

let game = new Game(canvas, ctx, explosionContainer, shopModal, shopItemsContainer, reloadScreen, terminateToAshes);

game.start()

modalClose.addEventListener("click", () => {
  game.shopUI.closeModalIfOpened();
  game.continueGame();
});