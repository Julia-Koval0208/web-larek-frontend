import { ICardProduct } from '../../types';
import { createElement, formatNumber } from '../../utils/utils';
import { Component } from '../base/componets';
import { EventEmitter } from '../base/events';
import { BasketModel } from '../Model/BasketModel';

interface IBasketView {
	items: HTMLElement[];
	total: number;
}

export class Basket extends Component<IBasketView> {
	protected basket: HTMLElement;
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected model: BasketModel;
	protected _button: HTMLElement;

	constructor(
		basketTemplate: HTMLTemplateElement,
		model: BasketModel,
		event: EventEmitter
	) {
		super(basketTemplate);
		this.basket = basketTemplate;
		this._list = basketTemplate.querySelector('.basket__list');
		this._total = basketTemplate.querySelector('.basket__price');
		this._button = basketTemplate.querySelector('.basket__button');
		this.model = model;

		this.items = [];

		this._button.addEventListener('click', () => {
			event.emit('buttonOrder: click');
		});
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
			this.setDisabled(this._button, false);
		} else {
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
			this.setDisabled(this._button, true);
		}
	}

	render(): HTMLElement {
		this.updateTotal();
		return this.basket;
	}

	set total(total: number) {
		this.setText(this._total, formatNumber(total));
	}

	updateTotal(): void {
		this._total.textContent = String(this.model.getSumProducts()) + ' синапсов';
	}
}
