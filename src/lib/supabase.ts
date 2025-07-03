import { createClient } from '@supabase/supabase-js'

// Environment validation with detailed error messages
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'

// Check if we're in demo mode
const isDemoMode = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY || supabaseUrl.includes('demo')

// Comprehensive environment validation
function validateEnvironment() {
  if (isDemoMode) {
    console.warn('🎭 Demo Mode: Using mock Supabase configuration. Some features may not work.')
    return
  }

  const errors: string[] = []
  
  if (!supabaseUrl || supabaseUrl === 'https://demo.supabase.co') {
    errors.push('VITE_SUPABASE_URL is missing or using demo value')
  } else if (!supabaseUrl.startsWith('https://')) {
    errors.push('VITE_SUPABASE_URL must start with https://')
  }
  
  if (!supabaseAnonKey || supabaseAnonKey.includes('demo')) {
    errors.push('VITE_SUPABASE_ANON_KEY is missing or using demo value')
  } else if (supabaseAnonKey.length < 100) {
    errors.push('VITE_SUPABASE_ANON_KEY appears to be invalid (too short)')
  }
  
  if (errors.length > 0) {
    const errorMessage = `Supabase Configuration Warning:\n${errors.map(e => `  • ${e}`).join('\n')}\n\nThe app will run in demo mode with limited functionality.`
    console.warn(errorMessage)
  }
}

// Validate environment on module load
validateEnvironment()

// Create Supabase client with enhanced configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Connection health monitoring
class SupabaseHealthMonitor {
  private static instance: SupabaseHealthMonitor
  private isConnected: boolean = !isDemoMode
  private lastHealthCheck: Date = new Date()
  private healthCheckInterval: NodeJS.Timeout | null = null
  
  private constructor() {
    if (!isDemoMode) {
      this.startHealthChecks()
    }
  }
  
  static getInstance(): SupabaseHealthMonitor {
    if (!SupabaseHealthMonitor.instance) {
      SupabaseHealthMonitor.instance = new SupabaseHealthMonitor()
    }
    return SupabaseHealthMonitor.instance
  }
  
  private async performHealthCheck(): Promise<boolean> {
    if (isDemoMode) {
      this.isConnected = true
      this.lastHealthCheck = new Date()
      return true
    }

    try {
      // Simple query to test connection
      const { error } = await supabase
        .from('listings')
        .select('id')
        .limit(1)
      
      const isHealthy = !error
      this.isConnected = isHealthy
      this.lastHealthCheck = new Date()
      
      if (!isHealthy) {
        console.warn('Supabase health check failed:', error?.message)
      }
      
      return isHealthy
    } catch (error) {
      console.error('Supabase health check error:', error)
      this.isConnected = false
      return false
    }
  }
  
  private startHealthChecks() {
    // Initial health check
    this.performHealthCheck()
    
    // Set up periodic health checks (every 5 minutes)
    this.healthCheckInterval = setInterval(() => {
      this.performHealthCheck()
    }, 5 * 60 * 1000)
  }
  
  public getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      lastHealthCheck: this.lastHealthCheck,
      timeSinceLastCheck: Date.now() - this.lastHealthCheck.getTime()
    }
  }
  
  public async forceHealthCheck(): Promise<boolean> {
    return await this.performHealthCheck()
  }
  
  public stopHealthChecks() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval)
      this.healthCheckInterval = null
    }
  }
}

// Export health monitor
export const healthMonitor = SupabaseHealthMonitor.getInstance()

// Enhanced error handler for common Supabase errors
export class SupabaseErrorHandler {
  static handle(error: any, context?: string): string {
    if (!error) return 'Unknown error occurred'
    
    const contextPrefix = context ? `[${context}] ` : ''
    
    // Handle common Supabase errors with user-friendly messages
    if (error.message) {
      switch (error.message) {
        case 'Invalid login credentials':
          return `${contextPrefix}Invalid email or password. Please check your credentials and try again.`
        
        case 'Email not confirmed':
          return `${contextPrefix}Please check your email and click the confirmation link before signing in.`
        
        case 'Too many requests':
          return `${contextPrefix}Too many login attempts. Please wait a few minutes before trying again.`
        
        case 'User not found':
          return `${contextPrefix}No account found with this email address.`
        
        case 'Password should be at least 6 characters':
          return `${contextPrefix}Password must be at least 6 characters long.`
        
        case 'Unable to validate email address: invalid format':
          return `${contextPrefix}Please enter a valid email address.`
        
        case 'Database connection lost':
          return `${contextPrefix}Connection lost. Please check your internet connection and try again.`
        
        default:
          // Log the original error for debugging
          console.error(`${contextPrefix}Supabase Error:`, error)
          return `${contextPrefix}${error.message}`
      }
    }
    
    // Handle network errors
    if (error.name === 'NetworkError' || error.code === 'NETWORK_ERROR') {
      return `${contextPrefix}Network error. Please check your internet connection.`
    }
    
    // Handle timeout errors
    if (error.name === 'TimeoutError' || error.code === 'TIMEOUT') {
      return `${contextPrefix}Request timed out. Please try again.`
    }
    
    // Fallback
    console.error(`${contextPrefix}Unhandled Supabase Error:`, error)
    return `${contextPrefix}An unexpected error occurred. Please try again.`
  }
}

// Development helper to log connection info
if (import.meta.env.DEV) {
  console.log('🔗 Supabase Configuration:')
  console.log(`  • URL: ${supabaseUrl}`)
  console.log(`  • Key: ${supabaseAnonKey.substring(0, 20)}...`)
  console.log(`  • Health Monitor: Active`)
  
  // Log connection status updates in development
  setInterval(() => {
    const status = healthMonitor.getConnectionStatus()
    if (!status.isConnected) {
      console.warn('⚠️ Supabase connection issue detected')
    }
  }, 30000) // Check every 30 seconds in dev
} 