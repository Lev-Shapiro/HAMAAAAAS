import { BallisticObjectService } from "./ballistic/ballistic-object.service";
import { DataModel } from "./data/data.model";
import { ExplosionService } from "./explosion.service";
import { GameButtonsService } from "./game-buttons.service";
import { GameUpgrades } from "./game-upgrades";
import { HelicopterBulletService } from "./helicopter/helicopter-bullet.service";
import { HelicopterMissileService } from "./helicopter/helicopter-missile.service";
import { HelicopterService } from "./helicopter/helicopter.service";
import { MenuService } from "./menu.service";
import { RecoilService } from "./recoil";
import { ScoreCounter } from "./score-counter";
import { ShopUI } from "./shop-ui";
import { TerroristType } from "./terrorist-type.enum";
import { TerroristWavesService } from "./terrorist-waves.service";
import { TerroristService } from "./terrorist.service";
import { UserBulletService } from "./user-bullet.service";

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
  helicopterService: HelicopterService;
  helicopterBulletService: HelicopterBulletService;
  helicopterMissileService: HelicopterMissileService;
  explosionService: ExplosionService;
  shopUI: ShopUI;
  scoreCounter: ScoreCounter;
  gameButtons: GameButtonsService;

  constructor(
    public canvas: HTMLCanvasElement,
    public ctx: CanvasRenderingContext2D,
    public explosionContainer: HTMLElement,
    public shopModal: HTMLElement,
    public shopItems: HTMLElement,
    public reloadScreen: HTMLElement,
    public terminateToAshes: () => void
  ) {
    const ammoLeftInfo = new DataModel(canvas, ctx, {
      value: 0,
      icon: "/bullet.webp",
      iconWidth: 30,
      iconHeight: 10,
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

    const upgrades = new GameUpgrades();

    const bulletService = new BallisticObjectService(canvas, ctx, {
      width: 30,
      height: 10,
      image: "/bullet.webp",
      speed: 10,
      damage: upgrades.damageItem,
    });

    const missileService = new BallisticObjectService(canvas, ctx, {
      width: 251 / 4,
      height: 52 / 4,
      image: "/missile.webp",
      speed: 20,
      damage: upgrades.helicopterMissileDamage,
    });

    const userBulletService = new UserBulletService(
      bulletService,
      ammoLeftInfo,
      upgrades,
      reloadScreen
    );

    const recoilService = new RecoilService(canvas, ctx);

    const terroristService = new TerroristService(
      canvas,
      ctx,
      {
        [TerroristType.SOLIDER]: {
          speed: 30,
          health: 100,
          width: 35,
          height: 70,
        },
        [TerroristType.CAR_TERRORIST]: {
          speed: 80,
          health: 500,
          width: 70,
          height: 70,
        },
        [TerroristType.SINWAR]: {
          speed: 10,
          health: 99999,
          width: 412 / 4,
          height: 606 / 4,
        },
        [TerroristType.BOMBER]: {
          speed: 60,
          health: 250,
          width: 119 / 4,
          height: 256 / 4,
        }
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
      bulletService
    );

    const helicopterMissileService = new HelicopterMissileService(
      canvas,
      upgrades,
      terroristService,
      helicopterService,
      missileService
    );

    const explosionService = new ExplosionService(explosionContainer, {
      width: 200,
      height: 200,
    });

    const terroristWavesService = new TerroristWavesService(
      canvas,
      ctx,
      terroristService,
      explosionService,
      coinBank
    );
    
    const shopUI = new ShopUI(coinBank, shopModal, shopItems);
    const scoreCounter = new ScoreCounter();
    const menuService = new MenuService(canvas, ctx, scoreCounter, healthInfo);

    const gameButtons = new GameButtonsService(
      canvas,
      ctx,
    );

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
    this.explosionService = explosionService;
    this.scoreCounter = scoreCounter;
    this.gameButtons = gameButtons;
  }
}
