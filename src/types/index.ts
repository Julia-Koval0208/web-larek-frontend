
//Карточка товара
export interface ICardProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface IOrderForm {
    phone: string;
    email: string;
    address: string;
    payment: string;
}

// Главная страница 
export interface IPage {
    counter: number;
    listCards: ICardProduct[];
}

export interface IOrderResult {
    id: string;
    total: number;
}

