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
  let interval: number | null = null;

  function handleMouseMove(e: MouseEvent) {
    recoilService.updateCursorPosition(e);
  }

  // function handleTouchMove(e: TouchEvent) {
  //   recoilService.updateCursorPositionTouch(e.touches[0]);
  // }

  function handleTouchStart(e: TouchEvent) {
    for (let i = 0; i < e.touches.length; i++) {
      const touch = e.touches[i];

      const { clientX, clientY } = touch;
      const dx = clientX - canvas.width / 2;
      const dy = clientY - canvas.height;

      createBullet(dx, dy);
    }
  }

  function handleResetShootInterval() {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  }

  const createBullet = (dx: number, dy: number) => {
    const angle = Math.atan2(dy, dx);

    bulletService.spawnBullet(canvas.width / 2, canvas.height, angle);
    recoilService.recoil();
  };

  const handleShootAttempt = () => {
    const INTERVAL_INTENCITY = isMobile() ? 250 : 100;

    interval = setInterval(() => {
      const dx = recoilService.cursorX - canvas.width / 2;
      const dy = recoilService.cursorY - canvas.height;

      createBullet(dx, dy);
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
    if (e.key === "m" || e.key === "M" || e.key === "м" || e.key === "М" || e.key === "מ") {
      handleOpenMenu();
      return;
    }

    // R = Reload
    if (e.key === "r" || e.key === "R" || e.key === "к" || e.key === "К" || e.key === "ר") {
      bulletService.reload();
      return;
    }

    // S = Shop
    if (e.key === "s" || e.key === "S" || e.key === "ы" || e.key === "Ы" || e.key === "ד") {
      handleToggleShop();
      return;
    }
  }

  handleResetShootInterval();

  if (isMobile()) {
    canvas.addEventListener("touchstart", handleTouchStart);
    // canvas.addEventListener("touchmove", handleTouchMove);
    canvas.addEventListener("touchend", handleResetShootInterval);
  } else {
    canvas.addEventListener("mousedown", handleShootAttempt);
    canvas.addEventListener("mousemove", handleMouseMove);

    document.addEventListener("keydown", handleKeyPress);
  }

  function deactivateUserMotion() {
    handleResetShootInterval();

    if (isMobile()) {
      canvas.removeEventListener("touchstart", handleTouchStart);
      // canvas.removeEventListener("touchmove", handleTouchMove);
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
