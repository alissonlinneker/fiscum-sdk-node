// ── Client options ──────────────────────────────────────────────────────────

export interface FiscumOptions {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
  maxRetries?: number;
}

// ── Error ──────────────────────────────────────────────────────────────────

export interface FiscumErrorBody {
  /** API error message (mapped from `erro` field in the response) */
  erro?: string;
  /** Machine-readable error code (mapped from `codigo` field in the response) */
  codigo?: string;
  /** Fallback fields for non-standard responses */
  message?: string;
  code?: string;
  status?: number;
}

// ── Auth ───────────────────────────────────────────────────────────────────

export interface GerarApiKeyResponse {
  api_key: string;
  prefix: string;
  aviso: string;
}

export interface RevogarApiKeyResponse {
  mensagem: string;
}

// ── Regras Fiscais ─────────────────────────────────────────────────────────

export interface RegrasFiscaisCabecalho {
  cnpj: string;
  crt: number;
  uf_emitente: string;
  finalidade?: number;
  [key: string]: unknown;
}

export interface RegrasFiscaisProduto {
  codigo?: string;
  descricao: string;
  ncm: string;
  gtin?: string;
  cest?: string;
  valor_unitario?: number;
  [key: string]: unknown;
}

export interface ConsultarRegrasFiscaisParams {
  cabecalho: RegrasFiscaisCabecalho;
  uf: string[];
  produto: RegrasFiscaisProduto[];
}

// Concrete response shape mirrors OpenAPI `RegrasFiscaisResponse` +
// shared components (`Grupo`, `RegraIcms`, `FiscumMeta`) kept in sync with `openapi.yaml`.
export interface PisCofinsRule {
  cstPis?: string;
  cstCofins?: string;
  aliqPis?: number;
  aliqCofins?: number;
  baseCalculo?: number;
  [key: string]: unknown;
}

export interface IpiRule {
  cst?: string;
  aliq?: number;
  codEnq?: string;
  [key: string]: unknown;
}

export interface CbsRule {
  cst?: string;
  aliq?: number;
  [key: string]: unknown;
}

export interface IbsRule {
  cst?: string;
  aliq?: number;
  [key: string]: unknown;
}

export interface RegraIcms {
  codigo: number;
  uf: string;
  cst: string;
  aliq?: number;
  aliqInterna?: number;
  aliqInterestadual?: number;
  reducaoBC?: number;
  mva?: number;
  fcp?: number;
  cestId?: string;
  codBenef?: string;
  [key: string]: unknown;
}

export interface Grupo {
  codigo: number;
  ncm: string;
  descricaoNcm?: string;
  cest?: string;
  lista?: string;
  tipo?: string;
  codanp?: string;
  piscofins?: PisCofinsRule;
  ipi?: IpiRule;
  cbs?: CbsRule;
  ibs?: IbsRule;
  regra: RegraIcms[];
  produto: Array<{
    codigo: string;
    descricao: string;
    ncm: string;
    cest?: string;
    curva?: string;
    tipoCodigo?: number;
    [key: string]: unknown;
  }>;
  [key: string]: unknown;
}

export interface BaixaSimilaridade {
  codigoProduto: string;
  descricaoFiscum?: string;
  descricaoInformada?: string;
  percentualSimilaridade: number;
  [key: string]: unknown;
}

export interface FiscumMeta {
  versao?: string;
  totalGrupos?: number;
  totalProdutos?: number;
  totalBaixaSimilaridade?: number;
  cacheHits?: number;
  cacheMisses?: number;
  versao_regra?: string;
  [key: string]: unknown;
}

export interface RegrasFiscaisResponse {
  cabecalho: {
    cnpj: string;
    cnae?: string;
    crt: number;
    uf_emitente: string;
    finalidade?: number;
    requestId?: string;
    duracao?: string;
    [key: string]: unknown;
  };
  grupo: Grupo[];
  baixaSimilaridade: BaixaSimilaridade[];
  fiscum: FiscumMeta;
  [key: string]: unknown;
}

// ── NCM ────────────────────────────────────────────────────────────────────

export interface NcmResponse {
  ncm: string;
  descricao: string;
  [key: string]: unknown;
}

export interface NcmValidarResponse {
  valido: boolean;
  ncm: string;
  [key: string]: unknown;
}

export interface NcmSugerirParams {
  descricao: string;
  [key: string]: unknown;
}

export interface NcmSugerirResponse {
  descricao_pesquisada: string;
  total: number;
  sugestoes: Array<{
    ncm: string;
    descricao: string;
    relevancia: number;
    [key: string]: unknown;
  }>;
  [key: string]: unknown;
}

export interface NcmHistoricoParams {
  uf?: string;
}

export interface NcmHistoricoResponse {
  [key: string]: unknown;
}

export interface NcmReformaParams {
  uf?: string;
}

export interface NcmReformaResponse {
  [key: string]: unknown;
}

// ── GTIN ───────────────────────────────────────────────────────────────────

export interface GtinValidarResponse {
  valido: boolean;
  gtin: string;
  [key: string]: unknown;
}

export interface GtinEnriquecerResponse {
  gtin: string;
  [key: string]: unknown;
}

export interface GtinBulkParams {
  gtins: string[];
}

export interface GtinBulkResponse {
  total_enviados: number;
  total_encontrados: number;
  total_nao_encontrados: number;
  encontrados: Array<{
    gtin: string;
    ncm: string;
    descricao: string | null;
    marca: string | null;
    ncm_descricao: string | null;
    fonte: string;
    [key: string]: unknown;
  }>;
  nao_encontrados: string[];
  [key: string]: unknown;
}

