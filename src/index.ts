import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { ApiModel } from './components/Model/ApiModel';
import { Card, CardPreview } from './components/View/Card';
import { cloneTemplate, createElement } from './utils/utils';
import { DataModel } from './components/Model/DataModel';
import { ICardProduct, IOrderForm } from './types';
import { Modal } from './components/View/Modal';
import { Basket, BasketItem } from './components/View/Basket';
import { BasketModel } from './components/Model/BasketModel';
import { Page } from './components/View/Page';
import { Order } from './components/View/Order';
import { FormModel } from './components/Model/FormModel';



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
const formModel = new FormModel(events);

const api = new ApiModel(CDN_URL, API_URL);

const modal = new Modal(document.getElementById('modal-container'), events);
const dataModel = new DataModel(events);
const basketModel = new BasketModel();
const basket = new Basket(cloneTemplate(basketTemplate), basketModel, events);
const order = new Order('order', cloneTemplate(paymentTemplete), events, formModel)

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
	const cardPreview = new CardPreview(cloneTemplate(cardTemplateView), events);
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
			basketModel.setSelectedСard(selectedCard);
			// Обновляем корзину
			events.emit('basket:updated');
			modal.close();
		} else {
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
});

events.on('ItemDelete: click', (basketItems: ICardProduct) => {
	const id = basketItems.id;
	basketModel.deleteCardBasket(id);
	events.emit('basket:updated', basketItems); // обновление корзины
});


events.on("buttonOrder: click", () => {
	modal.content = order.render({
		address: '',
		valid: false,
		errors: []
	})
	modal.open()
})

