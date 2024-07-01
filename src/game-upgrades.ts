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
    const nextItemPrice = this.valuePerLevel[this.level]
    if(nextItemPrice === undefined) return null;

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
            price: 0
        },
        {
            value: 24,
            price: 100
        },
        {
            value: 32,
            price: 300
        },
        {
            value: 48,
            price: 700
        },
        {
            value: 64,
            price: 1200
        },
    ]
  )

  damageItem = new UpgradeItem(
    "Damage",
    4,
    "/damage.webp",
    "Increase damage of your gun",
    [
        {
            value: 35,
            price: 0
        },
        {
            value: 60,
            price: 75
        },
        {
            value: 90,
            price: 150
        },
        {
            value: 120,
            price: 300
        },
    ]
  )
}
