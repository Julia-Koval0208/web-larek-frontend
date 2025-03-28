import { IOrderForm } from '../../types';
import { IEvents } from '../base/events';


export class FormModel {
    order: IOrderForm;
    formErrors: { [key: string]: string } = {};
    events: IEvents;

    constructor(events: IEvents) {
        this.order = {
            address: '',
            payment: '',
            phone: '',
            email: ''
        };
        this.events = events;
    }

    // Метод для обновления данных заказа
    updateOrder(field: keyof IOrderForm, value: string) {
        this.order[field] = value;
        // Запускаем валидацию после обновления
        this.validateOrder();
        console.log(this.order)
    }

    // Метод для валидации заказа
    validateOrder() {
        const errors: { [key: string]: string } = {};
        if (!this.order.address || this.order.address.length <3) {
            errors.address = 'Адрес обязателен';
        }
        if (!this.order.payment) {
            errors.payment = 'Способ оплаты обязателен';
        }

        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0; // Возвращает true, если ошибок нет
    }
}