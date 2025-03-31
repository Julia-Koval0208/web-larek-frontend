import { IOrder, Order } from '../../types';
import { IEvents } from '../base/events';

export class AppData {
	formErrors: { [key: string]: string } = {};
	protected events: IEvents;
	order: IOrder;

	constructor(events: IEvents) {
		this.order = {
			items: [],
			total: null,
			address: '',
			payment: '',
			email: '',
			phone: '',
		};
		this.events = events;
	}

	// Метод для обновления данных заказа
	updateOrder(field: keyof Order, value: string) {
		this.order[field] = value;
		console.log(this.order);
	}

	// Метод для валидации заказа
	validateOrder(): boolean {
		const errors: { [key: string]: string } = {};
		if (!this.order.address || this.order.address.length < 5) {
			errors.address = 'Адрес обязателен, не менее 5 символов';
		}
		if (!this.order.payment) {
			errors.payment = 'Способ оплаты обязателен';
		}

		this.formErrors = errors;

		return Object.keys(errors).length === 0; // Возвращает true, если ошибок нет
	}

	// Метод для валидации контактов
	validateContacts(): boolean {
		const errors: { [key: string]: string } = {};
		if (!this.order.email || this.order.email.length < 6) {
			errors.email = 'Эл.почта обязательна, не менее 6 символов';
		}
		if (!this.order.phone || this.order.phone.length < 9) {
			errors.phone = 'Введите номер телефон, не менее 9 символов';
		}

		this.formErrors = errors;

		return Object.keys(errors).length === 0; // Возвращает true, если ошибок нет
	}

	refreshOrder() {
		this.order = {
			items: [],
			total: null,
			address: '',
			email: '',
			phone: '',
			payment: '',
		};
	}
}
