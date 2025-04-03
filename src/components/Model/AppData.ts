import {
	FormErrors,
	IOrderData,
	IOrderForm,
	Order,
} from '../../types';
import { IEvents } from '../base/events';

export class AppData {
	protected events: IEvents;
	order: Order;

	constructor(events: IEvents) {
		this.order = {
			address: '',
			payment: '',
			email: '',
			phone: '',
		};
		this.events = events;
	}

	// Объект с ошибками форм
	formErrors: FormErrors = {};

	setOrderField(field: keyof IOrderForm, value: string) {
		this.order[field] = value;
		this.validateContacts();
		this.validateOrder();
		console.log(this.order);
	}

	validateContacts() {
		const errors: typeof this.formErrors = {};
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		this.formErrors = errors;
		this.events.emit('contactsFormErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};
		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}
		if (!this.order.payment) {
			errors.payment = 'Необходимо указать способ оплаты';
		}
		this.formErrors = errors;
		this.events.emit('orderFormErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	refreshOrder() {
		this.order = {
			address: '',
			email: '',
			phone: '',
			payment: '',
		};
	}

	// Метод для создания объекта заказа
	createOrderData(items: string[], total: number): IOrderData {
		return {
			...this.order,
			items,
			total,
		};
	}
}
