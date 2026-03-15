import { drizzle, type DrizzleD1Database } from "drizzle-orm/d1";
import * as schema from "./schema";

export type DbClient = DrizzleD1Database<typeof schema>;

/**
 * Create a Drizzle ORM instance backed by Cloudflare D1.
 *
 * Usage in a Cloudflare Pages function or Next.js middleware:
 * ```ts
 * const db = createDb(env.DB);
 * ```
 */
export function createDb(d1: D1Database): DbClient {
  return drizzle(d1, { schema });
}
