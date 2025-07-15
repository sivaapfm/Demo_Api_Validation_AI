import { defineConfig } from 'vitest/config'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables from .env files
config({ path: resolve(__dirname, '.env') })

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: true
      }
    },
    testTimeout: 10000,
    hookTimeout: 10000,
    isolate: false
  }
})
