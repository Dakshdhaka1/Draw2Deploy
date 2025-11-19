export const API_BASE = 'http://localhost:9000'

export type ApiResponse<T> = {
  data: T
  message: string
  status: string
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  body?: BodyInit
  timeout?: number
}

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('d2d_token')
  const headers: Record<string, string> = {}
  
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  
  return headers
}

const createAbortController = (timeout: number): AbortController => {
  const controller = new AbortController()
  setTimeout(() => controller.abort(), timeout)
  return controller
}

const api = async <T = unknown>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> => {
  const { method = 'GET', headers = {}, body, timeout = 15_000 } = options

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`
  
  const authHeaders = getAuthHeaders()
  const defaultHeaders: Record<string, string> = {}
  
  // Only set Content-Type for JSON, not for FormData
  // Browser will automatically set Content-Type for FormData with boundary
  if (body && !(body instanceof FormData) && typeof body !== 'string') {
    defaultHeaders['Content-Type'] = 'application/json'
  }

  const controller = createAbortController(timeout)

  try {
    // Build headers object - IMPORTANT: Auth headers must be included for all requests
    const allHeaders: Record<string, string> = {}
    
    // Add default headers first
    Object.assign(allHeaders, defaultHeaders)
    
    // Add auth headers (JWT token) - this applies to ALL requests including POST
    Object.assign(allHeaders, authHeaders)
    
    // Add custom headers last (can override defaults but not auth)
    Object.assign(allHeaders, headers)
    
    // Ensure Authorization header is never removed
    if (authHeaders.Authorization && !allHeaders.Authorization) {
      allHeaders.Authorization = authHeaders.Authorization
    }
    
    // Remove undefined/null/empty values
    const cleanedHeaders: Record<string, string> = {}
    for (const [key, value] of Object.entries(allHeaders)) {
      if (value !== undefined && value !== null && value !== '') {
        cleanedHeaders[key] = String(value)
      }
    }

    // Prepare body
    let requestBody: BodyInit | undefined
    if (body instanceof FormData) {
      requestBody = body
      // Don't set Content-Type for FormData - browser will set it with boundary
      // BUT preserve Authorization header for JWT
      const authHeader = cleanedHeaders['Authorization']
      delete cleanedHeaders['Content-Type']
      if (authHeader) {
        cleanedHeaders['Authorization'] = authHeader
      }
    } else if (body) {
      requestBody = JSON.stringify(body)
    }

    const fetchOptions: RequestInit = {
      method,
      headers: cleanedHeaders,
      body: requestBody,
      signal: controller.signal,
      mode: 'cors',
      credentials: 'omit',
      cache: 'no-cache',
    }

    // Debug logging
    if (import.meta.env.DEV) {
      const hasToken = !!cleanedHeaders.Authorization
      console.log('🔵 API Request:', {
        url,
        method,
        headers: cleanedHeaders,
        hasBody: !!requestBody,
        hasJWT: hasToken,
        jwtPreview: hasToken ? cleanedHeaders.Authorization.substring(0, 20) + '...' : 'none',
      })
    }

    const response = await fetch(url, fetchOptions)

    // Debug logging for response
    if (import.meta.env.DEV) {
      console.log('🟢 API Response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries()),
      })
    }

    let responseData: unknown
    const contentType = response.headers.get('content-type')
    
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json()
    } else {
      responseData = await response.text()
    }

    if (!response.ok) {
      const errorMessage =
        (responseData as ApiResponse<unknown>)?.message ??
        (responseData as { message?: string })?.message ??
        `HTTP ${response.status}: ${response.statusText}`

      throw createApiError(errorMessage, response.status, responseData)
    }

    return responseData as ApiResponse<T>
  } catch (error) {
    const apiError = error as ApiError
    if (apiError.name === 'ApiError' && apiError.status) {
      throw error
    }
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out. Please check your connection and try again.')
      }
      // Check for network/CORS errors
      const isNetworkError = 
        error.message.includes('Failed to fetch') || 
        error.message.includes('NetworkError') ||
        error.message.includes('Network request failed') ||
        error.name === 'TypeError'
      
      const isCorsError = 
        error.message.includes('CORS') ||
        error.message.includes('cors') ||
        error.message.includes('Access-Control')
      
      if (isNetworkError || isCorsError) {
        console.error('❌ Network/CORS Error:', error)
        throw new Error(`Cannot connect to backend at ${API_BASE}. Make sure:
1. Backend is running on http://localhost:9000
2. Backend CORS is configured correctly
3. No firewall is blocking the connection`)
      }
      throw error
    }
    
    throw new Error('Unexpected error occurred')
  }
}

type ApiError = Error & {
  status: number
  data?: unknown
}

const createApiError = (message: string, status: number, data?: unknown): ApiError => {
  const error = new Error(message) as ApiError
  error.status = status
  error.data = data
  error.name = 'ApiError'
  return error
}

export const getApiErrorMessage = (error: unknown): string => {
  const apiError = error as ApiError
  if (apiError.name === 'ApiError' && apiError.status) {
    // Handle HTTP status codes
    if (apiError.status === 401) {
      return 'Authentication failed. Please log in again.'
    }
    if (apiError.status === 403) {
      return 'Access denied. Please verify your email first.'
    }
    if (apiError.status === 404) {
      return 'Endpoint not found. Please check the API URL.'
    }
    if (apiError.status >= 500) {
      return 'Server error. Please try again later.'
    }
    return apiError.message
  }
  
  if (error instanceof Error) {
    return error.message
  }
  
  return 'Unexpected error'
}

// Convenience methods
export const apiGet = <T = unknown>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
  api<T>(endpoint, { ...options, method: 'GET' })

export const apiPost = <T = unknown>(
  endpoint: string,
  body?: unknown,
  options?: Omit<RequestOptions, 'method' | 'body'>
) => api<T>(endpoint, { ...options, method: 'POST', body: body as BodyInit })

export const apiPut = <T = unknown>(
  endpoint: string,
  body?: unknown,
  options?: Omit<RequestOptions, 'method' | 'body'>
) => api<T>(endpoint, { ...options, method: 'PUT', body: body as BodyInit })

export const apiDelete = <T = unknown>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
  api<T>(endpoint, { ...options, method: 'DELETE' })

export default api

