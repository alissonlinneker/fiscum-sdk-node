import type { HttpClient } from '../client.js';
import type {
  AlteradosParams,
  AlteradosResponse,
  ChangelogListarParams,
  ChangelogListarResponse,
} from '../types.js';

export class ChangelogResource {
  constructor(private readonly client: HttpClient) {}

  /** List fiscal changes with optional filters. */
  listar(params?: ChangelogListarParams): Promise<ChangelogListarResponse> {
    return this.client.get<ChangelogListarResponse>(
      '/v1/changelog',
      params as Record<string, string | number | undefined>,
    );
  }

  /** Get changed products. */
  alterados(params?: AlteradosParams): Promise<AlteradosResponse> {
    return this.client.post<AlteradosResponse>('/v1/alterados', params);
  }
}
