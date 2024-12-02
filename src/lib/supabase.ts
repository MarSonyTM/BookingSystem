import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database.types'

const supabaseUrl = 'https://mjaocasztagoewdovbhn.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qYW9jYXN6dGFnb2V3ZG92YmhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMwODU1MzEsImV4cCI6MjA0ODY2MTUzMX0.C1zGSu5k1ZoN6n8LY96rUzOvYIN8Lbjqn7aluAViYbs'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
}) 