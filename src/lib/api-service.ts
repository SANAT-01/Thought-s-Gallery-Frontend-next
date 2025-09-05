import type {
  CreateThoughtRequest,
  CreateThoughtResponse,
  GetThoughtsResponse,
  ReactionResponse,
  ApiResponse,
  SignupRequest,
  SigninRequest,
  AuthApiResponse,
} from "./api-types"

// Configuration - Update these with your backend URLs
const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://thought-s-gallery-backend-db.vercel.app",
  TIMEOUT: 10000, // 10 seconds
}

class ApiService {
  private baseUrl: string
  private timeout: number
  private authToken: string | null = null

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL
    this.timeout = API_CONFIG.TIMEOUT
    if (typeof window !== "undefined") {
      this.authToken = localStorage.getItem("authToken")
    }
  }

  setAuthToken(token: string | null) {
    this.authToken = token
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("authToken", token)
      } else {
        localStorage.removeItem("authToken")
      }
    }
  }

  getAuthToken(): string | null {
    return this.authToken
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          ...(this.authToken && { Authorization: `Bearer ${this.authToken}` }),
          ...options.headers,
        },
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return {
          success: false,
          message: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          code: errorData.code || response.status.toString(),
          details: errorData,
        }
      }

      const data = await response.json()
      return data
    } catch (error) {
      clearTimeout(timeoutId)

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          return {
            success: false,
            message: "Request timeout - please check your connection",
            code: "TIMEOUT",
          }
        }
        return {
          success: false,
          message: error.message || "Network error occurred",
          code: "NETWORK_ERROR",
        }
      }

      return {
        success: false,
        message: "An unexpected error occurred",
        code: "UNKNOWN_ERROR",
      }
    }
  }

  async signup(data: SignupRequest): Promise<AuthApiResponse> {
    return this.request<AuthApiResponse>("/signup", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async signin(data: SigninRequest): Promise<AuthApiResponse> {
    return this.request<AuthApiResponse>("/signin", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async signout(): Promise<void> {
    this.setAuthToken(null)
  }

  // Thoughts API
  async getThoughts(page = 1, limit = 10): Promise<GetThoughtsResponse> {
    return this.request<GetThoughtsResponse>(`/api/thoughts?page=${page}&limit=${limit}`)
  }

  async createThought(data: CreateThoughtRequest): Promise<CreateThoughtResponse> {
    return this.request<CreateThoughtResponse>("/api/thought", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async deleteThought(thoughtId: string): Promise<ApiResponse<{ success: boolean; message: string }>> {
    return this.request(`/api/thoughts/${thoughtId}`, {
      method: "DELETE",
    })
  }

  // Reactions API
  async likeThought(thoughtId: string): Promise<ApiResponse<ReactionResponse>> {
    return this.request<ReactionResponse>(`/api/thoughts/${thoughtId}/like`, {
      method: "POST",
    })
  }

  async dislikeThought(thoughtId: string): Promise<ApiResponse<ReactionResponse>> {
    return this.request<ReactionResponse>(`/api/thoughts/${thoughtId}/dislike`, {
      method: "POST",
    })
  }

  async removeReaction(thoughtId: string): Promise<ApiResponse<ReactionResponse>> {
    return this.request<ReactionResponse>(`/api/thoughts/${thoughtId}/reaction`, {
      method: "DELETE",
    })
  }

  // Comments API (placeholder for future implementation)
  async getComments(thoughtId: string): Promise<ApiResponse<any>> {
    return this.request(`/api/thoughts/${thoughtId}/comments`)
  }

  async createComment(thoughtId: string, content: string): Promise<ApiResponse<any>> {
    return this.request(`/api/thoughts/${thoughtId}/comments`, {
      method: "POST",
      body: JSON.stringify({ content }),
    })
  }

  // User API (placeholder for future implementation)
  async getCurrentUser(): Promise<ApiResponse<any>> {
    return this.request("/api/user/me")
  }

  async getUserProfile(userId: string): Promise<ApiResponse<any>> {
    return this.request(`/api/users/${userId}`)
  }
}

// Export singleton instance
export const apiService = new ApiService()

// Helper function to check if response is an error
export function isApiError<T>(
  response: ApiResponse<T>,
): response is { success: false; message: string; code?: string; details?: any } {
  return "success" in response && response.success === false
}

// Helper function to format timestamps
export function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return "just now"
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} hour${hours > 1 ? "s" : ""} ago`
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} day${days > 1 ? "s" : ""} ago`
  } else {
    return date.toLocaleDateString()
  }
}
