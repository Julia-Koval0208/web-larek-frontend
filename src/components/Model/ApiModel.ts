import { ICardProduct, IOrderForm, IOrderResult } from "../../types";
import { Api, ApiListResponse } from "../base/api";

export class ApiModel extends Api {
  protected _cdn: string;
  constructor(cdn:string, baseUrl:string, options: RequestInit = {}) {
    super(baseUrl, options)
    this._cdn = cdn
  }

  getListProductCard(): Promise<ICardProduct[]> {
    return this.get('/product').then((data: ApiListResponse<ICardProduct>) =>
			data.items.map((item) => ({
				...item,
				image: this._cdn + item.image,
			}))
		);
  }
  
  getProduct(id: string): Promise<ICardProduct> {
		return this.get(`/product/${id}`).then((item: ICardProduct) => ({
			...item,
			image: this._cdn + item.image,
		}));
	}

  createOrder(order: IOrderForm): Promise<IOrderResult> {
    return this.post('/order', order).then((item: IOrderResult) => {
        return item; // Вернуть результат, полученный от сервера
    });
}
}