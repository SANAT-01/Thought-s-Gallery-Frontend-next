// Environment Variables Example
// Copy this to your .env.local file and update the values

/*
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://your-backend-api.com/api

# Optional: Authentication (if your backend requires it)
NEXT_PUBLIC_AUTH_ENABLED=true
NEXT_PUBLIC_AUTH_PROVIDER=custom

# Optional: Feature flags
NEXT_PUBLIC_COMMENTS_ENABLED=false
NEXT_PUBLIC_SHARE_ENABLED=true
*/

export const ENV_CONFIG = {
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://your-backend-api.com/api",
  AUTH_ENABLED: process.env.NEXT_PUBLIC_AUTH_ENABLED === "true",
  COMMENTS_ENABLED: process.env.NEXT_PUBLIC_COMMENTS_ENABLED === "true",
  SHARE_ENABLED: process.env.NEXT_PUBLIC_SHARE_ENABLED !== "false",
} as const
