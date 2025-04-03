import { ensureElement } from '../../utils/utils';
import { Component } from '../base/componets';
import { EventEmitter } from '../base/events';

interface ICardBasket {
	title: string;
	price: number;
	index: number;
}

export class BasketItem extends Component<ICardBasket> {
	protected _index: HTMLElement;
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected button: HTMLButtonElement;

	constructor(
		template: HTMLTemplateElement,
		event: EventEmitter,
		options?: { onClick?: () => void }
	) {
		super(template);
		this._index = template.querySelector('.basket__item-index');
        this._title = template.querySelector('.card__title'); 
        this._price = template.querySelector('.card__price');
		this.button = template.querySelector('.basket__item-delete');

		if (options?.onClick) {
			this.button.addEventListener('click', options.onClick);
		}
	}

	set index(value: number) {
		this.setText(this._index, value);
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set price(value: string) {
		if (value === null) {
			this.setText(this._price, `Бесценно`);
		} else {
			this.setText(this._price, `${value} синапсов`);
		}
	}
}
