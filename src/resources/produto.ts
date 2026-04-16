import type { HttpClient } from '../client.js';
import type { ClassificarProdutoParams, ClassificarProdutoResponse } from '../types.js';

export class ProdutoResource {
  constructor(private readonly client: HttpClient) {}

  /** Classify a product (ABC curve). */
  classificar(params: ClassificarProdutoParams): Promise<ClassificarProdutoResponse> {
    return this.client.post<ClassificarProdutoResponse>('/v1/produto/classificar', params);
  }
}
