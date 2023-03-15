export interface HttpResponseInterface {
  success?: boolean;
  data?: unknown;
  message?: string;
}

export class HttpReturn {
  public static build(
    { success, data, message }: HttpResponseInterface = {
      success: true,
      data: {},
      message: '',
    },
  ) {
    return {
      success: success ?? true,
      data: data ?? {},
      message: message ?? '',
    };
  }
}
