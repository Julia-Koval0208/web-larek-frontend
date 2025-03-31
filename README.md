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
interface IContacts {
	email: string;
	phone: string;
}
```

### Форма ввода адреса и выбора оплаты для покупки

```
interface IPayment {
	address: string;
	payment: string;
}
```

### Тип данных, который объеденяет 2 интерфейса для покупки

```
export type Order = IContacts & IPayment;
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

#### class DataModel хранит в себе карточки товара, выбранную карточку и имеет методы для работы с ними:

Свойства:

- protected \_productCards: ICardProduct[]; // Хранит список карточек продуктов
- protected \_selectedCard: ICardProduct | null; // Хранит текущую выбранную карточку продукта

- Конструктор инициализирует пустой массив карточек и передает selectedCard = null, пока карточка не выбрана

Методы:

- set productCards(data: ICardProduct[]) - сеттер для свойства productCards. Добавляет карточки в массив \_productCards
- get productCards(): ICardProduct[] - возвращает текущий массив карточек продуктов.
- setPreview(item: ICardProduct) - для уставновки выбранной карточки. Принимает карточку, соответствующую интерфейсу ICardProduct
- getPreview(): ICardProduct | null - для получения информации о текущей выбранной карточки, возвращает карточку соответствующую интерфейсу ICardProduct или null, если такой нет

#### class BasketModel. Хранит в себе добавленные в корзину карточки и имеет методы для работы с ними:

Свойства:

- protected \_basketProducts: ICardProduct[]; - массив карточек

- Конструктор инициализирует пустой массив для хранения карточек

Методы:

- getProducts(): ICardProduct[] - для получения всех карточек в корзине.
- getCounter(): number - для получения количества карточек в корзине.
- getSumProducts(): number - для получения стоимости корзины.
- setSelectedСard(data: ICardProduct) - принимает карточку , соответствующую интерфейсу ICardProduct и добавляет ее в массив \_basketProducts
- deleteCardBasket(id: string) - принимает id карточки и удаляет ее
- clearBasketProducts() - метод очистки корзины
- getProductsIds(): string[] - метод для получения массива id карточек

#### class AppData. Хранит в себе данные о заказе и выполняет валидацию полей заказа и контактов.

Свойства:

- formErrors: { [key: string]: string } = {} - Объект для хранения ошибок валидации формы
- protected events: IEvents - Экземпляр класса событий
- order: IOrder - объект заказа

- Конструктор создает пустой Экземпляр объекта заказа

Методы:

- updateOrder(field: keyof Order, value: string) - метод обновления данных. field - Поле заказа, которое нужно обновить, value - Новое значение для указанного поля.
- validateOrder():boolean - Выполняет валидацию заказа. Проверяет обязательные поля и возвращает true, если ошибок нет.
- validateContacts(): boolean - Выполняет валидацию контактных данных. Проверяет обязательные поля и возвращает true, если ошибок нет.
- refreshOrder() - Сбрасывает данные заказа к начальному состоянию.\

#### class ApiModel наследует класс api и отвечает за взаимодействие с API

Свойства:

- protected \_cdn: string - URL для загрузки изображений

- Конструктор создает экземпляр класса ApiModel

Методы:

- getListProductCard(): Promise<ICardProduct[]> - Получает список карточек продуктов.Выполняет GET-запрос к API и возвращает массив объектов ICardProduct, добавляя к каждому объекту полный URL для изображения.
- getProduct(id: string): Promise<ICardProduct> - Получает информацию о карточке продукта по его ID.Выполняет GET-запрос к API и возвращает объект ICardProduct, добавляя полный URL для изображения.
- createOrder(order: IOrder): Promise<IOrderResult> - Создает новый заказ. Выполняет POST-запрос к API с данными заказа и возвращает результат.

### Слой представления

#### class Basket отвечает за отображение и управление корзиной покупок.

Свойства:

- protected basket: HTMLElement - элемент корзины.
- protected \_list: HTMLElement - список товаров в корзине.
- protected \_total: HTMLElement - элемент для отображения общей стоимости.
- protected model: BasketModel - Модель корзины.
- protected \_button: HTMLElement -Кнопка для оформления заказа.

- Конструктор создает экземпляр класса Basket

Методы:

- set items(items: HTMLElement[]) - Устанавливает элементы корзины. Если массив элементов не пуст, заменяет содержимое списка на новые элементы.В противном случае отображает сообщение о пустой корзине.
- set total(total: number) - Устанавливает общую стоимость товаров в корзине. total - Общая стоимость.
- updateTotal(): void - Обновляет общую стоимость товаров в корзине.
- render(): HTMLElement - Отображает корзину.

#### class BasketItem отвечает за отображение отдельного товара в корзине.

Свойства:

- private container: HTMLElement - контейнер элемента корзины
- protected index: HTMLElement - индекс товара в корзине
- protected title: HTMLElement - Заголовок товара
- protected price: HTMLElement - цена товара
- protected button: HTMLElement - кнопка для удаления товара из корзины
- protected id: string - id товара

