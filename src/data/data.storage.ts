import { Data, DataModel } from "./data.model";

export class InfographicsService {
  private dataModels: { [key: string]: DataModel } = {};

  constructor(
    private canvas: HTMLCanvasElement,
    private ctx: CanvasRenderingContext2D
  ) {}

  addData(name: string, data: Data) {
    this.dataModels[name] = new DataModel(this.canvas, this.ctx, data);
  }

  updateDataModel(name: string, value: number) {
    this.dataModels[name].data.value = value;
  }

  drawData() {
    Object.values(this.dataModels).forEach((dataModel, index) => {
      dataModel.drawData(index);
    });
  }
}
