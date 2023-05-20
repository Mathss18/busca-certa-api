export interface IWhatsappService {
  sendTemplateMessage(to: string, payload: unknown): Promise<void>;
}
