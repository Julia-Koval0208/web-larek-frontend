import { ICardProduct } from '../../types';

export class BasketModel {
	protected _basketProducts: ICardProduct[];

	constructor() {
		this._basketProducts = [];
	}

	// Метод для получения всех продуктов в корзине
	getProducts(): ICardProduct[] {
		return this._basketProducts;
	}

	getCounter() {
		return this._basketProducts.length;
	}

	getSumProducts() {
		return this._basketProducts.reduce(
			(sum, product) => sum + product.price,
			0
		);
	}

	setSelectedСard(data: ICardProduct) {
		this._basketProducts.push(data);
	}

	deleteCardBasket(id: string) {
		this._basketProducts = this._basketProducts.filter(
			(card) => card.id !== id
		);
	}

	clearBasketProducts() {
		this._basketProducts = [];
	}

	getProductsIds(): string[] {
		return this._basketProducts.map((product) => product.id); // Получаем массив ID товаров
	}
}
