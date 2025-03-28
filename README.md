# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с ts компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
## Данные и типы данных, используемые в приложении

### Карточка товара
```
interface ICardProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}
```
### Форма ввода телефона и почты для покупки
```
interface IContactsForm {
    email: string;
    phone: string;
}
```

### Форма ввода адреса для покупки. Расширяет Интерфейс IContactsForm
```
interface IOrderForm {
    adress: string;
    paymentMethod: 'card' | 'cash';
}
```

### Главная страница

```
interface IPage {
    counter: number;
    listCards: ICardProduct[];
}
```

### Тип данных для работы с севером, где id - идентификатор товара, а total - сумма
```
interface IOrderResult {
    id: string;
    total: number;
}
```

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP: 
- слой представления, отвечает за отображение данных на странице, 
- слой данных, отвечает за хранение и изменение данных
- презентер, отвечает за связь представления и данных.

### Базовый код

#### Класс Api
Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.
Методы: 
- `get` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### Класс EventEmitter
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.  
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:
- `on` - подписка на событие
- `emit` - инициализация события
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие 

### Слой данных

#### Класс DataModel. Он хранит данные о продуктах и выбранной карточки.Класс имеет следующие свойства и методы:
- protected productCards: ICardProduct[]; -  Хранит список карточек продуктов. Используется для хранения всех доступных карточек продуктов в приложении. Доступ к этому полю осуществляется через геттер и сеттер.
- protected selectedСard: ICardProduct; - Хранит текущую выбранную карточку продукта. Это поле используется для хранения информации о карточке, которую пользователь выбрал для просмотра.

constructor(protected events: IEvents) - принимает при создании брокер событий

- Сеттер для свойства productCards. - При установке нового значения для productCards, мы вызываем метод emit из events, передавая событие productCardsUpdated и новое значение. Это позволяет другим компонентам приложения реагировать на обновление данных.
- Геттер для свойства productCards. Возвращает текущий массив карточек продуктов.
- setPreview(item: ICardProduct) -  Метод, который принимает объект типа ICardProduct и устанавливает его как текущую selectedCard.
- getPreview():ICardProduct | null - Метод для получения информации о текущей выбранной карточке.Возвращает текущую выбранную карточку или null, если та не выбрана


#### Класс BasketModel хранит и работает с данными, полученными от пользователя. 
Свойства:
- protected _basketProducts: ICardProduct[]; - содержит массив товаров в корзине

Конструктор инициализирует пустой массив товаров.

Методы:
- getCounter():number - возвращает количество товаров в корзине.
- getSumProducts():number - считает и возвращает сумму синапсов всех товаров в корзине.
- setSelectedСard(data: ICardProduct):void - принимает карточку нужного типа и добавляет товар в корзину.
- deleteCardBasket(id: string):void - принимает id нужного типа и удаляет товар из корзины.
- clearBasketProducts(): void - очищает/удаляет все товары из корзины.
- getProductsIds():  string[] - возвращает массив id товаров

#### Класс ApiModel наследует класс Api и передает\получает данные с сервера.
Свойства:
- protected _cdn: string - хранит URL для изображений продуктов

Конструктор принимает url сервера с контентом, url по которому будут совершаться запросы и общие опции для этих запросов

Методы:
- getListProductCard() => Promise<ICardProduct>; - получает массив товаров с сервера
- getIdProduct(id: string) => Promise<ICardProduct> - возвращает товар по его id
- createOrder: (order: IOrderForm) => Promise<IOrderResult> - отправляет переданный заказ на сервер и возвращает результат

#### Класс FormModel хранит и получает данные, полученные от пользователя

Свойства:
- private orderData: IOrderForm; - Это свойство указывает, как будет производиться оплата и содержит адрес доставки.
- private contactData: IContactsForm; - Содержит адрес электронной почты и номер телефона. Эти свойства хранят данные о заказе и контактах.

Конструктор инициализирует orderData и contactData значениями по умолчанию.

Методы:
- set paymentMethod(method: 'card' | 'cash') - является сеттером, который устанавливает способ оплаты.
- set address(address: string) - сеттер для установки адреса доставки.
- get order() - геттер, который возвращает объект с данными заказа.
- set email(email: string) - сеттер для установки электронной почты.
- set phone(phone: string) - сеттер для установки номера телефона.
- get contact() - геттер, который возвращает объект с контактными данными.
- validate(): boolean - метод для валидации данных. Проверяет корректность электронной почты, номера телефона, адреса и способа оплаты. Возвращает true, если все данные валидны, и false в противном случае.
- getOrderLot(basket: BasketModel): { total: number; items: string[]; } - метод, который принимает BasketModel и возвращает объект с данными о стоимости и списке товаров.

