import type { HttpClient } from '../client.js';
import type { GerarApiKeyResponse, RevogarApiKeyResponse } from '../types.js';

export class AuthResource {
  constructor(private readonly client: HttpClient) {}

  /** Rotate (generate) a new API key. */
  gerar(): Promise<GerarApiKeyResponse> {
    return this.client.post<GerarApiKeyResponse>('/v1/auth/api-key/gerar');
  }

  /** Revoke an API key by id. */
  revogar(id: string): Promise<RevogarApiKeyResponse> {
    return this.client.delete<RevogarApiKeyResponse>(`/v1/auth/api-key/${encodeURIComponent(id)}`);
  }
}
