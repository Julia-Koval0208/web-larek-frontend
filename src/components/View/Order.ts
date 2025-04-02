import { IPayment } from '../../types';
import { IEvents } from '../base/events';
import { Form } from '../common/Form';

export class Order extends Form<IPayment> {
	protected _card: HTMLButtonElement;
	protected _cash: HTMLButtonElement;
	protected paymentMethod: string | null = null;
	// Конструктор принимает имя блока, родительский элемент и обработчик событий
	constructor(
		protected blockName: string,
		container: HTMLFormElement,
		protected events: IEvents
	) {
		super(container, events);

		this._card = container.elements.namedItem('card') as HTMLButtonElement;
		this._cash = container.elements.namedItem('cash') as HTMLButtonElement;

		if (this._cash) {
			this._cash.addEventListener('click', () => {
				this._cash.classList.add('button_alt-active');
				this._card.classList.remove('button_alt-active');
				this.onInputChange('payment', 'cash');
			});
		}
		if (this._card) {
			this._card.addEventListener('click', () => {
				this._card.classList.add('button_alt-active');
				this._cash.classList.remove('button_alt-active');
				this.onInputChange('payment', 'card');
			});
		}
	}

	disableButtons() {
		this._cash.classList.remove('button_alt-active');
		this._card.classList.remove('button_alt-active');
	}

  reset(): void {
    super.reset(); // Сброс значений полей формы
    this.paymentMethod = null; // Сбрасываем состояние метода оплаты
    this.disableButtons()
  }
}
