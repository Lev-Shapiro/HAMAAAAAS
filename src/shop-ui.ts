import { DataModel } from "./data/data.model";
import { UpgradeItem } from "./game-upgrades";

interface ShopItem extends UpgradeItem {}
export class ShopUI {
  items: { [key: string]: ShopItem } = {};

  constructor(
    private coinBank: DataModel,
    private modalContainer: HTMLElement,
    private itemsContainer: HTMLElement
  ) {}

  toggleModal(): void {
    this.renderItems();
    this.modalContainer.classList.toggle("active");
  }

  openModalIfClosed(): void {
    if (!this.modalContainer.classList.contains("active")) {
      this.modalContainer.classList.add("active");
      this.renderItems();
    }
  }

  closeModalIfOpened(): void {
    if (this.modalContainer.classList.contains("active")) {
      this.modalContainer.classList.remove("active");
    }
  }

  renderItem(params: ShopItem): void {
    // Create the card container
    const card = document.createElement("div");
    card.className = "card";

    // Create and append the image
    const img = document.createElement("img");
    img.src = params.icon;
    img.alt = params.name;
    img.className = "product-image";
    img.width = 100;
    img.height = 100;
    card.appendChild(img);

    // Create and append the card content container
    const cardContent = document.createElement("div");
    cardContent.className = "card-content";

    // Create and append the title
    const title = document.createElement("h2");
    title.className = "product-title";
    title.textContent = params.name;
    cardContent.appendChild(title);

    // Create and append the rating
    const rating = document.createElement("div");
    rating.className = "rating";
    for (let i = 0; i < params.maxLevel; i++) {
      const star = document.createElement("span");
      star.className = "star";
      star.innerHTML =
        i < params.level
          ? "&#9733;"
          : "&#9734;";
      rating.appendChild(star);
    }
    cardContent.appendChild(rating);

    const cost = params.upgradeCost;

    if (cost) {
      // Create and append the price
      const price = document.createElement("p");
      price.className = "price";
      const priceValue = document.createElement("span");
      priceValue.className = "price-value";
      priceValue.textContent = cost + "$";
      price.appendChild(priceValue);
      cardContent.appendChild(price);

      // Create and append the button
      const button = document.createElement("button");
      button.className = "upgrade-button";
      button.textContent = "Upgrade";

      if (this.coinBank.data.value >= cost) {
        button.onclick = () => {
          this.coinBank.data.value -= cost;
          params.upgrade();
          this.renderItems();
        };
      } else {
        button.disabled = true;
      }

      cardContent.appendChild(button);
    }

    // Append card content to the card
    card.appendChild(cardContent);

    // Append the card to the container
    this.itemsContainer.appendChild(card);
  }

  renderItems(): void {
    const items = Object.values(this.items);

    console.log(items);
    this.itemsContainer.innerHTML = "";
    for (const item of items) {
      this.renderItem(item);
    }
  }

  addItem(item: ShopItem): void {
    this.items[item.name] = item;
  }
}
