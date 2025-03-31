import { IContacts } from '../../types';
import { IEvents } from '../base/events';
import { AppData } from '../Model/AppData';
import { Form } from '../common/Form';

export class Contacts extends Form<IContacts> {
	protected formModel: AppData;

	constructor(
		protected blockName: string,
		container: HTMLFormElement,
		protected events: IEvents,
		formModel: AppData // Принимаем модель формы через конструктор
	) {
		super(container, events);
		this.formModel = formModel;

		this.container.addEventListener('input', (e) => {
			const target = e.target as HTMLInputElement;
			if (target.name === 'email') {
				formModel.updateOrder('email', target.value);
				this.validState(() => this.formModel.validateContacts());
				this.setErrors(this.formModel.formErrors);
			}
			if (target.name === 'phone') {
				formModel.updateOrder('phone', target.value);
				this.validState(() => this.formModel.validateContacts());
				this.setErrors(this.formModel.formErrors);
			}
		});

		this.container.addEventListener('submit', (e: Event) => {
			e.preventDefault();
			const isValid = this.formModel.validateContacts(); // Проверяем валидность контактов
			if (isValid) {
				console.log('Форма валидна, данные контактов:', this.formModel.order);
			} else {
				this.setErrors(this.formModel.formErrors); // Устанавливаем ошибки, если форма не валидна
			}
		});
	}

}
