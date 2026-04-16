import type { HttpClient } from '../client.js';
import type {
  CalcularDifalParams,
  CalcularDifalResponse,
  CalcularIcmsStParams,
  CalcularIcmsStResponse,
  CalcularMunicipioParams,
  CalcularMunicipioResponse,
  TransparenciaFiscalParams,
  TransparenciaFiscalResponse,
} from '../types.js';

export class CalculosResource {
  constructor(private readonly client: HttpClient) {}

  /** Calculate DIFAL (Diferencial de Alíquota). */
  difal(params: CalcularDifalParams): Promise<CalcularDifalResponse> {
    return this.client.post<CalcularDifalResponse>('/v1/calcular/difal', params);
  }

  /** Calculate ICMS-ST (Substituição Tributária). */
  icmsSt(params: CalcularIcmsStParams): Promise<CalcularIcmsStResponse> {
    return this.client.post<CalcularIcmsStResponse>('/v1/calcular/icms-st', params);
  }

  /** Calculate fiscal transparency (Transparência Fiscal). */
  transparenciaFiscal(params: TransparenciaFiscalParams): Promise<TransparenciaFiscalResponse> {
    return this.client.post<TransparenciaFiscalResponse>('/v1/calcular/transparencia-fiscal', params);
  }

  /** Calculate municipality-specific taxes. */
  municipio(params: CalcularMunicipioParams): Promise<CalcularMunicipioResponse> {
    return this.client.post<CalcularMunicipioResponse>('/v1/calcular/municipio', params);
  }
}
