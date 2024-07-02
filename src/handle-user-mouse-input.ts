import { UserBulletService } from "./bullet/user-bullet.service";
import { RecoilService } from "./recoil";

export async function handleUserMouseInput(
  canvas: HTMLCanvasElement,
  recoilService: RecoilService,
  bulletService: UserBulletService,
  
  handleToggleShop: () => void,
  handleOpenMenu: () => void
) {
  let interval: number;

  function handleMouseMove(e: MouseEvent) {
    recoilService.updateCursorPosition(e);
  }

  function handleMouseUp() {
    clearInterval(interval);
  }

  const handleShootAttempt = () => {
    interval = setInterval(() => {
      const dx = recoilService.cursorX - canvas.width / 2;
      const dy = recoilService.cursorY - canvas.height;

      const angle = Math.atan2(dy, dx);

      bulletService.spawnBullet(canvas.width / 2, canvas.height, angle);
      recoilService.recoil();
    }, 100);

    canvas.addEventListener("mouseup", handleMouseUp, {
      once: true,
    });
  };

  function handleKeyPress(e: KeyboardEvent) {
    // M = Menu
    if (e.key === "m") {
      handleOpenMenu();
      return;
    }

    // R = Reload
    if (e.key === "r") {
      bulletService.reload();
      return;
    }

    // S = Shop
    if(e.key === "s") {
      handleToggleShop();
      return;
    }
  }

  canvas.addEventListener("mousedown", handleShootAttempt);
  canvas.addEventListener("mousemove", handleMouseMove);

  document.addEventListener("keydown", handleKeyPress);
  
  function handleLock() {
    if (document.pointerLockElement === canvas) {
      // ** Pointer lock is active
    } else {
      // ** Pointer lock is no longer active

      canvas.removeEventListener("mousedown", handleShootAttempt);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mousemove", handleMouseMove);

      document.removeEventListener("keydown", handleKeyPress);
      document.removeEventListener("pointerlockchange", handleLock);
    }
  }

  document.addEventListener("pointerlockchange", handleLock);
}
