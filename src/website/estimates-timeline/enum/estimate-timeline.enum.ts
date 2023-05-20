export class EstimateTimelineCode {
  private static Actor = {
    SUPPLIER: 1,
    CLIENT: 2,
  };

  private static Action = {
    CREATE: 0,
    UPDATE: 1,
    DELETE: 2,
    RECEIVE: 3,
    ACKNOWLEDGE: 4,
    ACCEPT: 5,
    DECLINE: 6,
  };

  private static Object = {
    ESTIMATE: 0,
    EMAIL: 1,
    WHATSAPP: 2,
  };

  static Events = {
    CREATED: {
      CODE: EstimateTimelineCode.Actor.SUPPLIER * 100 + EstimateTimelineCode.Action.CREATE * 10 + EstimateTimelineCode.Object.ESTIMATE,
      MESSAGE: 'Orçamento criado',
    },
    SENT_SUPPLIER_EMAIL: {
      CODE: EstimateTimelineCode.Actor.SUPPLIER * 100 + EstimateTimelineCode.Action.RECEIVE * 10 + EstimateTimelineCode.Object.EMAIL,
      MESSAGE: 'Email enviado para o fornecedor',
    },
    SENT_SUPPLIER_WHATSAPP: {
      CODE: EstimateTimelineCode.Actor.SUPPLIER * 100 + EstimateTimelineCode.Action.RECEIVE * 10 + EstimateTimelineCode.Object.WHATSAPP,
      MESSAGE: 'Whatsapp enviado para o fornecedor',
    },
    SENT_CLIENT_EMAIL: {
      CODE: EstimateTimelineCode.Actor.CLIENT * 100 + EstimateTimelineCode.Action.RECEIVE * 10 + EstimateTimelineCode.Object.EMAIL,
      MESSAGE: 'Email enviado para o cliente',
    },
    SENT_CLIENT_WHATSAPP: {
      CODE: EstimateTimelineCode.Actor.CLIENT * 100 + EstimateTimelineCode.Action.RECEIVE * 10 + EstimateTimelineCode.Object.WHATSAPP,
      MESSAGE: 'Whatsapp enviado para o cliente',
    },
    SUPPLIER_ACK_ESTIMATE: {
      CODE: EstimateTimelineCode.Actor.SUPPLIER * 100 + EstimateTimelineCode.Action.ACKNOWLEDGE * 10 + EstimateTimelineCode.Object.ESTIMATE,
      MESSAGE: 'Fornecedor viu o orçamento',
    },
    SUPPLIER_ACCEPT_ESTIMATE: {
      CODE: EstimateTimelineCode.Actor.SUPPLIER * 100 + EstimateTimelineCode.Action.ACCEPT * 10 + EstimateTimelineCode.Object.ESTIMATE,
      MESSAGE: 'Fornecedor aceitou o orçamento',
    },
    SUPPLIER_DECLINE_ESTIMATE: {
      CODE: EstimateTimelineCode.Actor.SUPPLIER * 100 + EstimateTimelineCode.Action.DECLINE * 10 + EstimateTimelineCode.Object.ESTIMATE,
      MESSAGE: 'Fornecedor recusou o orçamento',
    },
  };
}
