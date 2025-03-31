import { ensureElement } from '../../utils/utils';
import { Component } from '../base/componets';
import { IEvents } from '../base/events';
import { AppData } from '../Model/AppData';

interface IFormState {
	valid: boolean;
	errors: string[];
}

export class Form<T> extends Component<IFormState> {
	protected _submit: HTMLButtonElement;
	protected _errors: HTMLElement;
	protected formModel: AppData;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container);

		this._submit = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			this.container
		);
		this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

		this.container.addEventListener('submit', (e: Event) => {
			e.preventDefault();
			this.events.emit(`${this.container.name}:submit`);
		});
	}

	set errors(value: string) {
		this.setText(this._errors, value);
	}

	protected validState(validateFn: () => boolean) {
		// Деактивируем кнопку, если форма не валидна
		const valid = validateFn();
		this._submit.disabled = !valid;
	}

	// Метод для установки ошибок
	protected setErrors(errors: { [key: string]: string }) {
		this.errors = Object.values(errors).join(', '); // Отображаем ошибки в интерфейсе
	}

	render(state: Partial<T> & IFormState) {
		const { valid, errors, ...inputs } = state;
		super.render({ valid, errors });
		Object.assign(this, inputs);
		return this.container;
	}
}
