import { TerroristService } from "./terrorist.service";

export class TerroristWavesService {
  currentWave = 1;

  constructor(
    private terroristService: TerroristService
  ) {}

  handleWaves() {
    if (this.terroristService.terrorists.length === 0) {
      this.presentWave();
      this.terroristService.spawnTerrorists(this.currentWave * 2);
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
