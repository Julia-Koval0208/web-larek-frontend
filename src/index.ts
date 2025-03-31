import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { ApiModel } from './components/Model/ApiModel';
import { Card, CardPreview } from './components/View/Card';
import { cloneTemplate, createElement } from './utils/utils';
import { DataModel } from './components/Model/DataModel';
import { ICardProduct, IOrderResult } from './types';
import { Modal } from './components/common/Modal';
import { Basket, BasketItem } from './components/View/Basket';
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

const cardPreview = new CardPreview(cloneTemplate(cardTemplateView), events);
const formModel = new AppData(events);
const api = new ApiModel(CDN_URL, API_URL);
const modal = new Modal(document.getElementById('modal-container'), events);
const dataModel = new DataModel(events);
const basketModel = new BasketModel();
const basket = new Basket(cloneTemplate(basketTemplate), basketModel, events);
const order = new Order(
	'order',
	cloneTemplate(paymentTemplete),
	events,
	formModel
);
const contacts = new Contacts(
	'contacts',
	cloneTemplate(contactsTemplate),
	events,
	formModel
);

api
	.getListProductCard()
	.then((productCards) => {
		dataModel.productCards = productCards; // Устанавливаем карточки в модель данных
	})
	.catch((error) => {
		console.error('Ошибка при загрузке карточек продуктов:', error);
	});

events.on('productCards:receive', () => {
	dataModel.productCards.forEach((item) => {
		const card = new Card(cloneTemplate(cardTemplate), events, {
			onClick: () => events.emit('card:select', item),
		});
		container.append(card.render(item));
	});
});

events.on('modalCard:open', (card: ICardProduct) => {
	modal.content = cardPreview.render(card);
	modal.open();
});

events.on('basket:open', () => {
	modal.content = basket.render();
	modal.open();
});

events.on('card:select', (selectedCard: ICardProduct) => {
	dataModel.setPreview(selectedCard);
	events.emit('modalCard:open', selectedCard);
});

events.on('buttonBasket: click', () => {
	// Получаем выбранную карточку из модели данных
	const selectedCard = dataModel.getPreview();
	if (selectedCard) {
		const existsInBasket = basketModel
			.getProducts()
			.some((card) => card.id === selectedCard.id);
		if (!existsInBasket) {
			cardPreview.button.disabled = false;
			basketModel.setSelectedСard(selectedCard);
			// Обновляем корзину
			events.emit('basket:updated');
			modal.close();
		} else {
			cardPreview.button.disabled = true;
			console.log('Карточка уже находится в корзине');
		}
	}
});

events.on('basket:updated', () => {
	const basketItems = basketModel.getProducts(); // Получаем актуальные товары из модели
	// Генерируем новые карточки для отображения в корзине
	const itemsToRender = basketItems.map((item, index) => {
		const basketItem = new BasketItem(
			cloneTemplate(basketItemTemplate),
			events
		);
		return basketItem.render(item, index);
	});
	basket.items = itemsToRender; // Устанавливаем карточки в представлении корзины
	basket.updateTotal(); // Обновляем сумму
	modal.content = basket.render(); // Обновляем содержимое модального окна
	page.counter = basketModel.getCounter();
});

events.on('ItemDelete: click', (basketItems: ICardProduct) => {
	const id = basketItems.id;
	basketModel.deleteCardBasket(id);
	events.emit('basket:updated', basketItems); // обновление корзины
});

events.on('buttonOrder: click', () => {
	modal.content = order.render({
		address: '',
		valid: false,
		errors: [],
	});
	modal.open();
});

events.on('nextStep:click', () => {
	modal.content = contacts.render({
		email: '',
		phone: '',
		valid: false,
		errors: [],
	});
	modal.open();
});

events.on('contacts:submit', () => {
	formModel.order.total = basketModel.getSumProducts();
	formModel.order.items = basketModel.getProductsIds();
	api
		.post('/order', formModel.order)
		.then((res) => {
			basketModel.clearBasketProducts();
			events.emit('basket:updated');
			modal.close();
			events.emit('order:success', res);
			formModel.refreshOrder();
		})
		.catch((error) => console.log(error));
});

events.on('order:success', (res: IOrderResult) => {
	console.log('Запрос прошел ', res);
	const total = res.total;
	const success = new Success(cloneTemplate(successTemplate), events, total, {
		onClick: () => modal.close(),
	});
	modal.content = success.render();
	modal.open();
});
