import type { HttpClient } from '../client.js';
import type { ContaUsoParams, ContaUsoResponse } from '../types.js';

export class ContaResource {
  constructor(private readonly client: HttpClient) {}

  /** Get account usage metrics, optionally filtered by period (YYYY-MM). */
  uso(params?: ContaUsoParams): Promise<ContaUsoResponse> {
    return this.client.get<ContaUsoResponse>(
      '/v1/minha-conta/uso',
      params as Record<string, string | undefined>,
    );
  }
}
