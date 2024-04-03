import type { CompiledQuery, DatabaseConnection, Driver, QueryResult } from "kysely";

export type RequestInitLimited = Omit<RequestInit, "cache"> & {
  /**
   * Only `force-cache`, `no-store` or `undefined` is compatible with nextjs http cache.
   *
   * So we limit this to not accidentally use stuff like `reload` or `no-cache` etc here.
   */
  cache?: "force-cache" | "no-store";
};

export interface FetchDriverConfig {
  /** fetch(url, init) */
  url: string;
  /** fetch(url, init) */
  init?: RequestInitLimited;
  transformer: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    stringify: (value: any) => string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parse: (str: string) => any;
  };
}

export class FetchDriver implements Driver {
  config: FetchDriverConfig;

  constructor(config: FetchDriverConfig) {
    this.config = config;
  }

  async init(): Promise<void> {
    // Nothing to do here.
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async acquireConnection(): Promise<DatabaseConnection> {
    return new FetchConnection(this.config);
  }

  async beginTransaction(): Promise<void> {
    // Nothing to do here.
  }

  async commitTransaction(): Promise<void> {
    // Nothing to do here.
  }

  async rollbackTransaction(): Promise<void> {
    // Nothing to do here.
  }

  async releaseConnection(): Promise<void> {
    // Nothing to do here.
  }

  async destroy(): Promise<void> {
    // Nothing to do here.
  }
}

class FetchConnection implements DatabaseConnection {
  config: FetchDriverConfig;

  constructor(config: FetchDriverConfig) {
    this.config = config;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async *streamQuery<R>(): AsyncIterableIterator<QueryResult<R>> {
    throw new Error("FetchConnection does not support streaming");
  }

  async executeQuery<R>(compiledQuery: CompiledQuery): Promise<QueryResult<R>> {
    const q = this.config.transformer.stringify({
      sql: compiledQuery.sql,
      parameters: compiledQuery.parameters,
    });

    const url = `${this.config.url}?q=${encodeURIComponent(q)}`;
    const res = await fetch(url, this.config.init);

    if (res.ok) {
      try {
        const result = this.config.transformer.parse(await res.text()) as QueryResult<R>;
        return result;
      } catch (error) {
        throw new Error("failed to parse response");
      }
    } else {
      const text = await res.text();
      console.log("executeQuery not ok, res.text:", text);
      throw new Error(`${res.status} ${res.statusText}`);
    }
  }
}
