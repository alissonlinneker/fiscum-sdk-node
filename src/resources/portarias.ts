import type { HttpClient } from '../client.js';
import type {
  ListPortariasParams,
  ListPortariasResponse,
  PortariaDetalhe,
  PortariaTipo,
} from '../types.js';

export class PortariasResource {
  constructor(private readonly client: HttpClient) {}

  /**
   * List portarias estaduais with optional filters.
   *
   * @example
   *   const { itens, total } = await fiscum.portarias.list({ uf: 'SP', ncm: '22030000' });
   */
  list(params: ListPortariasParams = {}): Promise<ListPortariasResponse> {
    const query: Record<string, string | number | undefined> = {
      uf: params.uf,
      ncm: params.ncm,
      tipo: params.tipo,
      desde: params.desde,
      limite: params.limite,
      offset: params.offset,
    };
    return this.client.get<ListPortariasResponse>('/v1/portarias', query);
  }

  /**
   * Get the full detail of a single portaria, including `texto_integral`
   * and the list of affected NCMs.
   *
   * @param uf UF of the issuing authority (2 letters)
   * @param tipo Act type (portaria, resolucao, decreto, ...)
   * @param numero Portaria number (may contain "/", e.g. "3045/2025")
   */
  get(uf: string, tipo: PortariaTipo, numero: string): Promise<PortariaDetalhe> {
    return this.client.get<PortariaDetalhe>(
      `/v1/portarias/${encodeURIComponent(uf)}/${encodeURIComponent(tipo)}/${encodeURIComponent(numero)}`,
    );
  }
}
