import { BulletService } from "./bullet.service";
import { RecoilService } from "./recoil";

export function handleMouseInteract(
  canvas: HTMLCanvasElement,
  recoilService: RecoilService,
  bulletService: BulletService
) {
  canvas.addEventListener("mousedown", () => {
    // const rect = canvas.getBoundingClientRect();
    // targetX = event.clientX - rect.left;
    // targetY = event.clientY - rect.top;

    const interval = setInterval(() => {
      //   const dx = targetX - canvas.width / 2;
      //   const dy = targetY - canvas.height;

      const dx = recoilService.cursorX - canvas.width / 2;
      const dy = recoilService.cursorY - canvas.height;

      const angle = Math.atan2(dy, dx);

      bulletService.spawnBullet(canvas.width / 2, canvas.height, angle);
      recoilService.recoil();
    }, 100);

    canvas.addEventListener(
      "mouseup",
      () => {
        clearInterval(interval);
      },
      { once: true }
    );
  });

  canvas.addEventListener("mousemove", (e) => recoilService.updateCursorPosition(e));
  //   canvas.addEventListener("mousedown", (event) => {
  //     const rect = canvas.getBoundingClientRect();
  //     targetX = event.clientX - rect.left;
  //     targetY = event.clientY - rect.top;

  //     const interval = setInterval(() => {
  //       const dx = targetX - canvas.width / 2;
  //       const dy = targetY - canvas.height;

  //       const angle = Math.atan2(dy, dx);

  //       bulletService.spawnBullet(canvas.width / 2, canvas.height, angle);
  //     }, 100);

  //     const mouseMoveHandler = (moveEvent: MouseEvent) => {
  //       targetX = moveEvent.clientX - rect.left;
  //       targetY = moveEvent.clientY - rect.top;
  //     };

  //     mouseMoveHandler(event);
  //     canvas.addEventListener("mousemove", mouseMoveHandler);

  //     canvas.addEventListener(
  //       "mouseup",
  //       () => {
  //         clearInterval(interval);
  //         canvas.removeEventListener("mousemove", mouseMoveHandler);
  //       },
  //       { once: true }
  //     );
  //   });
}
