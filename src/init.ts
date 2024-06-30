import { BulletService } from "./bullet.service";
import { DataModel } from "./data/data.model";
import { GameUpgrades } from "./game-upgrades";
import { MenuService } from "./menu.service";
import { RecoilService } from "./recoil";
import { ShopUI } from "./shop-ui";
import { TerroristWavesService } from "./terrorist-waves.service";
import { TerroristService } from "./terrorist.service";

export class GameServices {
  ammoLeftInfo: DataModel;
  healthInfo: DataModel;
  recoilService: RecoilService;
  bulletService: BulletService;
  terroristService: TerroristService;
  coinBank: DataModel;
  menuService: MenuService;
  terroristWaves: TerroristWavesService;
  upgrades: GameUpgrades;

  constructor(
    public canvas: HTMLCanvasElement,
    public ctx: CanvasRenderingContext2D,
    public shopUI: ShopUI
  ) {
    const ammoLeftInfo = new DataModel(canvas, ctx, {
      value: 0,
      icon: "/bullet.webp",
      iconWidth: 12,
      iconHeight: 30,
    });

    const healthInfo = new DataModel(canvas, ctx, {
      value: 100,
      icon: "/heart.webp",
      iconWidth: 30,
      iconHeight: 30,
    });

    const coinBank = new DataModel(canvas, ctx, {
      value: 0,
      icon: "/coin.webp",
      iconWidth: 30,
      iconHeight: 30,
    });

    const upgrades = new GameUpgrades()

    const bulletService = new BulletService(
      canvas,
      ctx,
      {
        speed: 10,
        width: 10,
        height: 30,
      },
      upgrades,
      ammoLeftInfo
    );

    const recoilService = new RecoilService(canvas, ctx);

    const terroristService = new TerroristService(
      canvas,
      ctx,
      {
        speed: 0.2,
        width: 35,
        height: 70,
      },
      healthInfo
    );

    const menuService = new MenuService(canvas, ctx);
    const terroristWavesService = new TerroristWavesService(terroristService);
    
    this.ammoLeftInfo = ammoLeftInfo;
    this.healthInfo = healthInfo;
    this.coinBank = coinBank;
    this.bulletService = bulletService;
    this.recoilService = recoilService;
    this.terroristService = terroristService;
    this.menuService = menuService;
    this.terroristWaves = terroristWavesService;
    this.upgrades = upgrades
  }
}
