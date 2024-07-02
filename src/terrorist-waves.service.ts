import { TerroristService } from "./terrorist.service";

export class TerroristWavesService {
  currentWave = 101;

  constructor(private terroristService: TerroristService) {}

  handleWaves() {
    //TODO: Wave incrementation when everything is too easy

    const totalTerrorists = this.terroristService.terrorists.length;
    if (totalTerrorists === 0) {
    //   this.presentWave();
    //   this.terroristService.spawnTerrorists(this.currentWave * 2);

    //   if (this.currentWave > 10) {
    //     this.terroristService.spawnCarTerrorists(
    //       Math.floor(this.currentWave / 10) + Math.round(Math.random() * 1)
    //     );
    //   }

      if(this.currentWave > 100) {
        this.terroristService.spawnPutin(2);
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
