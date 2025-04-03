import { ICardProduct } from '../../types';
import { EventEmitter } from '../base/events';

export class BasketModel {
	protected _basketProducts: ICardProduct[];
	events: EventEmitter;

	constructor(events: EventEmitter) {
		this._basketProducts = [];
		this.events = events; // Инициализируем EventEmitter
	}

	// Метод для получения всех продуктов в корзине
	getProducts(): ICardProduct[] {
		return this._basketProducts;
	}

	getCounter(): number {
		return this._basketProducts.length;
	}

	getSumProducts(): number {
		return this._basketProducts.reduce(
			(sum, product) => sum + product.price,
			0
		);
	}

	setSelectedСard(data: ICardProduct) {
		this._basketProducts.push(data);
		this.events.emit('basketItem:updated');
	}

	deleteCardBasket(id: string) {
		this._basketProducts = this._basketProducts.filter(
			(card) => card.id !== id
		);
		this.events.emit('basketItem:updated');
	}

	clearBasketProducts() {
		this._basketProducts = [];
		this.events.emit('basketItem:updated');
	}

	getProductsIds(): string[] {
		return this._basketProducts.map((product) => product.id); // Получаем массив ID товаров
	}

	// Метод для проверки наличия карточки в корзине
	isCardInBasket(cardId: string): boolean {
		return this.getProducts().some((card) => card.id === cardId);
	}
}
