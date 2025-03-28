import { IEvents } from '../base/events';
import { FormModel } from '../Model/FormModel';
import { Form } from './Form';

export interface IOrder {
	// Адрес
	address: string;
	// Способ оплаты
	payment: string;
}

export class Order extends Form<IOrder> {
	protected _card: HTMLButtonElement;
	protected _cash: HTMLButtonElement;
	protected formModel: FormModel; // Добавляем поле для модели формы

	constructor(
		protected blockName: string,
		container: HTMLFormElement,
		protected events: IEvents,
		formModel: FormModel // Принимаем модель формы через конструктор
	) {
		super(container, events);
		this.formModel = formModel; // Инициализируем модель формы

		this._card = container.elements.namedItem('card') as HTMLButtonElement;
		this._cash = container.elements.namedItem('cash') as HTMLButtonElement;

		if (this._cash) {
			this._cash.addEventListener('click', () => {
				this._cash.classList.add('button_alt-active');
				this._card.classList.remove('button_alt-active');
				this.onPaymentChange('cash'); // Обновляем метод для обработки изменения способа оплаты
			});
		}
		if (this._card) {
			this._card.addEventListener('click', () => {
				this._card.classList.add('button_alt-active');
				this._cash.classList.remove('button_alt-active');
				this.onPaymentChange('card'); // Обновляем метод для обработки изменения способа оплаты
			});
		}

		// Добавляем обработчик для изменения адреса
		this.container.addEventListener('input', (e: Event) => {
			const target = e.target as HTMLInputElement;
			if (target.name === 'address') {
				this.formModel.updateOrder('address', target.value); // Обновляем адрес в модели формы
				this.setErrors(this.formModel.formErrors); // Устанавливаем ошибки формы
			}
		});

		this.container.addEventListener('submit', (e: Event) => {
			e.preventDefault();
			const isValid = this.formModel.validateOrder(); // Проверяем валидность данных
			if (isValid) {
				// Здесь вы можете выполнить действия по отправке данных (например, отправка на сервер)
				console.log('Форма валидна, данные заказа:', this.formModel.order);
				// Закрыть модальное окно или выполнить другие действия
			} else {
				this.setErrors(this.formModel.formErrors); // Устанавливаем ошибки, если форма не валидна
			}
		});
	}

	// Метод для обработки изменения способа оплаты
	private onPaymentChange(paymentMethod: string) {
		this.formModel.updateOrder('payment', paymentMethod); // Обновляем способ оплаты в модели формы
		this.setErrors(this.formModel.formErrors); // Устанавливаем ошибки формы
	}

	// Метод для установки ошибок
	private setErrors(errors: { [key: string]: string }) {
		this.errors = Object.values(errors).join(', '); // Отображаем ошибки в интерфейсе
	}

	// Метод, отключающий подсвечивание кнопок
	disableButtons() {
		this._cash.classList.remove('button_alt-active');
		this._card.classList.remove('button_alt-active');
	}
}
