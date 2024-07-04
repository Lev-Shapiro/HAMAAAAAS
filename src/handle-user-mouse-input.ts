import { isMobile } from "./isMobile";
import { RecoilService } from "./recoil";
import { UserBulletService } from "./user-bullet.service";

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

  function handleTouchMove(e: TouchEvent) {
    recoilService.updateCursorPositionTouch(e.touches[0]);
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

    // PC
    canvas.addEventListener("mouseup", handleMouseUp, {
      once: true,
    });

    // Mobile
    canvas.addEventListener("touchend", handleMouseUp, {
      once: true,
    });
  };

  // const handlePressShoot = () => {
  //   const dx = recoilService.cursorX - canvas.width / 2;
  //   const dy = recoilService.cursorY - canvas.height;

  //   const angle = Math.atan2(dy, dx);

  //   bulletService.spawnBullet(canvas.width / 2, canvas.height, angle);
  //   recoilService.recoil();
  // };

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
    if (e.key === "s") {
      handleToggleShop();
      return;
    }
  }

  // PC
  canvas.addEventListener("mousedown", handleShootAttempt);
  canvas.addEventListener("mousemove", handleMouseMove);
  // canvas.addEventListener("click", handlePressShoot);

  // Mobile
  canvas.addEventListener("touchstart", handleShootAttempt);
  canvas.addEventListener("touchmove", handleTouchMove);

  document.addEventListener("keydown", handleKeyPress);

  function handleLock() {
    if (document.pointerLockElement === canvas) {
      // ** Pointer lock is active
    } else {
      // ** Pointer lock is no longer active

      canvas.removeEventListener("mousedown", handleShootAttempt);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mousemove", handleMouseMove);

      canvas.removeEventListener("touchstart", handleShootAttempt);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleMouseUp);

      document.removeEventListener("keydown", handleKeyPress);
      if(!isMobile()) document.removeEventListener("pointerlockchange", handleLock);
    }
  }

  if(!isMobile()) document.addEventListener("pointerlockchange", handleLock);
}
