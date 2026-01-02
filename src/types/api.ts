/**
 * JSON:API response types for the dendrite-pulse backend.
 * @see https://jsonapi.org/format/
 */

/** Base structure for a JSON:API resource object */
export interface JsonApiResource<T extends string, A> {
  type: T
  id: string
  attributes: A
}

/** JSON:API response wrapper for a single resource */
export interface JsonApiResponse<T extends string, A> {
  data: JsonApiResource<T, A>
}

/** JSON:API response wrapper for a collection of resources */
export interface JsonApiCollectionResponse<T extends string, A> {
  data: JsonApiResource<T, A>[]
}

/** JSON:API error object */
export interface JsonApiError {
  status?: string
  code?: string
  title?: string
  detail?: string
}

/** JSON:API error response */
export interface JsonApiErrorResponse {
  errors: JsonApiError[]
}

// Domain-specific response types

export interface PingAttributes {
  message: string
}

export type PingResponse = JsonApiResponse<'ping', PingAttributes>

/**
 * Custom error class for API errors with structured information.
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly errors?: JsonApiError[],
  ) {
    super(message)
    this.name = 'ApiError'
  }
}
