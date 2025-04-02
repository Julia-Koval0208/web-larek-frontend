import { FormErrors, IOrder, IOrderForm } from '../../types';
import { IEvents } from '../base/events';
import { BasketModel } from './BasketModel';

export class AppData {
	protected events: IEvents;
	order: IOrder;
	basket: BasketModel;

	constructor(events: IEvents, basket: BasketModel) {
		this.order = {
			items: [],
			total: null,
			address: '',
			payment: '',
			email: '',
			phone: '',
		};
		this.events = events;
		this.basket = basket;
	}

	// Объект с ошибками форм
	formErrors: FormErrors = {};

	setOrderField(field: keyof IOrderForm, value: string) {
		this.order[field] = value;
		this.order.total = this.basket.getSumProducts();
		this.order.items = this.basket.getProductsIds();
		this.validateContacts();
		this.validateOrder();
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
			items: [],
			total: null,
			address: '',
			email: '',
			phone: '',
			payment: '',
		};
	}
}
