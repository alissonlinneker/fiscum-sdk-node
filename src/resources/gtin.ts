import type { HttpClient } from '../client.js';
import type {
  GtinBulkParams,
  GtinBulkResponse,
  GtinEnriquecerResponse,
  GtinValidarResponse,
} from '../types.js';

export class GtinResource {
  constructor(private readonly client: HttpClient) {}

  /** Validate a GTIN code. */
  validar(gtin: string): Promise<GtinValidarResponse> {
    return this.client.get<GtinValidarResponse>(`/v1/gtin/${encodeURIComponent(gtin)}/validar`);
  }

  /** Enrich a GTIN with fiscal data. */
  enriquecer(gtin: string): Promise<GtinEnriquecerResponse> {
    return this.client.get<GtinEnriquecerResponse>(`/v1/gtin/${encodeURIComponent(gtin)}/enriquecer`);
  }

  /** Bulk GTIN enrichment. */
  bulk(gtins: string[]): Promise<GtinBulkResponse> {
    const params: GtinBulkParams = { gtins };
    return this.client.post<GtinBulkResponse>('/v1/gtin/bulk', params);
  }
}
