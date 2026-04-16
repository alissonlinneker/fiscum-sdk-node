import type { HttpClient } from '../client.js';
import type { IbptResponse } from '../types.js';

export class IbptResource {
  constructor(private readonly client: HttpClient) {}

  /** Get IBPT tax burden for an NCM, optionally filtered by UF. */
  consultar(ncm: string, uf?: string): Promise<IbptResponse> {
    return this.client.get<IbptResponse>(
      `/v1/ibpt/${encodeURIComponent(ncm)}`,
      uf ? { uf } : undefined,
    );
  }
}
