import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, Method } from 'axios';

export interface ApiResponse<T = any> {
  status: boolean;
  success?: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]> | null;
  status_code?: number;
}

export interface ApiErrorResponse {
  status: boolean;
  message: string;
  errors?: Record<string, string[]> | null;
  status_code: number;
  data?: any;
}

class ApiClient {
  private baseUrl: string;
  private timeout: number;
  private axiosInstance: AxiosInstance;

  constructor() {
    this.baseUrl = this.normalizeBaseUrl(
      process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
    );
    this.timeout = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30', 10) * 1000; // Convert to milliseconds

    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      timeout: this.timeout,
    });
  }

  /**
   * Normalize base URL by removing trailing slash
   */
  private normalizeBaseUrl(url: string): string {
    return url.replace(/\/+$/, '');
  }

  /**
   * Get auth headers from session storage
   */
  private getAuthHeaders(): Record<string, string> {
    // Try to get token from multiple sources
    let token = null;

    if (typeof window !== 'undefined') {
      // Check sessionStorage first (more secure than localStorage)
      token = sessionStorage.getItem('auth_token');
      
      // Fallback to localStorage if needed (but not recommended)
      if (!token) {
        token = localStorage.getItem('auth_token');
      }
    }

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Format successful response
   */
  private formatSuccessResponse<T>(response: AxiosResponse): ApiResponse<T> {
    const responseData = response.data || {};

    const isSuccess =
      typeof responseData.status === 'boolean'
        ? responseData.status
        : typeof responseData.success === 'boolean'
          ? responseData.success
          : true;

    return responseData.data || responseData;
  }

  /**
   * Format error response
   */
  private formatErrorResponse(error: AxiosError): ApiErrorResponse {
    const response = error.response;
    const responseData = response?.data as any || {};
    const statusCode = response?.status || 500;
    const isSuccess =
      typeof responseData.status === 'boolean'
        ? responseData.status
        : typeof responseData.success === 'boolean'
          ? responseData.success
          : false;
    
    // Handle validation errors (422)
    if (statusCode === 422 && responseData.errors) {
      return responseData;
    }
    
    // Handle unauthorized (401)
    if (statusCode === 401) {
      // Clear invalid token
      this.clearToken();
      
      return responseData || 'Unauthorized';
    }
    
    return responseData || {};
  }

  /**
   * Format exception response for network errors
   */
  private formatExceptionResponse(error: Error): ApiErrorResponse {
    return {
      status: false,
      status_code: 500,
      message: 'API connection error: ' + error.message,
      errors: null,
      data: null,
    };
  }

  /**
   * Extract error message from response
   */
  private getErrorMessage(error: AxiosError): string {
    const response = error.response;
    const responseData = response?.data as any;

    if (responseData?.message) {
      return responseData.message;
    }

    if (responseData?.error) {
      return responseData.error;
    }

    if (error.message) {
      return error.message;
    }

    return `API request failed with status: ${response?.status || 'unknown'}`;
  }

  /**
   * Clear token from storage
   */
  private clearToken(): void {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('auth_token');
      localStorage.removeItem('auth_token');
    }
  }

  /**
   * Set token in storage
   */
  setToken(token: string, remember: boolean = false): void {
    if (typeof window !== 'undefined') {
      if (remember) {
        localStorage.setItem('auth_token', token);
      } else {
        sessionStorage.setItem('auth_token', token);
      }
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    if (typeof window !== 'undefined') {
      return !!(sessionStorage.getItem('auth_token') || localStorage.getItem('auth_token'));
    }
    return false;
  }

  /**
   * Get current token
   */
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('auth_token') || localStorage.getItem('auth_token');
    }
    return null;
  }

  /**
   * Make HTTP request
   */
  async request<T = any>(
    method: string,
    endpoint: string,
    data: any = {},
    withAuth: boolean = true
  ): Promise<ApiResponse<T>> {
    // Clean endpoint
    endpoint = '/' + endpoint.replace(/^\/+/, '');
    const url = endpoint; // baseURL is already set in axios instance

    try {
      // Prepare request config
      const config: AxiosRequestConfig = {
        method: method as Method,
        url,
      };

      // Add headers if authentication is required
      if (withAuth) {
        config.headers = this.getAuthHeaders();
      }

      // Add data based on method
      if (method.toLowerCase() === 'get') {
        config.params = data;
      } else {
        config.data = data;
      }

      // Make the request
      const response = await this.axiosInstance.request<T>(config);
      
      return this.formatSuccessResponse<T>(response);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return this.formatErrorResponse(error);
      }
      return this.formatExceptionResponse(error as Error);
    }
  }

  // Convenience methods
  async get<T = any>(endpoint: string, params: any = {}, withAuth: boolean = true): Promise<ApiResponse<T>> {
    return this.request<T>('get', endpoint, params, withAuth);
  }

  async post<T = any>(endpoint: string, data: any = {}, withAuth: boolean = true): Promise<ApiResponse<T>> {
    return this.request<T>('post', endpoint, data, withAuth);
  }

  async put<T = any>(endpoint: string, data: any = {}, withAuth: boolean = true): Promise<ApiResponse<T>> {
    return this.request<T>('put', endpoint, data, withAuth);
  }

  async delete<T = any>(endpoint: string, data: any = {}, withAuth: boolean = true): Promise<ApiResponse<T>> {
    return this.request<T>('delete', endpoint, data, withAuth);
  }

  async patch<T = any>(endpoint: string, data: any = {}, withAuth: boolean = true): Promise<ApiResponse<T>> {
    return this.request<T>('patch', endpoint, data, withAuth);
  }
}

// Export a singleton instance
export const apiClient = new ApiClient();
export default apiClient;
