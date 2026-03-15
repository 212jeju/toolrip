/** Standard API success/error envelope */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

/** Structured API error */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

/** Paginated list response */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/** Per-service configuration */
export interface ServiceConfig {
  /** Human-readable service name */
  name: string;
  /** Base URL the service is served from (e.g. "https://example.com") */
  baseUrl: string;
  /** Optional environment label */
  environment?: "development" | "staging" | "production";
}
