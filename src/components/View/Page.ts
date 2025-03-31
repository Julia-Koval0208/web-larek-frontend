import { ensureElement } from '../../utils/utils';
import { Component } from '../base/componets';
import { IEvents } from '../base/events';

interface IPage {
	counter: number;
	locked: boolean;
}

export class Page extends Component<IPage> {
	protected _counter: HTMLElement;
	protected _basket: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._counter = ensureElement<HTMLElement>('.header__basket-counter');
		this._basket = ensureElement<HTMLElement>('.header__basket');

		this._basket.addEventListener('click', () => {
			this.events.emit('basket:open');
			console.log('Клик по корзине');
		});
	}

	set counter(value: number) {
		this.setText(this._counter, String(value));
	}
}
