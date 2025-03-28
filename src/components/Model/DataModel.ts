import { ICardProduct } from "../../types";
import { IEvents } from "../base/events";

export class DataModel {
    protected _productCards: ICardProduct[]; // Хранит список карточек продуктов
    protected _selectedCard: ICardProduct | null; // Хранит текущую выбранную карточку продукта

    constructor(protected events: IEvents) {
        this._productCards = []; // Изначально массив пустой
        this._selectedCard = null; // Изначально нет выбранной карточки
    }           

  
    // Сеттер для свойства productCards
    set productCards(data: ICardProduct[]) {
        this._productCards = data; // Устанавливаем новое значение
        this.events.emit('productCards:receive'); // Уведомляем другие части приложения о том, что данные были обновлены
    }

    // Геттер для свойства productCards
    get productCards(): ICardProduct[] {
        return this._productCards; // Возвращаем текущий массив карточек продуктов
    }

    // Метод для установки выбранной карточки
    setPreview(item: ICardProduct) {
        this._selectedCard = item; // Устанавливаем выбранную карточку
        this.events.emit('selectedCardUpdated', item); // Уведомляем о том, что карточка выбрана
    }

    // Метод для получения информации о текущей выбранной карточке
    getPreview(): ICardProduct | null {
        return this._selectedCard; // Возвращает текущую выбранную карточку или null, если она не выбрана
    }
}