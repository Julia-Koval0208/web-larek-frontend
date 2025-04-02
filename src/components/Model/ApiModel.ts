import { ICardProduct, IOrder, IOrderResult } from "../../types";
import { Api, ApiListResponse } from "../base/api";

export class ApiModel extends Api {
   cdn: string;
  
  constructor(cdn:string, baseUrl:string, options: RequestInit = {}) {
    super(baseUrl, options)
    this.cdn = cdn
  }

  getListProductCard(): Promise<ICardProduct[]> {
    return this.get('/product').then((data: ApiListResponse<ICardProduct>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
  }
  
  getProduct(id: string): Promise<ICardProduct> {
		return this.get(`/product/${id}`).then((item: ICardProduct) => ({
			...item,
			image: this.cdn + item.image,
		}));
	}

  createOrder(order: IOrder): Promise<IOrderResult> {
    return this.post('/order', order).then((item: IOrderResult) => {
        return item; // Вернуть результат, полученный от сервера
    });
}
}