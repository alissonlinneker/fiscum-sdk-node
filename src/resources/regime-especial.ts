import type { HttpClient } from '../client.js';
import type { RegimeEspecialBuscarParams, RegimeEspecialBuscarResponse } from '../types.js';

export class RegimeEspecialResource {
  constructor(private readonly client: HttpClient) {}

  /** Search for special tax regimes. */
  buscar(params: RegimeEspecialBuscarParams): Promise<RegimeEspecialBuscarResponse> {
    return this.client.post<RegimeEspecialBuscarResponse>('/v1/regime-especial/buscar', params);
  }
}