### Слой представления\

#### Класс Basket. Класс Basket отвечает за представление корзины. Он взаимодействует с моделью корзины (BasketModel) и обновляет отображение, когда происходят изменения
Свойства:
- private title: HTMLElement - Заголовок "Корзина"
- private list: HTMLElement - Список товаров корзине
- private total: HTMLElement - Сумма всех синапсов
- private model: BasketModel - модель корзины
- button: HTMLElement - Кнопка оформления заказа

Конструктор принимает темплейт разметки, модель, брокер событий и инициализирует свойства и контейнер корзины

Методы:
- set items(value: HTMLElement[]): void: Устанавливает список товаров в корзине. Принимает массив элементов HTMLElement.
- set total(value: number): void: Устанавливает итоговую сумму синапсов. Принимает число.
- private updateTotal(): void - использует метод getSumProducts модели BasketModel для подсчета суммы синапсов и использует сеттер для обновления суммы.
- private closeBasket(): void - метод закрытия корзины.

#### Класс BasketItemView. Класс BasketItemView представляет отдельный товар в корзине и отвечает за отображение информации о товаре и обработку событий, связанных с ним.
Свойства:
- private title:HTMLElement - название товара в корзине
- private index: HTMLElement - порядковый номер товара в корзине
- private price: HTMLElement - стоимость товара в корзине
- buttonDelete: HTMLElement - кнопка удаления товара из корзины

Конструктор принимает темплейт из разметки, брокер событий и инициализирует свойства

Методы:
- set index(value: number): void: Устанавливает порядковый номер товара. Принимает число.
- set title(value: string): void: Устанавливает название товара. Принимает строку.
- set price(value: number): void: Устанавливает цену товара. Принимает число.
- handleDelete(event: Event): void: Обрабатывает событие удаления товара из корзины. 

#### Класс Card управляет отображением карточки на главной странице и в превью
Свойства:
- protected _card: HTMLElement; - контейнер карточки
- protected _category: HTMLElement;
- protected _title: HTMLElement;
- protected _image: HTMLImageElement;
- protected _price: HTMLElement;
- protected _description: HTMLElement | null;
- protected  button: HTMLElement; - кнопка "добавить в корзину"

Методы:
- protected setText(value: number | null): string - преобразовывает числовое значение в строку, если у товара нет цены - делает его "бесценным"
- render(data: ICardProduct) - отвечает за отображение содержимого карточки на странице  

Конструктор принимает родительский контейнер, брокер событий,обработчик клика и инициализирует свойства из разметки




#### Класс OrderFormPayment  отвечает за выбор оплаты, ввод адреса и отображение модального окна
Свойства:
- form: HTMLElement - Элемент формы
- formErrors: HTMLElement - Спан ошибки
- buttonAll: HTMLButtonElement[] - кнопки выбора оплаты
- buttonSubmit: HTMLButtonElement - кнопка сабмита "Далее"

Конструктор принимает темплейт-order

Методы:
- render() - отвечает за показ модального окна 
- paintColorsPayment - отвечает за обводку выбранного способа оплаты


#### Класс OrderFormContacts отвечает за отображение модального окна и ввода личных данных  
Свойства:
- form: HTMLElement - Элемент формы
- formErrors: HTMLElement - Спан ошибки
- inputTitle: HTMLElement[] - поля ввода почты и телефона
- buttonSubmit: HTMLButtonElement - кнопка сабмита оплаты

Конструктор принимает темплейт-constants

Методы: 
- render - отображение содержимого модального окна

#### Класс Modal отвечает за открытие и закрытие модального окна

Свойства:
- protected containerModal - Элемент разметки (родительский контейнер)
- protected buttonClose - кнопка закрытия 
- protected _content - блок основного содержимого в контейнере
- protected _pageWrapper - Главная страница

В конструктор принимает блок modal-container и брокер событий

Методы:
- set content(value: HTMLElement) - принимает элемент разметки которая будет отображаться в "modal__content" модального окна
- open(): void - открытие модального окна
- close(): void - закрытие модального окна
- render(): void - отображение модального окна

#### Класс Success отвечает за отоброжение окна удачной покупки 
Свойства:
- container: HTMLElement;
- title: HTMLElement;
- description: HTMLElement;
- button: HTMLButtonElement;

В конструктор принимает темплейт-Success

Методы:
- render - отвечает за присвоение суммы покупки в поле description и за общее отображение окна