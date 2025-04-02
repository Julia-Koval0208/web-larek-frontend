import { IContacts } from '../../types';
import { IEvents } from '../base/events';
import { Form } from '../common/Form';

export class Contacts extends Form<IContacts> {

	constructor(
		protected blockName: string,
		container: HTMLFormElement,
		events: IEvents
	  ) {
		super(container, events);
	  }
	}




