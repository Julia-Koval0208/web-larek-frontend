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
interface IOrderForm extends IContactsForm{
    adress: string;
    payment: string;
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

#### Интерфейс IDataModel определяет структуру и методы, которые должен иметь класс DataModel. productCards - массив карточек продуктов, selectedСard - выбранная карточка, а setPreview - метод для установки выбранной карточки.
```
interface IDataModel {
   protected _productCards: ICardProduct[]; 
   protected _selectedСard: ICardProduct;
  setPreview(item: ICardProduct): void;
}
```
#### Класс DataModel реализует Интерфейс IDataModel. Он хранит данные о продуктах и выбранной карточки.Класс имеет следующие свойства и методы:
- protected _productCards: ICardProduct[];
- protected _selectedСard: ICardProduct;
- setPreview(item: ICardProduct) -  Получает данные карточки которую открыл пользователь.Этот метод используется для октрытия модального окна

#### Интерфейс IBasketModel определяет структуру и методы, которые должен иметь класс BasketModel:
```
interface IBasketModel {
  protected _basketProducts: ICardProduct[];
  getCounter: () => number;
  getSumAllProducts: () => number;
  setSelectedСard(data: ICardProduct): void;
  deleteCardToBasket(item: ICardProduct): void;
  clearBasketProducts(): void
}
  ```

#### Класс BasketModel реализует Интерфейс IBasketModel, хранит и работает с данными, полученными от пользователя. 
Свойства:
- protected _basketProducts: ICardProduct[]; - содержит массив товаров в корзине

Конструктор инициализирует пустой массив товаров.

Методы:
- getCounter():number - возвращает количество товаров в корзине.
- getSumProducts():number - считает и возвращает сумму синапсов всех товаров в корзине.
- setSelectedСard(data: ICardProduct):void - принимает карточку нужного типа и добавляет товар в корзину.
- deleteCardBasket(data: ICardProduct):void - принимает карточку нужного типа удаляет товар из корзины.
- clearBasketProducts(): void - очищает/удаляет все товары из корзины.

#### Интерфейс IApiModel определяет структуру и методы, которые должен иметь класс ApiModel:
```
interface IApiModel {
  protected _cdn: string; 
  getListProductCard():void;
  getIdProduct():void;
  createOrder(): void
}
  ```

#### Класс ApiModel наследует класс Api и передает\получает данные с сервера.
Свойства:
- protected _cdn: string - хранит URL для изображений продуктов

Конструктор принимает url сервера с контентом, url по которому будут совершаться запросы и общие опции для этих запросов

Методы:
- getListProductCard() => Promise<ICardProduct>; - получает массив товаров с сервера
- getIdProduct(id: string) => Promise<ICardProduct> - возвращает товар по его id
- createOrder: (order: IOrderForm) => Promise<IOrderResult> - отправляет переданный заказ на сервер и возвращает результат


#### Класс FormModel хранит и получает данные полученные от пользователя
Свойства:
- private payment: string;
- private email: string;
- private phone: string;
- private address: string;

Методы: 
- setOrderAddress(field: string, value: string) - принимает/сохраняет адрес пользователя.
- validateOrder(): boolean - проверяет адрес пользователя / и способ оплаты.
- setOrderData(field: string, value: string) - принимаем/сохраняет номер телефона/почту пользователя.
- validateContacts(): boolean - проверяет номер телефона/почту пользователя.
- getOrderLot(basket: IBasketModel): { 
    total: number; 
    items: string[]; 
  }; - будет принимать экземпляр BasketModel и возвращать объект с данными о стоимости и списке товаров

### Слой представления

#### Класс Basket отвечает за отоброжение корзины и ее содержимого
Свойства:
- private basket: HTMLElement; 
- private title: HTMLElement; 
- private basketList: HTMLElement; 
- private button: HTMLButtonElement; 
- private basketPrice: HTMLElement; 
- private headerBasketButton: HTMLButtonElement; 
- private headerBasketCounter: HTMLElement; 

- private items: IProductItem[] = []; // Хранит товары в корзине

Конструктор инициализирует элементы разметки из темплейт

Методы:
- render() - отображение корзины.
- renderHeaderBasketCounter(value: number): обновляет счетчик товаров в заголовке.
- renderSumAllProducts(sumAll: number): обновляет отображение общей стоимости товаров в корзине.
- addItem(data: IProductItem): добавляет новый товар в корзину.
- removeItem(item: HTMLElement): удаляет товар из корзины.
- createBasketItem(data: IProductItem) - служит для создания и отображения элемента товара в корзине
- updateBasketPrice(): обновляет сумму всех товаров и счетчик.
- setPrice(value: number) - принимает цену продукта в числовом значении и возвращает в строчном.

#### Класс Card реализует Интерфейс ICardProduct и управляет отображением карточки неа главной странице
Свойства:
- protected _title - элемент заголовка карточки
- protected _category - элемент категории карточки;
- protected _description - элемент описания карточки
- protected _image - элемент картинки карточки
- protected _price - элемент цены карточки

Методы:
- render(data: ICardProduct) - отвечает за отображение содержимого карточки на странице  

Конструктор принимает родительский контейнер.


#### Класс CardPrewiew отвечает за отображение подробного описания карточки товара в модальном окне и дает возможность добавить ее в корзину. наследует класс Card 
Свойства: 
- protected _description: HTMLElement - текст карточки 
- protected _button: HTMLButtonElement - кнопка добавления в корзину

Конструктор принимает темплейт-превью.

Методы:
- render - отвечает за отображение карточки в превью


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
- containerModal - Элемент разметки (родительский контейнер)
- buttonClose - кнопка закрытия 
- content - блок основного содержимого в контейнере
- pageWrapper - Главная страница

В конструктор принимает блок modal-container

Методы:
- open()
- close()
- render()



#### Класс Success отвечает за отоброжение окна удачной покупки 
Свойства:
- container: HTMLElement;
- title: HTMLElement;
- description: HTMLElement;
- button: HTMLButtonElement;

В конструктор принимает темплейт-Success

Методы:
- render - отвечает за присвоение суммы покупки в поле description и за общее отображение окна