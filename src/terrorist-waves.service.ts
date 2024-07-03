import { DataModel } from "./data/data.model";
import { TerroristService } from "./terrorist.service";

export class TerroristWavesService {
  currentWave = 0;

  constructor(
    private canvas: HTMLCanvasElement,
    private ctx: CanvasRenderingContext2D,
    private terroristService: TerroristService,
    private coinBank: DataModel
  ) {}

  spawnTerroristWave() {
    //TODO: Wave incrementation when everything is too easy

    const totalTerrorists = this.terroristService.terrorists.length;

    if (totalTerrorists === 0) {
      this.currentWave++;

      this.terroristService.spawnTerrorists(this.currentWave * 2);

      if (this.currentWave > 10) {
        this.terroristService.spawnCarTerrorists(
          Math.floor(this.currentWave / 10) + Math.round(Math.random() * 1)
        );
      }

      if (this.currentWave > 30) {
        this.terroristService.spawnSinwar(
          Math.floor(this.currentWave / 30) + Math.round(Math.random() * 1)
        );
      }

      if (this.currentWave % 10 === 0 && this.currentWave !== 0) {
        this.coinBank.data.value += 50 * this.currentWave;
      }
    }
  }

  drawWaveNumber() {
    // TODO: Render temporarily wave number in a visually appealing way in the left corner

    this.ctx.fillStyle = "black";
    this.ctx.font = "bold 24px Helvetica";
    this.ctx.fillText("WAVE " + this.currentWave, this.canvas.width / 2, 34);
  }
}
