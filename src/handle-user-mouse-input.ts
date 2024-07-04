import { isMobile } from "./isMobile";
import { RecoilService } from "./recoil";
import { UserBulletService } from "./user-bullet.service";

export function handleUserMouseInput(
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

  function handleResetShootInterval() {
    clearInterval(interval);
  }

  const handleShootAttempt = () => {
    const INTERVAL_INTENCITY = isMobile() ? 250 : 100;

    interval = setInterval(() => {
      const dx = recoilService.cursorX - canvas.width / 2;
      const dy = recoilService.cursorY - canvas.height;

      const angle = Math.atan2(dy, dx);

      bulletService.spawnBullet(canvas.width / 2, canvas.height, angle);
      recoilService.recoil();
    }, INTERVAL_INTENCITY);

    if (isMobile()) {
      canvas.addEventListener("touchend", handleResetShootInterval, {
        once: true,
      });
    } else {
      canvas.addEventListener("mouseup", handleResetShootInterval, {
        once: true,
      });
    }
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
    if (e.key === "s") {
      handleToggleShop();
      return;
    }
  }

  if (isMobile()) {
    canvas.addEventListener("touchstart", handleShootAttempt);
    canvas.addEventListener("touchmove", handleTouchMove);
    canvas.addEventListener("touchend", handleResetShootInterval);
  } else {
    canvas.addEventListener("mousedown", handleShootAttempt);
    canvas.addEventListener("mousemove", handleMouseMove);
    // canvas.addEventListener("click", handleShootAttempt);

    document.addEventListener("keydown", handleKeyPress);
  }

  function deactivateUserMotion() {
    if (isMobile()) {
      canvas.removeEventListener("touchstart", handleShootAttempt);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleResetShootInterval);
    } else {
      canvas.removeEventListener("mousedown", handleShootAttempt);
      canvas.removeEventListener("mouseup", handleResetShootInterval);
      canvas.removeEventListener("mousemove", handleMouseMove);

      document.removeEventListener("keydown", handleKeyPress);
    }
  }

  return deactivateUserMotion;
}
