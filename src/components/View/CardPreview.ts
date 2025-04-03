import { ICardProduct } from '../../types';
import { ensureElement } from '../../utils/utils';
import { EventEmitter } from '../base/events';
import { Card } from './Card';

export class CardPreview extends Card {
	protected _description: HTMLElement;
	button: HTMLButtonElement;

	constructor(containerTemplate: HTMLTemplateElement, events: EventEmitter) {
		super(containerTemplate, events);
		this.button = containerTemplate.querySelector(`.card__button`);
		this._description = ensureElement<HTMLElement>(
			`.card__text`,
			containerTemplate
		);

		this.button.addEventListener('click', (evt) => {
			evt.stopPropagation();
			events.emit('buttonBasket: click', this);
			events.emit('basketItem:updated');
		});
	}

	render(data: ICardProduct): HTMLElement {
		super.render(data);
		this._description.textContent = data.description;
		return this._card;
	}

	setButtonState(isDisabled: boolean) {
		this.button.disabled = isDisabled;
	}
}
