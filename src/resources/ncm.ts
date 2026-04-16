import type { HttpClient } from '../client.js';
import type {
  NcmHistoricoParams,
  NcmHistoricoResponse,
  NcmReformaParams,
  NcmReformaResponse,
  NcmResponse,
  NcmSugerirParams,
  NcmSugerirResponse,
  NcmValidarResponse,
} from '../types.js';

export class NcmResource {
  constructor(private readonly client: HttpClient) {}

  /** Lookup NCM details. */
  consultar(ncm: string): Promise<NcmResponse> {
    return this.client.get<NcmResponse>(`/v1/ncm/${encodeURIComponent(ncm)}`);
  }

  /** Validate an NCM code. */
  validar(ncm: string): Promise<NcmValidarResponse> {
    return this.client.get<NcmValidarResponse>(`/v1/ncm/${encodeURIComponent(ncm)}/validar`);
  }

  /** Suggest NCM codes from a product description. */
  sugerir(descricao: string): Promise<NcmSugerirResponse> {
    const params: NcmSugerirParams = { descricao };
    return this.client.post<NcmSugerirResponse>('/v1/ncm/sugerir', params);
  }

  /** Get NCM change history, optionally filtered by UF. */
  historico(ncm: string, params?: NcmHistoricoParams): Promise<NcmHistoricoResponse> {
    return this.client.get<NcmHistoricoResponse>(
      `/v1/ncm/${encodeURIComponent(ncm)}/historico`,
      params as Record<string, string | undefined>,
    );
  }

  /** Get tax reform info for an NCM, optionally filtered by UF. */
  reforma(ncm: string, params?: NcmReformaParams): Promise<NcmReformaResponse> {
    return this.client.get<NcmReformaResponse>(
      `/v1/ncm/${encodeURIComponent(ncm)}/reforma`,
      params as Record<string, string | undefined>,
    );
  }
}
