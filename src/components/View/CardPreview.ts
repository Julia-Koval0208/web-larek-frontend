import { ICardProduct } from '../../types';
import { EventEmitter } from '../base/events';
import { Card } from './Card';

export class CardPreview extends Card {
	protected _description: HTMLElement;
	button: HTMLButtonElement;

	constructor(containerTemplate: HTMLTemplateElement, events: EventEmitter) {
		super(containerTemplate, events);
		this._description = this._card.querySelector('.card__text');
		this.button = this._card.querySelector('.card__button');

		this.button.addEventListener('click', (evt) => {
			evt.stopPropagation();
			events.emit('buttonBasket: click', this);
		});
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

		if (data.price === null) {
			this.button.setAttribute('disabled', 'true');
		} else {
			this.button.removeAttribute('disabled');
		}
		this._image.src = data.image;
		this._title.textContent = data.title;
		this._description.textContent = data.description;
		return this._card;
	}

	setButtonState(isDisabled: boolean) {
		this.button.disabled = isDisabled;
	}
}
