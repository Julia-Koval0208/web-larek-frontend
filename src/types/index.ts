//Карточка товара
interface ICardProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
    render(): void;
}

//Форма ввода телефона и почты для покупки

interface IContactsForm {
    phone: string;
    email: string;
}

// Форма оплаты покупки

interface IOrderForm extends IContactsForm {
    adress: string;
    payment: string;
}


// Главная страница 
interface IPage {
    counter: number;
    listCards: ICardProduct[];
}

interface IOrderResult {
    id: string;
    total: number;
}

