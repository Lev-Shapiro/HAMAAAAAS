import { BulletService } from "./bullet.service";
import { RecoilService } from "./recoil";

export async function handleMouseInteract(
  canvas: HTMLCanvasElement,
  recoilService: RecoilService,
  bulletService: BulletService
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

  canvas.addEventListener("mousedown", handleShootAttempt);
  canvas.addEventListener("mousemove", handleMouseMove);

  canvas.addEventListener("pointerlockchange", () => {
    if (document.pointerLockElement !== canvas) {
      // ** Pointer lock is no longer active

      canvas.removeEventListener("mousedown", handleShootAttempt);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mousemove", handleMouseMove);
    }
  });
}