- Конструктор создает экземпляр IBasketView

Методы:

- render(card: ICardProduct, index: number) - Отображает информацию о товаре в корзине.

#### class Card отвечает за отображение карточки продукта.

Свойства:

- protected \_card: HTMLElement - элемент карточки
- protected \_category: HTMLElement - элемент категории
- protected \_title: HTMLElement - элемент заголовка
- protected \_image: HTMLImageElement - элемент изображения
- protected \_price: HTMLElement - элемент цены

- Конструктор создает экземпляр класса Card.

Методы:

- protected setText(value: number | null): string - Устанавливает текст для цены. Принимает аргумент в числовом значении и возвращает в строчном
- render(data: ICardProduct): HTMLElement - Отображает карточку продукта.

#### class CardPreview расширяет функциональность Card, добавляя описание и кнопку.

Свойства:

- protected \_description: HTMLElement -элемент описания
- button: HTMLButtonElement - кнопка добавления в корзину

- Конструктор создает экземпляр класса CardPreview

Методы:

- render(data: ICardProduct): HTMLElement - Отображает карточку продукта с дополнительной информацией.

#### Базовый класс Form для работы с формами

Свойства:

- protected \_submit: HTMLButtonElement - Кнопка для отправки формы.
- protected \_errors: HTMLElement - Элемент для отображения ошибок формы.
- protected formModel: AppData - Хранит модель данных формы, которая управляет состоянием и валидацией.

Конструктор:

- Принимает параметры: элемент формы и объект событий.
- Инициализирует элементы формы и добавляет обработчик события отправки.

Методы:

- set errors(value: string): Устанавливает текст ошибок для отображения в интерфейсе.
- validState(validateFn: () => boolean): Проверяет валидность формы и деактивирует кнопку отправки, если форма не валидна.
- setErrors(errors: { [key: string]: string }): Устанавливает ошибки валидации и отображает их в интерфейсе.
- render(state: Partial<T> & IFormState): Отрисовывает состояние формы, обновляя интерфейс в соответствии с состоянием валидации и входными данными.

#### class Contacts расширяет базовый класс Form и отвечает за обработку формы контактов.

Свойства:

- protected formModel: AppData - Хранит модель данных формы, которая управляет состоянием и валидацией.

- Конструктор создает экземпляр класса Contacts

#### class Order обрабатывает форму заказа и управляет выбором способа оплаты.

Свойства:

- protected \_card: HTMLButtonElement - Кнопка для оплаты картой.
- protected \_cash: HTMLButtonElement - Кнопка для оплаты наличными.
- protected formModel: AppData - Хранит модель данных формы, которая управляет состоянием и валидацией.

- Конструктор создает экземпляр класса Order.

Методы:

- private onPaymentChange(paymentMethod: string) - Обрабатывает изменение способа оплаты, обновляя соответствующее значение в модели данных и проверяя валидность.

#### class success представляет собой компонент для отображения успешного завершения заказа.

Свойства:

- protected template: HTMLElement - Шаблон элемента, содержащий разметку для успешного сообщения.
- protected container: HTMLElement - Контейнер для успешного сообщения.
- rotected description: HTMLElement - Элемент описания успешного сообщения.
- protected total: number - Общая сумма, связанная с успешным заказом.
- protected button: HTMLButtonElement - Кнопка для закрытия успешного сообщения.

- Конструктор создает экземпляр класса Success.

Методы:

- render(): Отрисовывает компонент успешного сообщения, устанавливает текст описания и возвращает элемент с успешным сообщением.

#### class Page представляет собой компонент страницы, который управляет отображением счетчика и взаимодействием с корзиной

Свойства:

- protected \_counter: HTMLElement - Элемент, отображающий счетчик.
- protected \_basket: HTMLElement - Элемент корзины.

- Конструктор создает экземпляр класса Page.

Методы:

- set counter(value: number) - Устанавливает значение счетчика и обновляет текстовое содержимое элемента счетчика.

#### class Modal редставляет собой модальное окно, которое может открываться и закрываться, а также отображать динамическое содержимое

Свойства:
- protected modalContainer: HTMLElement - Контейнер модального окна.
- protected closeButton: HTMLButtonElement - Кнопка закрытия модального окна.
- protected \_content: HTMLElement - Элемент для отображения содержимого модального окна.

Конструктор:
- Принимает контейнер модального окна и объект для работы с событиями.
- Инициализирует элементы и добавляет обработчики событий для открытия и закрытия модального окна.

Метиоды:
- set content(value: HTMLElement): Устанавливает содержимое модального окна, заменяя его на переданный элемент.
- open(): Открывает модальное окно
- close(): Закрывает модальное окно
- render(): Рендерит модальное окно, открывает его и возвращает контейнер.