import type { HttpClient } from '../client.js';
import type { ConsultarRegrasFiscaisParams, RegrasFiscaisResponse } from '../types.js';

export class RegrasFiscaisResource {
  constructor(private readonly client: HttpClient) {}

  /** Classify products with tax rules for given UFs. */
  consultar(params: ConsultarRegrasFiscaisParams): Promise<RegrasFiscaisResponse> {
    return this.client.post<RegrasFiscaisResponse>('/v1/regras-fiscais', params);
  }
}
