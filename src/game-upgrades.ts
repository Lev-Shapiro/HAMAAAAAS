interface LevelPrice {
  value: number;
  price: number;
}
export class UpgradeItem {
  level = 1;

  constructor(
    public name: string,
    public maxLevel: number,
    public icon: string,
    public description: string,
    public valuePerLevel: LevelPrice[]
  ) {
    this.level = maxLevel;

    if (valuePerLevel.length === 0) {
      throw new Error("valuePerLevel must have at least one value");
    }

    if (maxLevel < 1) {
      throw new Error("maxLevel must be greater than 0");
    }
  }

  upgrade() {
    if (this.level < this.maxLevel) {
      this.level++;
    }

    if (this.level > this.valuePerLevel.length) {
      throw new Error("level must be less than valuePerLevel.length");
    }
  }

  get value() {
    return this.valuePerLevel[this.level - 1].value;
  }

  get upgradeCost() {
    const nextItemPrice = this.valuePerLevel[this.level];
    if (nextItemPrice === undefined) return null;

    return nextItemPrice.price;
  }
}

export class GameUpgrades {
  reloadSpeedItem = new UpgradeItem(
    "Reload Speed",
    5,
    "/reload.webp",
    "Reload your gun faster",
    // Price = prevPrice * 2 + 100
    [
      {
        value: 2500,
        price: 0,
      },
      {
        value: 2000,
        price: 300,
      },
      {
        value: 1500,
        price: 700,
      },
      {
        value: 1000,
        price: 1500,
      },
      {
        value: 500,
        price: 3100,
      },
    ]
  );

  capacityItem = new UpgradeItem(
    "Capacity",
    5,
    "/capacity.webp",
    "Increase bullet capacity",
    [
      {
        value: 16,
        price: 0,
      },
      {
        value: 24,
        price: 100,
      },
      {
        value: 32,
        price: 300,
      },
      {
        value: 48,
        price: 700,
      },
      {
        value: 64,
        price: 1200,
      },
    ]
  );

  damageItem = new UpgradeItem(
    "Damage",
    3,
    "/damage.webp",
    "Increase damage of your gun",
    [
      {
        value: 120,
        price: 0,
      },
      {
        value: 240,
        price: 250,
      },
      {
        value: 300,
        price: 500,
      },
    ]
  );

  helicopter = new UpgradeItem(
    "Helicopter",
    5,
    "/helicopter.png",
    "Buy a helicopter",
    [
      {
        value: 0,
        price: 0,
      },
      {
        value: 1,
        price: 750,
      },
      {
        value: 2,
        price: 2000,
      },
      {
        value: 3,
        price: 7000,
      },
      {
        value: 4,
        price: 15000,
      },
    ]
  );

  helicopterBulletReloadSpeed = new UpgradeItem(
    "Helicopter Bullet Reload Speed",
    4,
    "/helicopter.png",
    "Increase bullet reload speed of a helicopter",
    [
      {
        value: 7500,
        price: 0,
      },
      {
        value: 5000,
        price: 1000,
      },
      {
        value: 4000,
        price: 2000,
      },
      {
        value: 2500,
        price: 5000,
      },
    ]
  );

  helicopterMissileReloadSpeed = new UpgradeItem(
    "Helicopter Missile Reload Speed",
    3,
    "/helicopter.png",
    "Increase missile reload speed of a helicopter",
    [
      {
        value: 10000,
        price: 1000,
      },
      {
        value: 5000,
        price: 2000,
      },
      {
        value: 3000,
        price: 5000,
      },
    ]
  );

  helicopterMissileDamage = new UpgradeItem(
    "Helicopter Missile Damage",
    1,
    "/helicopter.png",
    "Increase missile damage of a helicopter",
    [
      {
        value: 10000,
        price: 0,
      },
    ]
  );
}
