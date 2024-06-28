import { BulletService } from "./bullet.service";
import { DataModel } from "./data/data.model";
import { handleMenu } from "./handle-menu";
import { handleMouseInteract } from "./mouse-interact";
import { RecoilService } from "./recoil";
import "./style.css";
import { TerroristService } from "./terrorist.service";

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

const ammoLeftInfo = new DataModel(canvas, ctx, {
  value: 0,
  icon: "/bullet.webp",
  iconWidth: 12,
  iconHeight: 30,
});

const healthInfo = new DataModel(canvas, ctx, {
  value: 100,
  icon: "/heart.webp",
  iconWidth: 30,
  iconHeight: 30,
});

const coinBank = new DataModel(canvas, ctx, {
  value: 0,
  icon: "/coin.webp",
  iconWidth: 30,
  iconHeight: 30,
});


const bulletService = new BulletService(
  canvas,
  ctx,
  {
    speed: 10,
    width: 10,
    height: 30,
    capacity: 30,
    rearmTime: 1000,
  },
  ammoLeftInfo
);

const terroristService = new TerroristService(canvas, ctx, {
  speed: 0.5,
  width: 20,
  height: 20,
}, healthInfo);

const recoilService = new RecoilService(canvas, ctx);

function checkCollisions() {
  const bullets = bulletService.bullets,
    terrorists = terroristService.terrorists;

  for (let i = terrorists.length - 1; i >= 0; i--) {
    for (let j = bullets.length - 1; j >= 0; j--) {
      if (
        terrorists[i].x < bullets[j].x + bullets[j].width / 2 &&
        terrorists[i].x + terrorists[i].width >
          bullets[j].x - bullets[j].width / 2 &&
        terrorists[i].y < bullets[j].y + bullets[j].height &&
        terrorists[i].y + terrorists[i].height > bullets[j].y
      ) {
        terrorists.splice(i, 1);
        bullets.splice(j, 1);
        
        coinBank.data.value += 1;
        break;
      }
    }
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  terroristService.rerenderTerrorists();
  bulletService.rerenderBullets();
  checkCollisions();

  ammoLeftInfo.drawData(0);
  healthInfo.drawData(1);
  coinBank.drawData(2);

  terroristService.drawAllTerrorists();
  bulletService.drawAllBullets();
  recoilService.drawCursor();

  requestAnimationFrame(gameLoop);
}

// When user presses R, reload
document.addEventListener("keydown", (event) => {
  if (event.key === "r") {
    bulletService.reload();
  }
});

// Initial spawn
// setInterval(() => {
//   if(terroristService.terrorists.length < 20) {
//     terroristService.spawnTerrorists(10);
//   }
// }, 5000)


const { drawModal } = handleMenu(canvas, ctx, () => {
  handleMouseInteract(canvas, recoilService, bulletService);
  gameLoop();

  terroristService.spawnTerrorists(10);
});

drawModal();