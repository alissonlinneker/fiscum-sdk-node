import type { FiscumErrorBody, FiscumOptions } from './types.js';

const DEFAULT_BASE_URL = 'https://api.fiscum.com.br';
const DEFAULT_TIMEOUT = 30_000;
const DEFAULT_MAX_RETRIES = 3;
const RETRY_STATUS_CODES = new Set([429, 500, 502, 503, 504]);
const INITIAL_RETRY_DELAY_MS = 500;

// ── Custom error ───────────────────────────────────────────────────────────

export class FiscumError extends Error {
  public readonly status: number;
  public readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = 'FiscumError';
    this.status = status;
    this.code = code;
  }
}

// ── HTTP client ────────────────────────────────────────────────────────────

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RequestOptions {
  method: HttpMethod;
  path: string;
  body?: unknown;
  query?: Record<string, string | number | undefined>;
  /** Skip the Authorization header (e.g. health check) */
  skipAuth?: boolean;
}

export class HttpClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly timeout: number;
  private readonly maxRetries: number;

  constructor(options: FiscumOptions) {
    if (!options.apiKey) {
      throw new Error('apiKey is required');
    }
    this.apiKey = options.apiKey;
    this.baseUrl = (options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, '');
    this.timeout = options.timeout ?? DEFAULT_TIMEOUT;
    this.maxRetries = options.maxRetries ?? DEFAULT_MAX_RETRIES;
  }

  async request<T>(options: RequestOptions): Promise<T> {
    const url = this.buildUrl(options.path, options.query);
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    if (!options.skipAuth) {
      headers['X-API-Key'] = this.apiKey;
    }

    const fetchOptions: RequestInit = {
      method: options.method,
      headers,
      signal: AbortSignal.timeout(this.timeout),
    };
    if (options.body !== undefined) {
      fetchOptions.body = JSON.stringify(options.body);
    }

    let lastError: unknown;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const response = await fetch(url, fetchOptions);

        if (response.ok) {
          // Handle 204 No Content
          if (response.status === 204) {
            return undefined as T;
          }
          return (await response.json()) as T;
        }

        // Parse error body when possible
        let errorBody: FiscumErrorBody | undefined;
        try {
          errorBody = (await response.json()) as FiscumErrorBody;
        } catch {
          // response body is not JSON
        }

        const error = new FiscumError(
          response.status,
          errorBody?.code ?? `HTTP_${response.status}`,
          errorBody?.message ?? response.statusText,
        );

        // Only retry on retryable status codes
        if (!RETRY_STATUS_CODES.has(response.status) || attempt === this.maxRetries) {
          throw error;
        }

        lastError = error;
      } catch (err) {
        if (err instanceof FiscumError) {
          // Already handled above — rethrow non-retryable errors
          if (!RETRY_STATUS_CODES.has(err.status) || attempt === this.maxRetries) {
            throw err;
          }
          lastError = err;
        } else if (attempt === this.maxRetries) {
          throw err;
        } else {
          lastError = err;
        }
      }

      // Exponential backoff with jitter before next attempt
      const delay = INITIAL_RETRY_DELAY_MS * Math.pow(2, attempt) * (0.5 + Math.random() * 0.5);
      await this.sleep(delay);
    }

    // Should not reach here, but just in case
    throw lastError;
  }

  // ── Convenience methods ────────────────────────────────────────────────

  get<T>(path: string, query?: Record<string, string | number | undefined>, skipAuth = false): Promise<T> {
    return this.request<T>({ method: 'GET', path, query, skipAuth });
  }

  post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>({ method: 'POST', path, body });
  }

  delete<T>(path: string): Promise<T> {
    return this.request<T>({ method: 'DELETE', path });
  }

  // ── Private helpers ────────────────────────────────────────────────────

  private buildUrl(path: string, query?: Record<string, string | number | undefined>): string {
    const url = new URL(`${this.baseUrl}${path}`);
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined) {
          url.searchParams.set(key, String(value));
        }
      }
    }
    return url.toString();
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
