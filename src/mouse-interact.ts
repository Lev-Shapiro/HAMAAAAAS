import { BulletService } from "./bullet.service";
import { RecoilService } from "./recoil";

export async function handleMouseInteract(
  canvas: HTMLCanvasElement,
  recoilService: RecoilService,
  bulletService: BulletService
) {
  let interval: number;

  const handleShootAttempt = () => {
    interval = setInterval(() => {
      const dx = recoilService.cursorX - canvas.width / 2;
      const dy = recoilService.cursorY - canvas.height;

      const angle = Math.atan2(dy, dx);

      bulletService.spawnBullet(canvas.width / 2, canvas.height, angle);
      recoilService.recoil();
    }, 100);

    canvas.addEventListener("mouseup", () => clearInterval(interval), {
      once: true,
    });
  };

  canvas.addEventListener("click", () => {
    canvas.requestPointerLock();

    canvas.addEventListener("mousedown", handleShootAttempt);
    canvas.addEventListener("mousemove", (e) =>
      recoilService.updateCursorPosition(e)
    );
  });

  canvas.addEventListener("pointerlockchange", () => {
    if (document.pointerLockElement === canvas) {
      // ** Pointer lock is active

      
    } else{
      // ** Pointer lock is no longer active

      canvas.removeEventListener("click", handleShootAttempt);
      canvas.removeEventListener("mousedown", handleShootAttempt);
      canvas.removeEventListener("mouseup", () => clearInterval(interval));

      canvas.removeEventListener("mousemove", (e) =>
        recoilService.updateCursorPosition(e)
      );
    }
  });
}
