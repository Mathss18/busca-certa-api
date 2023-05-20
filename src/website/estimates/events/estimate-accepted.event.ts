export type EstimateAcceptedEventType = {
  estimateId: number;
  price: number;
};

export class EstimateAcceptedEvent {
  public estimateId: number;
  public price: number;
  constructor(public payload: EstimateAcceptedEventType) {
    this.estimateId = payload.estimateId;
    this.price = payload.price;
  }
}
