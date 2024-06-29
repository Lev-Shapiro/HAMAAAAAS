import { TerroristService } from "./terrorist.service";

export class TerroristWavesService {
    currentWave = 1;

    constructor(private readonly terroristService: TerroristService) {}

    handleWaves() {
        if(this.terroristService.terrorists.length === 0) {
            this.terroristService.spawnTerrorists(this.currentWave * 3);
            this.currentWave++;
        }

        setTimeout(() => {
            this.handleWaves();
        }, 5000);
    }
}