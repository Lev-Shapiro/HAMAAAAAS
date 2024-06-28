import "./style.css";

const canvas = document.querySelector<HTMLCanvasElement>("#game")!;
if (!canvas) {
  throw new Error("Could not get canvas");
}

const ctx = canvas.getContext("2d")!;
if (!ctx) {
  throw new Error("Could not get 2d context");
}

const bulletImage = new Image();
bulletImage.src = "/bullet.webp";

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

interface Square {
  x: number;
  y: number;
  size: number;
  speed: number;
}

interface Bullet {
  x: number;
  y: number;
  width: number;
  height: number;
  speedX: number;
  speedY: number;
  angle: number;
}

const squares: Square[] = [];
const bullets: Bullet[] = [];

function spawnRedSquares(count: number) {
  for (let i = 0; i < count; i++) {
    const square: Square = {
      x: Math.random() * canvas.width,
      y: 50 + Math.random() * 50,
      size: 20,
      speed: 2,
    };
    squares.push(square);
  }
}

function drawSquare(square: Square) {
  ctx.fillStyle = "red";
  ctx.fillRect(square.x, square.y, square.size, square.size);
}

function updateSquares() {
  for (let i = squares.length - 1; i >= 0; i--) {
    squares[i].y += squares[i].speed;
    if (squares[i].y > 700) {
      squares.splice(i, 1);
    }
  }
}

function drawBullet(bullet: Bullet) {
  ctx.save();
  ctx.translate(bullet.x, bullet.y);
  ctx.rotate(bullet.angle);
  ctx.drawImage(
    bulletImage,
    -bullet.width / 2,
    -bullet.height / 2,
    bullet.width,
    bullet.height
  );
  ctx.restore();
  // ctx.drawImage(bulletImage, bullet.x - bullet.width / 2, bullet.y - bullet.height, bullet.width, bullet.height);
}

function updateTriangles() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].x += bullets[i].speedX;
    bullets[i].y += bullets[i].speedY;
    if (
      bullets[i].x < 0 ||
      bullets[i].x > canvas.width ||
      bullets[i].y > canvas.height
    ) {
      bullets.splice(i, 1);
    }
  }
}

function checkCollisions() {
  for (let i = squares.length - 1; i >= 0; i--) {
    for (let j = bullets.length - 1; j >= 0; j--) {
      if (
        squares[i].x < bullets[j].x + bullets[j].width / 2 &&
        squares[i].x + squares[i].size > bullets[j].x - bullets[j].width / 2 &&
        squares[i].y < bullets[j].y + bullets[j].height &&
        squares[i].y + squares[i].size > bullets[j].y
      ) {
        squares.splice(i, 1);
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
    const speed = 10;

    const bullet: Bullet = {
      x: canvas.width / 2,
      y: canvas.height,
      width: 10,
      height: 50,
      speedX: speed * Math.cos(angle),
      speedY: speed * Math.sin(angle),
      angle: angle + Math.PI / 2,
    };
    bullets.push(bullet);
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

  updateSquares();
  updateTriangles();
  checkCollisions();

  for (const square of squares) {
    drawSquare(square);
  }

  for (const bullet of bullets) {
    drawBullet(bullet);
  }

  requestAnimationFrame(gameLoop);
}

// Initial spawn
spawnRedSquares(10);
gameLoop();
