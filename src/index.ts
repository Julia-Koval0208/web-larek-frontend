import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { ApiModel } from './components/Model/ApiModel';
import { Card } from './components/View/Card';
import { CardPreview } from './components/View/CardPreview';
import { cloneTemplate } from './utils/utils';
import { DataModel } from './components/Model/DataModel';
import { ICardProduct, IOrderForm } from './types';
import { Modal } from './components/common/Modal';
import { Basket } from './components/View/Basket';
import { BasketItem } from './components/View/BasketItem';
import { BasketModel } from './components/Model/BasketModel';
import { Page } from './components/View/Page';
import { Order } from './components/View/Order';
import { AppData } from './components/Model/AppData';
import { Contacts } from './components/View/Contacts';
import { Success } from './components/View/Success';

const events = new EventEmitter();
const container = document.querySelector('.gallery');
const page = new Page(document.body, events);

const cardTemplate = document.getElementById(
	'card-catalog'
) as HTMLTemplateElement;
const cardTemplateView = document.getElementById(
	'card-preview'
) as HTMLTemplateElement;
const basketTemplate = document.getElementById('basket') as HTMLTemplateElement;
const basketItemTemplate = document.getElementById(
	'card-basket'
) as HTMLTemplateElement;

const paymentTemplete = document.getElementById('order') as HTMLTemplateElement;
const contactsTemplate = document.getElementById(
	'contacts'
) as HTMLTemplateElement;
const successTemplate = document.getElementById(
	'success'
) as HTMLTemplateElement;

const basketModel = new BasketModel(events);
const cardPreview = new CardPreview(cloneTemplate(cardTemplateView), events);
const appData = new AppData(events);
const api = new ApiModel(CDN_URL, API_URL);
const modal = new Modal(document.getElementById('modal-container'), events);
const dataModel = new DataModel(events);
const basket = new Basket(cloneTemplate(basketTemplate), basketModel, events);
const order = new Order('order', cloneTemplate(paymentTemplete), events);
const contacts = new Contacts(
	'contacts',
	cloneTemplate(contactsTemplate),
	events
);

const success = new Success(cloneTemplate(successTemplate), {
	onClick: () => {
		modal.close();
	},
});

api
	.getListProductCard()
	.then((productCards) => {
		dataModel.productCards = productCards; // Устанавливаем карточки в модель данных
	})
	.catch((error) => {
		console.error('Ошибка при загрузке карточек продуктов:', error);
	});

events.on('productCards:receive', () => {
	page.catalog = dataModel.productCards.map((item) => {
		const card = new Card(cloneTemplate(cardTemplate), events, {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			title: item.title,
			category: item.category,
			image: item.image,
			price: item.price,
			id: item.id,
			description: item.description,
		});
	});
});

events.on('modalCard:open', (item: ICardProduct) => {
	modal.render({
		content: cardPreview.render(item),
	});
	const selectedCard = dataModel.getPreview();
	if (selectedCard) {
		const existsInBasket = basketModel.isCardInBasket(selectedCard.id);
		cardPreview.setButtonState(existsInBasket);
		if (selectedCard.price === null) {
			cardPreview.setButtonState(true);
		}
	}
});

events.on('basket:open', () => {
	modal.render({
		content: basket.render(),
	});
});

events.on('card:select', (selectedCard: ICardProduct) => {
	dataModel.setPreview(selectedCard);
});

events.on('buttonBasket: click', () => {
	const selectedCard = dataModel.getPreview();
	if (selectedCard) {
		const existsInBasket = basketModel.isCardInBasket(selectedCard.id);
		if (!existsInBasket) {
			basketModel.setSelectedСard(selectedCard);
			modal.close();
		} else {
			console.log('Карточка уже находится в корзине');
		}
	}
});

events.on('basket:updated', () => {
	modal.render({
		content: basket.render(),
	});
});

events.on('basketItem:updated', () => {
	const basketItems = basketModel.getProducts(); // Получаем актуальные товары из модели
	// Генерируем новые карточки для отображения в корзине
	const itemsToRender = basketItems.map((item, index) => {
		const basketItem = new BasketItem(
			cloneTemplate(basketItemTemplate),
			events,
			{ onClick: () => events.emit('ItemDelete: click', item) }
		);
		return basketItem.render({
			title: item.title,
			price: item.price,
			index: index + 1,
		});
	});
	page.counter = basketModel.getCounter();
	basket.items = itemsToRender; // Устанавливаем карточки в представлении корзины
	basket.updateTotal();
});

events.on('ItemDelete: click', (item: ICardProduct) => {
	const id = item.id;
	console.log(id);
	basketModel.deleteCardBasket(id);
});

events.on('buttonOrder: click', () => {
	modal.render({
		content: order.render({
			address: '',
			valid: false || appData.validateOrder(),
			errors: [],
		}),
	});
});

events.on('order:submit', () => {
	modal.render({
		content: contacts.render({
			email: '',
			phone: '',
			valid: false || appData.validateContacts(),
			errors: [],
		}),
	});
});

events.on('contacts:submit', () => {
	const items = basketModel.getProductsIds(); // Получаем продукты из корзины
	const total = basketModel.getSumProducts(); // Получаем сумму продуктов

	const orderData = {
		...appData.order,
		items,
		total,
	};

	api
		.post('/order', orderData)
		.then((result) => {
			modal.render({
				content: success.render({
					total: orderData.total,
				}),
			});
			appData.refreshOrder();
			basketModel.clearBasketProducts();
			order.reset();
			contacts.reset();
			console.log(appData.order);
		})
		.catch((err) => {
			console.error(err);
		});
});

events.on('orderFormErrors:change', (errors: Partial<IOrderForm>) => {
	const { payment, address } = errors;
	order.valid = !payment && !address;
	order.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
});

events.on('contactsFormErrors:change', (errors: Partial<IOrderForm>) => {
	const { email, phone } = errors;
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

// Изменились введенные данные
events.on(
	'orderInput:change',
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

events.on('payment:change', (item: HTMLButtonElement) => {
	appData.order.payment = item.name;
	order.setPayment(appData.order.payment);
});
