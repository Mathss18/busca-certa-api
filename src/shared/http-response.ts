export interface HttpResponseInterface {
  success?: boolean;
  data?: unknown;
  message?: string;
}

export class HttpReturn {
  public static build({ success, data, message }: HttpResponseInterface) {
    return {
      success: success ?? true,
      data: data ?? {},
      message: message ?? '',
    };
  }
}
