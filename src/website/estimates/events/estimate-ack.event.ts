export type EstimateAckEventType = {
  estimateId: number;
};

export class EstimateAckEvent {
  public estimateId: number;
  constructor(public payload: EstimateAckEventType) {
    this.estimateId = payload.estimateId;
  }
}
