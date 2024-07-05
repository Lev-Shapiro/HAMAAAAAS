interface LevelPrice {
  value: number;
  price: number;
}

export class UpgradeItem {
  level = 0;

  constructor(
    public name: string,
    public maxLevel: number,
    public icon: string,
    public description: string,
    public valuePriceFormula: (level: number) => LevelPrice
  ) {
    if (maxLevel < 1) {
      throw new Error("maxLevel must be greater than 0");
    }
  }

  upgrade() {
    if (this.level < this.maxLevel) {
      this.level++;
    }
  }

  get value() {
    return this.valuePriceFormula(this.level).value;
  }

  get upgradeCost() {
    const nextItemPrice = this.valuePriceFormula(this.level + 1);
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
    (level) => {
      const basePrice = 100;
      const exponent = 1.5;

      const baseReload = 2500; // in milliseconds
      const coefficient = 0.4;

      return {
        value: Math.round(baseReload / (1 + coefficient * level)),
        price: Math.round(basePrice * Math.pow(level, exponent)),
      };
    }
  );

  capacityItem = new UpgradeItem(
    "Capacity",
    5,
    "/capacity.webp",
    "Increase bullet capacity",
    (level) => {
      const baseAmmo = 32,
        basePrice = 10,
        priceRate = 1.5,
        ammoIncrement = 16;

      const value = baseAmmo + ammoIncrement * level;
      const price = basePrice * (1 + priceRate) ** level;

      return { value, price };
    }
  );

  damageItem = new UpgradeItem(
    "Damage",
    10,
    "/damage.webp",
    "Increase damage of your gun",
    (level) => {
      const value = 120 + 60 * level;
      const price = 250 * level;

      return { value, price };
    }
  );

  helicopter = new UpgradeItem(
    "Helicopter",
    6,
    "/helicopter.webp",
    "Buy a helicopter",
    (level) => {
      return {
        value: level,
        price: 750 * Math.pow(level, 2)
      }
    },
  );

  helicopterBulletReloadSpeed = new UpgradeItem(
    "Helicopter Bullet Reload Speed",
    100,
    "/helicopter.webp",
    "Increase bullet reload speed of a helicopter",
    (level) => {
      const basePrice = 1000;
      const exponent = 1.2;

      const baseReload = 7500; // in milliseconds
      const coefficient = 0.4;

      return {
        value: Math.round(baseReload / (1 + coefficient * level)),
        price: Math.round(basePrice * Math.pow(level, exponent)),
      }
    }
  );

  helicopterMissileReloadSpeed = new UpgradeItem(
    "Helicopter Missile Reload Speed",
    25,
    "/helicopter.webp",
    "Increase missile reload speed of a helicopter",
    (level) => {
      const basePrice = 2000;
      const exponent = 1.4;

      const baseReload = 10000; // in milliseconds

      return {
        value: baseReload / (level + 1),
        price: Math.round(basePrice * Math.pow(level, exponent)),
      }
    }
  );

  helicopterMissileDamage = new UpgradeItem(
    "Helicopter Missile Damage",
    1,
    "/helicopter.webp",
    "Increase missile damage of a helicopter",
    () => ({
      price: 0,
      value: 10000
    })
  );
}
