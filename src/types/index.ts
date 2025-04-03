//Карточка товара
export interface ICardProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category?: string;
	price: number | null;
}

export interface IPayment {
	address: string;
	payment: string;
}

export interface IContacts {
	email: string;
	phone: string;
}

export type Order = IContacts & IPayment;

export interface IOrderData {
	items: string[],
	total: number,
// Способ оплаты
	payment: string;
	// Адрес доставки
	address: string;

	// Электронная почта
	email: string;

	// Телефон
	phone: string;
}

export interface IOrderForm {
	payment: string;
	address: string;
	email: string;
	phone: string;
  }

export type FormErrors = Partial<Record<keyof IOrderForm, string>>;

export interface IOrderResult {
	id: string;
	total: number;
}
