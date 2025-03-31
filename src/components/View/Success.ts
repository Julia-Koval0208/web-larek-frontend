import { EventEmitter } from '../base/events';
import { BasketModel } from '../Model/BasketModel';

export class Success {
	protected template: HTMLElement;
	protected container: HTMLElement;
	protected description: HTMLElement;
	protected total: number;
	protected button: HTMLButtonElement;

	constructor(
		template: HTMLTemplateElement,
		events: EventEmitter,
		total: number,
		options?: { onClick?: () => void }
	) {
		this.template = template;
		this.container = this.template.querySelector('.order-success');
		this.description = this.template.querySelector(
			'.order-success__description'
		);
		this.total = total;
		this.button = this.template.querySelector('.order-success__close');
		this.button.addEventListener('click', options.onClick);
	}

	render() {
		this.description.textContent = `Списано ${this.total} синапсов`;
		return this.template;
	}
}