// ── Cálculos ───────────────────────────────────────────────────────────────

export interface CalcularDifalParams {
  ncm: string;
  uf_origem: string;
  uf_destino: string;
  valor: number;
  crt: number;
  contribuinte: 0 | 1;
  importado?: boolean;
  [key: string]: unknown;
}

// Concrete DIFAL response mirrors OpenAPI `DifalResponse` (see openapi.yaml).
export interface CalcularDifalResponse {
  erro: boolean;
  ncm: string;
  uf_origem: string;
  uf_destino: string;
  valor: number;
  importado: boolean;
  contribuinte: 0 | 1;
  fonte_aliquota: 'banco' | 'padrao';
  aliq_interestadual: number;
  aliq_interna: number;
  fcp_percentual: number;
  difal_valor: number;
  difal_destino: number;
  difal_origem: number;
  fcp_valor: number;
  total: number;
  [key: string]: unknown;
}

export interface CalcularIcmsStParams {
  ncm: string;
  uf: string;
  valor: number;
  iva: number;
  [key: string]: unknown;
}

// Concrete ICMS-ST response mirrors OpenAPI `IcmsStResponse` (see openapi.yaml).
export interface CalcularIcmsStResponse {
  ncm: string;
  uf: string;
  valor: number;
  iva_percentual: number;
  aliq_icms: number;
  aliq_st: number;
  fcp_percentual: number;
  icms_proprio: number;
  base_st: number;
  icms_st: number;
  fcp_st: number;
  total_st: number;
  [key: string]: unknown;
}

export interface TransparenciaFiscalParams {
  ncm: string;
  uf: string;
  valor: number;
  [key: string]: unknown;
}

export interface TransparenciaFiscalResponse {
  [key: string]: unknown;
}

export interface CalcularMunicipioParams {
  ncm: string;
  uf: string;
  municipio_ibge: string;
  valor: number;
  tipo_servico?: string;
  [key: string]: unknown;
}

export interface CalcularMunicipioResponse {
  [key: string]: unknown;
}

// ── Changelog ──────────────────────────────────────────────────────────────

export interface ChangelogListarParams {
  page?: number;
  limit?: number;
  uf?: string;
  desde?: string;
  tipo?: string;
  fonte?: string;
}

export interface ChangelogListarResponse {
  [key: string]: unknown;
}

export interface AlteradosParams {
  nomeServico: string;
  dados: string;
  [key: string]: unknown;
}

export interface AlteradosResponse {
  [key: string]: unknown;
}

// ── Webhooks ───────────────────────────────────────────────────────────────

export interface WebhookSubscribeParams {
  url: string;
  eventos: string[];
  ufs?: string[];
  [key: string]: unknown;
}

export interface WebhookSubscribeResponse {
  id: string;
  [key: string]: unknown;
}

export interface WebhookListarResponse {
  webhooks: Array<{
    id: string;
    url: string;
    eventos: string[];
    [key: string]: unknown;
  }>;
  [key: string]: unknown;
}

export interface WebhookDeletarResponse {
  mensagem: string;
}

// ── Produto ────────────────────────────────────────────────────────────────

export interface ClassificarProdutoParams {
  codigo: string;
  descricao: string;
  ncm: string;
  valor_unitario: number;
  volume_vendas_mensal: number;
  [key: string]: unknown;
}

export interface ClassificarProdutoResponse {
  [key: string]: unknown;
}

// ── Regime Especial ────────────────────────────────────────────────────────

export interface RegimeEspecialBuscarParams {
  uf: string;
  cnae?: string;
  tipo?: string;
  [key: string]: unknown;
}

export interface RegimeEspecialBuscarResponse {
  [key: string]: unknown;
}

// ── Conta ──────────────────────────────────────────────────────────────────

export interface ContaUsoParams {
  periodo?: string;
}

export interface ContaUsoResponse {
  [key: string]: unknown;
}

// ── IBPT ───────────────────────────────────────────────────────────────────

export interface IbptResponse {
  ncm: string;
  [key: string]: unknown;
}

// ── Portarias ──────────────────────────────────────────────────────────────

export type PortariaTipo =
  | 'portaria'
  | 'resolucao'
  | 'decreto'
  | 'instrucao_normativa'
  | 'ato_declaratorio'
  | 'comunicado';

export interface Portaria {
  numero: string;
  tipo: PortariaTipo;
  uf: string;
  orgao_emissor: string;
  data_publicacao: string;
  dtvig_ini?: string | null;
  dtvig_fin?: string | null;
  assunto?: string;
  resumo?: string;
  url?: string;
  [key: string]: unknown;
}

export interface PortariaNcmAfetado {
  ncm: string;
  cest?: string | null;
  mva?: number | null;
  aliq?: number | null;
  observacao?: string;
  [key: string]: unknown;
}

export interface PortariaDetalhe extends Portaria {
  texto_integral: string;
  ncms: PortariaNcmAfetado[];
}

export interface ListPortariasParams {
  uf?: string;
  ncm?: string;
  tipo?: PortariaTipo;
  /** Data inicial no formato YYYY-MM-DD */
  desde?: string;
  limite?: number;
  offset?: number;
}

export interface ListPortariasResponse {
  total: number;
  limite?: number;
  offset?: number;
  itens: Portaria[];
}

// ── Status / Health ────────────────────────────────────────────────────────

export interface HealthResponse {
  status: string;
  [key: string]: unknown;
}

export interface MetricsResponse {
  [key: string]: unknown;
}

export interface StatusClienteResponse {
  [key: string]: unknown;
}
