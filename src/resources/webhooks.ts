import type { HttpClient } from '../client.js';
import type {
  WebhookDeletarResponse,
  WebhookListarResponse,
  WebhookSubscribeParams,
  WebhookSubscribeResponse,
} from '../types.js';

export class WebhooksResource {
  constructor(private readonly client: HttpClient) {}

  /** Subscribe to webhook events. */
  subscribe(params: WebhookSubscribeParams): Promise<WebhookSubscribeResponse> {
    return this.client.post<WebhookSubscribeResponse>('/v1/webhooks/subscribe', params);
  }

  /** List active webhooks. */
  listar(): Promise<WebhookListarResponse> {
    return this.client.get<WebhookListarResponse>('/v1/webhooks');
  }

  /** Delete a webhook by id. */
  deletar(id: string): Promise<WebhookDeletarResponse> {
    return this.client.delete<WebhookDeletarResponse>(`/v1/webhooks/${encodeURIComponent(id)}`);
  }
}
