export type EstimateCreatedEventType = {
  estimateId: number;
};

export class EstimateCreatedEvent {
  public estimateId: number;
  constructor(public payload: EstimateCreatedEventType) {
    this.estimateId = payload.estimateId;
  }
}
