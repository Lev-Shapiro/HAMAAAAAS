import { TerroristService } from "./terrorist.service";

export class TerroristWavesService {
  currentWave = 1;

  constructor(private terroristService: TerroristService) {}

  handleWaves() {
    const totalTerrorists = this.terroristService.terrorists.length;
    if (totalTerrorists === 0) {
      this.presentWave();
      this.terroristService.spawnTerrorists(this.currentWave * 2);

      if (this.currentWave > 10) {
        this.terroristService.spawnCarTerrorists(
          Math.floor(this.currentWave / 10) + Math.round(Math.random() * 1)
        );
      }
      this.currentWave++;
    }

    setTimeout(() => {
      this.handleWaves();
    }, 5000);
  }

  private presentWave() {
    // TODO: Present wave
  }
}
