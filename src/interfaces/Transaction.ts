export interface IHistoryVoucerTopup {
  gameName: String;
  category: String;
  thumbnail: String;
  coinName: String;
  coinQuantity: String;
  price: String;
}

export interface IHistoryPayment {
  name: String;
  type: String;
  bankName: String;
  noRekening: String;
}

export interface IHistoryUser {
  name: String;
  phoneNumber: String;
}