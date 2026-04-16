import type { HttpClient } from '../client.js';
import type { ContaUsoResponse } from '../types.js';

export class ContaResource {
  constructor(private readonly client: HttpClient) {}

  /** Get account usage metrics. */
  uso(): Promise<ContaUsoResponse> {
    return this.client.get<ContaUsoResponse>('/v1/minha-conta/uso');
  }
}
