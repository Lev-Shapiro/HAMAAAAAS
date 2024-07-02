import { HelicopterBulletService } from "./bullet/helicopter-bullet.service";
import { UserBulletService } from "./bullet/user-bullet.service";
import { DataModel } from "./data/data.model";
import { DynamicState, DynamicType } from "./dynamic-state";
import { GameUpgrades } from "./game-upgrades";
import { HelicopterService } from "./helicopter.service";
import { MenuService } from "./menu.service";
import { BallisticObjectService } from "./missile/ballistic-object.service";
import { HelicopterMissileService } from "./missile/helicopter-missile.service";
import { RecoilService } from "./recoil";
import { ShopUI } from "./shop-ui";
import { TerroristType } from "./terrorist-type.enum";
import { TerroristWavesService } from "./terrorist-waves.service";
import { TerroristService } from "./terrorist.service";

export class GameServices {
  ammoLeftInfo: DataModel;
  healthInfo: DataModel;
  recoilService: RecoilService;
  bulletService: BallisticObjectService;
  missileService: BallisticObjectService;
  userBulletService: UserBulletService;
  terroristService: TerroristService;
  coinBank: DataModel;
  menuService: MenuService;
  terroristWaves: TerroristWavesService;
  upgrades: GameUpgrades;
  dynamicState: DynamicState;
  helicopterService: HelicopterService;
  helicopterBulletService: HelicopterBulletService;
  helicopterMissileService: HelicopterMissileService;
  shopUI: ShopUI;

  constructor(
    public canvas: HTMLCanvasElement,
    public ctx: CanvasRenderingContext2D,
    public shopModal: HTMLElement,
    public shopItems: HTMLElement
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
      value: 99999,
      icon: "/coin.webp",
      iconWidth: 30,
      iconHeight: 30,
    });

    const upgrades = new GameUpgrades();

    const dynamicState = new DynamicState(upgrades);

    const bulletService = new BallisticObjectService(
      canvas,
      ctx,
      {
        width: 10,
        height: 30,
        image: "/bullet.webp",
        speed: 10,
        damageKeyReference: DynamicType.MissileDamage,
      },
      dynamicState
    );

    const missileService = new BallisticObjectService(
      canvas,
      ctx,
      {
        width: 251 / 4,
        height: 52 / 4,
        image: "/missile.webp",
        speed: 12,
        damageKeyReference: DynamicType.MissileDamage,
      },
      dynamicState
    );

    const userBulletService = new UserBulletService(
      bulletService,
      ammoLeftInfo,
      upgrades
    );

    const recoilService = new RecoilService(canvas, ctx);

    const terroristService = new TerroristService(
      canvas,
      ctx,
      {
        [TerroristType.SOLIDER]: {
          speed: 50,
          health: 100,
          width: 35,
          height: 70,
        },
        [TerroristType.CAR_TERRORIST]: {
          speed: 75,
          health: 500,
          width: 70,
          height: 70,
        },
      },
      healthInfo
    );

    const helicopterService = new HelicopterService(canvas, ctx, upgrades, {
      width: 70,
      height: 70,
      image: "/helicopter.png",
    });

    const helicopterBulletService = new HelicopterBulletService(
      canvas,
      upgrades,
      terroristService,
      helicopterService,
      bulletService,
      {
        capacity: 24,
      }
    );

    const helicopterMissileService = new HelicopterMissileService(
      canvas,
      upgrades,
      terroristService,
      helicopterService,
      missileService,
      {
        capacity: 1,
      }
    );

    const menuService = new MenuService(canvas, ctx);
    const terroristWavesService = new TerroristWavesService(terroristService);

    const shopUI = new ShopUI(coinBank, shopModal, shopItems);

    this.ammoLeftInfo = ammoLeftInfo;
    this.healthInfo = healthInfo;
    this.coinBank = coinBank;
    this.bulletService = bulletService;
    this.missileService = missileService;
    this.userBulletService = userBulletService;
    this.recoilService = recoilService;
    this.terroristService = terroristService;
    this.menuService = menuService;
    this.terroristWaves = terroristWavesService;
    this.upgrades = upgrades;
    this.helicopterService = helicopterService;
    this.helicopterBulletService = helicopterBulletService;
    this.helicopterMissileService = helicopterMissileService;
    this.shopUI = shopUI;
    this.dynamicState = dynamicState;
  }
}
