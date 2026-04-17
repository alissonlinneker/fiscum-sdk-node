import { HttpClient } from './client.js';
import type { FiscumOptions, HealthResponse, MetricsResponse, StatusClienteResponse } from './types.js';
import { AuthResource } from './resources/auth.js';
import { RegrasFiscaisResource } from './resources/regras-fiscais.js';
import { NcmResource } from './resources/ncm.js';
import { GtinResource } from './resources/gtin.js';
import { CalculosResource } from './resources/calculos.js';
import { ChangelogResource } from './resources/changelog.js';
import { WebhooksResource } from './resources/webhooks.js';
import { ProdutoResource } from './resources/produto.js';
import { RegimeEspecialResource } from './resources/regime-especial.js';
import { IbptResource } from './resources/ibpt.js';
import { ContaResource } from './resources/conta.js';
import { PortariasResource } from './resources/portarias.js';

export class Fiscum {
  private readonly client: HttpClient;

  /** Authentication — rotate and revoke API keys */
  public readonly auth: AuthResource;
  /** Tax rules — classify products */
  public readonly regrasFiscais: RegrasFiscaisResource;
  /** NCM — lookup, validate, suggest, history, reform */
  public readonly ncm: NcmResource;
  /** GTIN — validate, enrich, bulk */
  public readonly gtin: GtinResource;
  /** Tax calculations — DIFAL, ICMS-ST, transparency, municipality */
  public readonly calculos: CalculosResource;
  /** Changelog — list changes, changed products */
  public readonly changelog: ChangelogResource;
  /** Webhooks — subscribe, list, delete */
  public readonly webhooks: WebhooksResource;
  /** Products — classify (ABC curve) */
  public readonly produto: ProdutoResource;
  /** Special regimes */
  public readonly regimeEspecial: RegimeEspecialResource;
  /** IBPT — tax burden */
  public readonly ibpt: IbptResource;
  /** Account — usage metrics */
  public readonly conta: ContaResource;
  /** Portarias — state fiscal ordinances (list and detail) */
  public readonly portarias: PortariasResource;

  constructor(options: FiscumOptions) {
    this.client = new HttpClient(options);

    this.auth = new AuthResource(this.client);
    this.regrasFiscais = new RegrasFiscaisResource(this.client);
    this.ncm = new NcmResource(this.client);
    this.gtin = new GtinResource(this.client);
    this.calculos = new CalculosResource(this.client);
    this.changelog = new ChangelogResource(this.client);
    this.webhooks = new WebhooksResource(this.client);
    this.produto = new ProdutoResource(this.client);
    this.regimeEspecial = new RegimeEspecialResource(this.client);
    this.ibpt = new IbptResource(this.client);
    this.conta = new ContaResource(this.client);
    this.portarias = new PortariasResource(this.client);
  }

  /** Health check (no auth required). */
  health(): Promise<HealthResponse> {
    return this.client.get<HealthResponse>('/v1/health', undefined, true);
  }

  /** System metrics. */
  metrics(): Promise<MetricsResponse> {
    return this.client.get<MetricsResponse>('/v1/metrics');
  }

  /** Client status by CNPJ. */
  statusCliente(cnpj: string): Promise<StatusClienteResponse> {
    return this.client.get<StatusClienteResponse>(`/v1/status-cliente/${encodeURIComponent(cnpj)}`);
  }
}
