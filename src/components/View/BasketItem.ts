import { ICardProduct } from "../../types";
import { EventEmitter } from "../base/events";
import { Card } from "./Card";

export class BasketItem {
	private container: HTMLElement;
	protected index: HTMLElement;
	protected title: HTMLElement;
	protected button: HTMLElement;
	protected price: HTMLElement;
   

	constructor(template: HTMLTemplateElement, event: EventEmitter, options?: { onClick?: () => void }) {
		this.container = template;
		this.index = this.container.querySelector('.basket__item-index');
		this.title = this.container.querySelector('.card__title');
		this.button = this.container.querySelector('.basket__item-delete');
		this.price = this.container.querySelector('.card__price');
		
		if (options?.onClick) {
			this.button.addEventListener('click', options.onClick);
		}
	}

	render(card: ICardProduct, index: number): HTMLElement {
		this.price.textContent = String(card.price) + ' синапсов';
		this.title.textContent = card.title;
		this.index.textContent = String(index + 1);
		return this.container;
	}
}