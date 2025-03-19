interface IDataModel {
	productCards: ICardProduct[];
	selectedСard: ICardProduct;
	setPreview(item: ICardProduct): void;
}

class DataModel implements IDataModel {
	protected _productCards: ICardProduct[];
	selectedСard: ICardProduct;

    constructor()
}
