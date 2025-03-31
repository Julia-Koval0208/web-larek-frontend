//Карточка товара
export interface ICardProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
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

export interface IOrder {
	// Массив ID купленных товаров
	items: string[];

	// Способ оплаты
	payment: string;

	// Сумма заказа
	total: number;

	// Адрес доставки
	address: string;

	// Электронная почта
	email: string;

	// Телефон
	phone: string;
}


export interface IOrderResult {
	id: string;
	total: number;
}
