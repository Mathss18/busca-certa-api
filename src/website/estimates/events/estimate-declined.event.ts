export type EstimateDeclinedEventType = {
  estimateId: number;
  reason: string;
};

export class EstimateDeclinedEvent {
  public estimateId: number;
  public reason: string;
  constructor(public payload: EstimateDeclinedEventType) {
    this.estimateId = payload.estimateId;
    this.reason = payload.reason;
  }
}
