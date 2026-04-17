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

  /**
   * Bulk GTIN enrichment.
   *
   * @deprecated The `POST /v1/gtin/bulk` endpoint is temporarily disabled and
   * responds with HTTP 503 `BULK_DISABLED` on every call. Use
   * {@link GtinResource.enriquecer} for each GTIN individually instead.
   *
   * Calling this method still issues the network request (which will return
   * 503), but emits a one-time `console.warn` deprecation notice so integrators
   * notice the change in development.
   *
   * @see https://docs.fiscum.com.br/endpoints/04-gtin#post-v1gtinbulk
   */
  bulk(gtins: string[]): Promise<GtinBulkResponse> {
    GtinResource.warnBulkDeprecated();
    const params: GtinBulkParams = { gtins };
    return this.client.post<GtinBulkResponse>('/v1/gtin/bulk', params);
  }

  private static bulkWarned = false;

  private static warnBulkDeprecated(): void {
    if (GtinResource.bulkWarned) return;
    GtinResource.bulkWarned = true;
    // eslint-disable-next-line no-console
    console.warn(
      '[fiscum] GtinResource.bulk() is deprecated: POST /v1/gtin/bulk is temporarily disabled ' +
        '(HTTP 503 BULK_DISABLED). Use gtin.enriquecer(gtin) for each code instead.'
    );
  }
}
