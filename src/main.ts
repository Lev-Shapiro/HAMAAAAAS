import { BulletService } from "./bullet.service";
import { DataModel } from "./data/data.model";
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
})

const healthInfo = new DataModel(canvas, ctx, {
  value: 100,
  icon: "/heart.webp",
  iconWidth: 30,
  iconHeight: 30,
})

const bulletService = new BulletService(canvas, ctx, {
  speed: 10,
  width: 10,
  height: 30,
  capacity: 30,
  rearmTime: 1000,
}, ammoLeftInfo);

const terroristService = new TerroristService(canvas, ctx, {
  speed: 0.5,
  width: 20,
  height: 20,
});


function checkCollisions() {
  const bullets = bulletService.bullets, terrorists = terroristService.terrorists;

  for (let i = terrorists.length - 1; i >= 0; i--) {
    for (let j = bullets.length - 1; j >= 0; j--) {
      if (
        terrorists[i].x < bullets[j].x + bullets[j].width / 2 &&
        terrorists[i].x + terrorists[i].width > bullets[j].x - bullets[j].width / 2 &&
        terrorists[i].y < bullets[j].y + bullets[j].height &&
        terrorists[i].y + terrorists[i].height > bullets[j].y
      ) {
        terrorists.splice(i, 1);
        bullets.splice(j, 1);
        break;
      }
    }
  }
}

let targetX = 0;
let targetY = 0;

canvas.addEventListener("mousedown", (event) => {
  const rect = canvas.getBoundingClientRect();
  targetX = event.clientX - rect.left;
  targetY = event.clientY - rect.top;

  const interval = setInterval(() => {
    const dx = targetX - canvas.width / 2;
    const dy = targetY - canvas.height;

    const angle = Math.atan2(dy, dx);

    bulletService.spawnBullet(canvas.width / 2, canvas.height, angle);
  }, 100);

  const mouseMoveHandler = (moveEvent: MouseEvent) => {
    targetX = moveEvent.clientX - rect.left;
    targetY = moveEvent.clientY - rect.top;
  };

  canvas.addEventListener("mousemove", mouseMoveHandler);

  canvas.addEventListener(
    "mouseup",
    () => {
      clearInterval(interval);
      canvas.removeEventListener("mousemove", mouseMoveHandler);
    },
    { once: true }
  );
});

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  terroristService.rerenderTerrorists();
  bulletService.rerenderBullets();
  // drawAmmoBox();
  checkCollisions();

  ammoLeftInfo.drawData(0);
  healthInfo.drawData(1);
  terroristService.drawAllTerrorists();
  bulletService.drawAllBullets();

  requestAnimationFrame(gameLoop);
}

// Function to draw the ammo box
// function drawAmmoBox() {
//   const ammoText = `Ammo Left: ${bulletService.ammoLeft}`;
//   ctx.font = "20px Arial";
//   ctx.fillStyle = "white";
//   ctx.textAlign = "right";
//   ctx.textBaseline = "top";

//   // Box background
//   const padding = 10;
//   const textWidth = ctx.measureText(ammoText).width;
//   const boxWidth = textWidth + padding * 2;
//   const boxHeight = 40;
//   ctx.fillStyle = "rgba(0, 0, 0, 0.5)"; // Semi-transparent background
//   ctx.fillRect(canvas.width - boxWidth - padding, padding, boxWidth, boxHeight);

//   // Ammo text
//   ctx.fillStyle = "white";
//   ctx.fillText(ammoText, canvas.width - 2*padding, boxHeight / 2);
// }

// When user presses R, reload
document.addEventListener("keydown", (event) => {
  if (event.key === "r") {
    bulletService.reload();
  }
});

// Initial spawn
// terroristService.spawnTerrorists(10);
gameLoop();
