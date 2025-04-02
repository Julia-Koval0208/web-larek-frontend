import { ICardProduct } from '../../types';
import { EventEmitter } from '../base/events';

	export interface ICard {
		render(data: ICardProduct): HTMLElement;
	}

	export class Card implements ICard {
		protected _card: HTMLElement;
		protected _category: HTMLElement;
		protected _title: HTMLElement;
		protected _image: HTMLImageElement;
		protected _price: HTMLElement;
		protected _id: string;

		constructor(
			containerTemplate: HTMLTemplateElement,
			events: EventEmitter,
			options?: { onClick?: () => void }
		) {
			this._card = containerTemplate;
			this._category = this._card.querySelector('.card__category');
			this._image = this._card.querySelector('.card__image');
			this._price = this._card.querySelector('.card__price');
			this._title = this._card.querySelector('.card__title');
			// Добавляем обработчик клика
			if (options?.onClick) {
				this._card.addEventListener('click', options.onClick);
			}
		}

		protected setText(value: number | null): string {
			if (value === null) {
				this._price.textContent = 'Бесценно';
				return 'Бесценно';
			}

			return String(value);
		}

		get id(): string {
			return this.id
		}

		render(data: ICardProduct): HTMLElement {
			const colorCategory = {
				'софт-скил': '_soft',
				'хард-скил': '_hard',
				другое: '_other',
				дополнительное: '_additional',
				кнопка: '_button',
			};

			this._category.textContent = data.category;
			const className =
				colorCategory[data.category as keyof typeof colorCategory];

			// Проверяем, существует ли класс, и присваиваем его
			if (className) {
				this._category.className = `card__category card__category${className}`;
			}

			this._price.textContent = this.setText(data.price) + ' синапсов';
			this._image.src = data.image;
			this._title.textContent = data.title;
			this._card.dataset.id = data.id
			return this._card;
		}
	}

