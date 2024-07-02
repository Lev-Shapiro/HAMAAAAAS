interface ExplosionServiceOptions {
  width: number;
  height: number;
}
export class ExplosionService {
  constructor(
    private explosionContainer: HTMLElement,
    private options: ExplosionServiceOptions
  ) {}

  drawExplosion(x: number, y: number) {
    const explosion = document.createElement("div");
    explosion.classList.add("explosion");
    explosion.style.left = `${x}px`;
    explosion.style.top = `${y}px`;

    const video = document.createElement("video");
    video.width = this.options.width;
    video.height = this.options.height;
    video.src = "/explosion.webm";
    video.muted = true;
    video.autoplay = true;

    explosion.appendChild(video);
    this.explosionContainer.appendChild(explosion);

    setTimeout(() => {
      explosion.remove();
    }, 1500);
  }
}
