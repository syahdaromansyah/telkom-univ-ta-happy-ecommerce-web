export type ProductBrand = 'google-play' | 'steam';

export interface UserCredential {
  id: number;
  fullname: string;
  username: string;
  email: string;
}

export interface FeedbackData {
  id: number;
  fullName: string;
  feedback: string;
  createdAt: string;
}

export interface ProductData {
  id: number;
  brand: ProductBrand;
  type: string;
  name: string;
  priceName: string;
  productStock: number;
  productPrice: number;
  reservation: number;
  feedbacks: FeedbackData[] | null;
}

export interface OrderData {
  idOrder: string;
  idProduct: number;
  brand: ProductBrand;
  type: string;
  name: string;
  priceName: string;
  price: number;
  quantity: number;
  totalPrice: number;
  orderedDate: string;
  expiredDate: string;
  statusPayment: boolean;
  feedbackDone: boolean;
}

export interface WebResponse<T> {
  code: number;
  status: 'success' | 'failed';
  data: T;
}
