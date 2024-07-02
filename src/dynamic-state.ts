import { GameUpgrades, UpgradeItem } from "./game-upgrades";

export enum DynamicType {
  BulletDamage,
  MissileDamage,
}

export class DynamicState {
  accessors: { [key in DynamicType]: UpgradeItem };

  constructor(upgrades: GameUpgrades) {
    this.accessors = {
      [DynamicType.BulletDamage]: upgrades.damageItem,
      [DynamicType.MissileDamage]: upgrades.helicopterMissileDamage,
    };
  }
}
