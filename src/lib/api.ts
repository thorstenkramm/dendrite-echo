/**
 * API client for communicating with the dendrite-pulse backend.
 *
 * This module provides a thin wrapper around fetch with:
 * - Automatic JSON parsing
 * - Error handling with typed ApiError
 * - Request/response interceptor pattern via hooks
 * - TypeScript generics for type-safe responses
 */

import { ApiError, type JsonApiErrorResponse } from '@/types/api'

/** Configuration for the API client */
export interface ApiConfig {
  baseUrl: string
  defaultHeaders?: Record<string, string>
}

/** Options for individual requests */
export interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
}

/** Hook called before each request */
type RequestInterceptor = (url: string, options: RequestInit) => RequestInit | Promise<RequestInit>

/** Hook called after each response */
type ResponseInterceptor = (response: Response) => Response | Promise<Response>

// Default configuration
const config: ApiConfig = {
  baseUrl: '/api/v1',
  defaultHeaders: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
}

// Interceptor registries
const requestInterceptors: RequestInterceptor[] = []
const responseInterceptors: ResponseInterceptor[] = []

/**
 * Register a request interceptor.
 * Interceptors are called in order before each request.
 */
export function onRequest(interceptor: RequestInterceptor): () => void {
  requestInterceptors.push(interceptor)
  return () => {
    const index = requestInterceptors.indexOf(interceptor)
    if (index > -1) requestInterceptors.splice(index, 1)
  }
}

/**
 * Register a response interceptor.
 * Interceptors are called in order after each response.
 */
export function onResponse(interceptor: ResponseInterceptor): () => void {
  responseInterceptors.push(interceptor)
  return () => {
    const index = responseInterceptors.indexOf(interceptor)
    if (index > -1) responseInterceptors.splice(index, 1)
  }
}

/**
 * Build the full URL for a request.
 */
function buildUrl(path: string): string {
  const base = config.baseUrl.replace(/\/$/, '')
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${base}${cleanPath}`
}

/**
 * Parse error response body into ApiError.
 */
async function parseErrorResponse(response: Response): Promise<ApiError> {
  const contentType = response.headers.get('content-type') ?? ''

  if (contentType.includes('application/json')) {
    try {
      const body = await response.json() as JsonApiErrorResponse
      const firstError = body.errors?.[0]
      const message = firstError?.detail ?? firstError?.title ?? response.statusText
      return new ApiError(message, response.status, body.errors)
    } catch {
      // JSON parsing failed, fall through to text handling
    }
  }

  const text = await response.text()
  return new ApiError(text || response.statusText, response.status)
}

/**
 * Core request function with interceptor support.
 */
async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = buildUrl(path)

  // Extract body from options to handle separately
  const { body, ...restOptions } = options

  // Build initial request options
  let fetchOptions: RequestInit = {
    ...restOptions,
    headers: {
      ...config.defaultHeaders,
      ...options.headers,
    },
  }

  // Serialize body if present
  if (body !== undefined) {
    fetchOptions.body = JSON.stringify(body)
  }

  // Run request interceptors
  for (const interceptor of requestInterceptors) {
    fetchOptions = await interceptor(url, fetchOptions)
  }

  // Execute request
  let response = await fetch(url, fetchOptions)

  // Run response interceptors
  for (const interceptor of responseInterceptors) {
    response = await interceptor(response)
  }

  // Handle error responses
  if (!response.ok) {
    throw await parseErrorResponse(response)
  }

  // Handle empty responses
  const contentLength = response.headers.get('content-length')
  if (response.status === 204 || contentLength === '0') {
    return undefined as T
  }

  // Parse JSON response
  return response.json() as Promise<T>
}

/**
 * HTTP GET request.
 */
export function get<T>(path: string, options?: RequestOptions): Promise<T> {
  return request<T>(path, { ...options, method: 'GET' })
}

/**
 * HTTP POST request.
 */
export function post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
  return request<T>(path, { ...options, method: 'POST', body })
}

/**
 * HTTP PUT request.
 */
export function put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
  return request<T>(path, { ...options, method: 'PUT', body })
}

/**
 * HTTP PATCH request.
 */
export function patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
  return request<T>(path, { ...options, method: 'PATCH', body })
}

/**
 * HTTP DELETE request.
 */
export function del<T>(path: string, options?: RequestOptions): Promise<T> {
  return request<T>(path, { ...options, method: 'DELETE' })
}

/** Grouped API methods for convenient importing */
export const api = {
  get,
  post,
  put,
  patch,
  del,
  onRequest,
  onResponse,
}
