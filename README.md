# @fiscum/sdk

SDK oficial em Node.js/TypeScript para a API **Fiscum Classifica** — regras fiscais, NCM, GTIN, cálculos tributários e mais.

## Instalação

```bash
npm install @fiscum/sdk
```

> Requer Node.js 18+ (utiliza `fetch` nativo, sem dependências externas).

## Início rápido

```ts
import { Fiscum } from '@fiscum/sdk';

const fiscum = new Fiscum({ apiKey: 'fsc_live_...' });

// Consultar regras fiscais
const regras = await fiscum.regrasFiscais.consultar({
  cabecalho: { cnpj: '00000000000100', crt: 3, uf_emitente: 'SP' },
  uf: ['SP', 'RJ'],
  produto: [{ descricao: 'Café torrado', ncm: '09012100' }],
});

// Consultar NCM
const ncm = await fiscum.ncm.consultar('21011110');

// Sugerir NCM a partir de descrição
const sugestoes = await fiscum.ncm.sugerir('arroz branco');

// Validar GTIN
const gtin = await fiscum.gtin.validar('7891000315507');

// Calcular DIFAL
const difal = await fiscum.calculos.difal({
  ncm: '21011110',
  uf_origem: 'SP',
  uf_destino: 'MG',
  valor: 100,
  crt: 3,
  contribuinte: 1,
});
```

## Configuração

```ts
const fiscum = new Fiscum({
  apiKey: 'fsc_live_...',          // Obrigatório
  baseUrl: 'https://sandbox...',   // Opcional (padrão: https://api.fiscum.com.br)
  timeout: 15_000,                 // Opcional (padrão: 30s)
  maxRetries: 5,                   // Opcional (padrão: 3)
});
```

## Referência da API

### Regras Fiscais

```ts
await fiscum.regrasFiscais.consultar({ cabecalho, uf, produto });
```

### NCM

```ts
await fiscum.ncm.consultar('21011110');
await fiscum.ncm.validar('21011110');
await fiscum.ncm.sugerir('café torrado');
await fiscum.ncm.historico('21011110', { uf: 'SP' });
await fiscum.ncm.reforma('21011110', { uf: 'SP' });
```

### GTIN

```ts
await fiscum.gtin.validar('7891000315507');
await fiscum.gtin.enriquecer('7891000315507');
await fiscum.gtin.bulk(['7891000315507', '7891000100103']);
```

### Cálculos

```ts
await fiscum.calculos.difal({ ncm, uf_origem, uf_destino, valor, crt, contribuinte }); // contribuinte: 0 | 1
await fiscum.calculos.icmsSt({ ncm, uf, valor, iva });
await fiscum.calculos.transparenciaFiscal({ ncm, uf, valor });
await fiscum.calculos.municipio({ ncm, uf, municipio_ibge, valor, tipo_servico: 'consultoria' });
```

### Changelog

```ts
await fiscum.changelog.listar({ page: 1, limit: 20, uf: 'SP' });
await fiscum.changelog.alterados('00000000000100', 'SP', 50);
```

### Webhooks

```ts
await fiscum.webhooks.subscribe({ url: 'https://...', eventos: ['regra_atualizada'], ufs: ['SP'] });
await fiscum.webhooks.listar();
await fiscum.webhooks.deletar('webhook-id');
```

### Produto

```ts
await fiscum.produto.classificar({
  codigo: 'SKU001',
  descricao: 'Café torrado',
  ncm: '09012100',
  valor_unitario: 25.90,
  volume_vendas_mensal: 1500,
});
```

### Regime Especial

```ts
await fiscum.regimeEspecial.buscar({ uf: 'SP', cnae: '4711301' });
```

### IBPT

```ts
await fiscum.ibpt.consultar('21011110', 'SP');
```

### Conta

```ts
await fiscum.conta.uso();
await fiscum.conta.uso({ periodo: '2026-04' });
```

### Auth

```ts
await fiscum.auth.gerar();
await fiscum.auth.revogar('key-id');
```

### Status

```ts
await fiscum.health();                     // Sem autenticação
await fiscum.metrics();
await fiscum.statusCliente('00000000000100');
```

## Tratamento de erros

```ts
import { Fiscum, FiscumError } from '@fiscum/sdk';

try {
  await fiscum.ncm.consultar('00000000');
} catch (err) {
  if (err instanceof FiscumError) {
    console.error(err.status);   // 404
    console.error(err.code);     // 'NCM_NAO_ENCONTRADO'
    console.error(err.message);  // 'NCM não encontrado'
  }
}
```

## Retry automático

Requisições que retornam `429` (rate limit) ou `5xx` (erro do servidor) são automaticamente retentadas com backoff exponencial (até 3 tentativas por padrão). Configurável via `maxRetries`.

## Licença

MIT
