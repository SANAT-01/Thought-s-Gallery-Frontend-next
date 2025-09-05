// API Types and Interfaces
export interface ApiThought {
  id: string
  user_id: string
  content: string
  likes: number
  dislikes: number
  created_at: string
}

export interface CreateThoughtRequest {
  user_id: string
  content: string
}

export interface CreateThoughtResponse {
  success: boolean
  status: number
  data: ApiThought
  message: string
}

export interface GetThoughtsResponse {
  success: boolean
  status: number
  data: ApiThought[]
  message: string
}

export interface ReactionRequest {
  thoughtId: string
  reaction: "like" | "dislike"
}

export interface ReactionResponse {
  thought: ApiThought
  success: boolean
  message?: string
}

export interface User {
  id: string
  username: string
  email: string
  created_at: string
}

export interface SignupRequest {
  username: string
  email: string
  password: string
}

export interface SigninRequest {
  username: string
  email: string
  password: string
}

export interface AuthResponse {
  success: boolean
  status: number
  data: {
    user: User
    authToken: string
  }
  message: string
}

export interface AuthError {
  success: false
  message: string
  code?: string
  details?: any
}

export type AuthApiResponse = AuthResponse | AuthError

export interface ApiError {
  success: false
  message: string
  code?: string
  details?: any
}

export type ApiResponse<T> = T | ApiError
