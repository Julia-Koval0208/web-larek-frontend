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
    render(): void
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
  productCards: ICardProduct[]; 
  selectedСard: ICardProduct;
  setPreview(item: ICardProduct): void;
}
```
#### Класс DataModel реализует Интерфейс IDataModel. Он хранит данные о продуктах и выбранной карточки.Класс имеет следующие свойства и методы:
- protected _productCards: ICardProduct[];
- selectedСard: ICardProduct;
- setPreview(item: ICardProduct) -  Получает данные карточки которую открыл пользователь.Этот метод используется для октрытия модального окна

#### Интерфейс IBasketModel определяет структуру и методы, которые должен иметь класс BasketModel:
```
interface IBasketModel {
  basketProducts: ICardProduct[];
  getCounter: () => number;
  getSumAllProducts: () => number;
  setSelectedСard(data: ICardProduct): void;
  deleteCardToBasket(item: ICardProduct): void;
  clearBasketProducts(): void
}
  ```

#### Класс BasketModel реализует Интерфейс IBasketModel, хранит и работает с данными, полученными от пользователя. Класс имеет следующие методы:
- getCounter - возвращает количество товаров в корзине.
- getSumProducts - считает и возвращает сумму синапсов всех товаров в корзине.
- setSelectedСard - добавляет товар в корзину.
- deleteCardBasket - удаляет товар из корзины.
- clearBasketProducts - очищает/удаляет все товары из корзины.

#### Интерфейс IApiModel определяет структуру и методы, которые должен иметь класс ApiModel:
```
interface IApiModel {
  cdn: string;
  items: ICardProduct[];
  getListProductCard: () => Promise<ICardProduct[]>;
  postOrderLot: (order: IOrderForm) => Promise<IOrderResult>;
}
  ```

#### Класс ApiModel наследует класс Api и передает\получает данные с сервера. Класс имеет следующие методы:

- getArrProductsCards - получаем массив объектов(карточек) с сервера.
- postOrderLot - получаем ответ от сервера по сделанному/отправленному заказу.


#### Интерфейс IFormModel описывает свойства и методы, которые должен иметь класс FormModel: 
```
interface IFormModel {
  payment: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
  setOrderAddress(field: string, value: string): void
  validateOrder(): boolean;
  setOrderData(field: string, value: string): void
  validateContacts(): boolean;
  getOrderLot(): object;
}
```
#### Класс FormModel хранит и получает данные полученные от пользователя

- setOrderAddress - принимаем/сохраняет адрес пользователя.
- validateOrder - проверяет адрес пользователя / и способ оплаты.
- setOrderData - принимаем/сохраняет номер телефона/почту пользователя.
- validateContacts - проверяет номер телефона/почту пользователя.
- getOrderLot - возвращает объект данных пользователя с выбранными товарами.

### Слой представления

#### Интерфейс корзины, который Содержит свойства в виде элементов из верстки и методы работы 
```
interface IBasket {
  basket: HTMLElement;
  title: HTMLElement;
  basketList: HTMLElement;
  button: HTMLButtonElement;
  basketPrice: HTMLElement;
  headerBasketButton: HTMLButtonElement;
  headerBasketCounter: HTMLElement;
  renderHeaderBasketCounter(value: number): void;
  renderSumAllProducts(sumAll: number): void;
  render(): HTMLElement;
}
```

#### Класс Basket реализует Интерфейс IBasket и управляет отображением корзины.
Содержит свойства: 
- basket: HTMLElement - блок корзины из темплейта
- title: HTMLElement - заголовок корзины
- basketList: HTMLElement - список товаров в корзине
- button: HTMLButtonElement - кнопка
- basketPrice: HTMLElement - сумма синапсов
- headerBasketButton: HTMLButtonElement - кнопка открытия корзины
- headerBasketCounter: HTMLElement - счетчик товаров в корзине

В конструктор передается темплейт корзины из верстки.

Методы:
- render - отвечает за отображение корзины  
- renderHeaderBasketCounter - сохраняет и устанавливает какое количество товаров находится в корзине.
- renderSumAllProducts - сохраняет и устанавливает сумму синапсов всех товаров в корзине.

#### Интерфейс IBasketItem , который содержит следующие свойства и методы:
```
interface IBasketItem {
  basketItem: HTMLElement;
	index:HTMLElement;
	title: HTMLElement;
	price: HTMLElement;
	buttonDelete: HTMLButtonElement;
	render(data: IProductItem, item: number): HTMLElement;
}
```

#### Класс BasketItem реализует Интерфейс IBasketItem и   управляет отображением элементов(продуктов) в корзине.
Свойства:
- basketItem: HTMLElement - элемент(товар) в корзине
- index:HTMLElement - индекс элемента(товара)
- title: HTMLElement - название товара
- price: HTMLElement - цена товара
- buttonDelete: HTMLButtonElement - кнопка удаления товара из корзины

В конструктор принимает темплейт

Методы:
- render - отвечает за отображение содержимого карзины
- setPrice(value: number) - принимает цену продукта в числовом значении и возвращает в строчном.

#### Класс Card реализует Интерфейс ICardProduct и управляет отображением карточки неа главной странице
Методы:
- render(data: ICardProduct) - отвечает за отображение содержимого карточки на странице  

Конструктор принимает родительский контейнер.

#### Интерфейс ICardPreview
``` 
 interface ICardPreview {
description: HTMLElement;
button: HTMLButtonElement;
render(): void;
}
```

#### Класс CardPrewiew отвечает за отображение подробного описания карточки товара в модальном окне и дает возможность добавить ее в корзину. наследует класс Card и реализует Интерфейс ICardPreview
Свойства: 
- description: HTMLElement - текст карточки 
- button: HTMLButtonElement - кнопка добавления в корзину

Конструктор принимает темплейт-превью.

Методы:
- render - отвечает за отображение карточки в превью

#### Интерфейс IOrderFormPayment
```
interface IOrderFormPayment {
  form: HTMLElement;
  formErrors: HTMLElement;
  buttonAll: HTMLButtonElement[];
  buttonSubmit: HTMLButtonElement;
  render(): void;
}
```
#### Класс OrderFormPayment реализует интерфейс IOrderFormPayment и отвечает за выбор оплаты, ввод адреса и отображение модального окна
Свойства:
- form: HTMLElement - Элемент формы
- formErrors: HTMLElement - Спан ошибки
- buttonAll: HTMLButtonElement[] - кнопки выбора оплаты
- buttonSubmit: HTMLButtonElement - кнопка сабмита "Далее"

Конструктор принимает темплейт-order

Методы:
- render() - отвечает за показ модального окна 
- paintColorsPayment - отвечает за обводку выбранного способа оплаты

#### Интерфейс IOrderFormContacts 
```
form: HTMLElement;
inputTitle: HTMLElement[];
buttonSubmit: HTMLButtonElement;
formErrors: HTMLElement;
render(): void;
```
#### Класс OrderFormContacts реализует интерфейс IOrderFormContacts и отвечает за отображение модального окна и ввода личных данных  
Свойства:
- form: HTMLElement - Элемент формы
- formErrors: HTMLElement - Спан ошибки
- inputTitle: HTMLElement[] - поля ввода почты и телефона
- buttonSubmit: HTMLButtonElement - кнопка сабмита оплаты

Конструктор принимает темплейт-constants

Методы: 
- render - отображение содержимого модального окна


#### Интерфейс IModal 
```
interface IModal {
  open(): void;
  close(): void;
  render(): void;
}
```
#### Класс Modal отвечает за открытие и закрытие модального окна, реализует интерфейс IModal

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

#### Интерфейс ISuccess 
```
interface ISuccess {
  container: HTMLElement;
  title: HTMLElement;
  description: HTMLElement;
  button: HTMLButtonElement;
  render(): void;
}
```

#### Класс Success отвечает за отоброжение окна удачной покупки и реализует интерфейс ISuccess
Свойства:
- container: HTMLElement;
- title: HTMLElement;
- description: HTMLElement;
- button: HTMLButtonElement;

В конструктор принимает темплейт-Success

Методы:
- render - отвечает за присвоение суммы покупки в поле description и за общее отображение окна