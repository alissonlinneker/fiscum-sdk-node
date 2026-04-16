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

  /**
   * Get changed products since the last query.
   * @param cnpj - CNPJ (14 digits)
   * @param uf - UF code (2 letters)
   * @param limite - Optional max results
   */
  alterados(cnpj: string, uf: string, limite?: number): Promise<AlteradosResponse> {
    let dados = `${cnpj}|${uf}`;
    if (limite !== undefined) {
      dados = `${dados}|${limite}`;
    }
    const body: AlteradosParams = { nomeServico: 'ALTERADOS', dados };
    return this.client.post<AlteradosResponse>('/v1/alterados', body);
  }
}
