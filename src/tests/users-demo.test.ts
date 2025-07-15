
import { describe, it, expect, beforeAll } from 'vitest'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables
config({ path: resolve(__dirname, '.env') })

const BASE_URL = 'https://jsonplaceholder.typicode.com/users'


describe('User Management API', () => {
  beforeAll(() => {
    
  })

  it('should return success for valid GET request', async () => {
    const url = new URL(BASE_URL)
    url.searchParams.set('id', '1')
    url.searchParams.set('email', 'test-value')
    
    
    const response = await fetch(url.toString())
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toContain('application/json')
    
    expect(data).toHaveProperty('results')
    expect(data.status).toBe('OK')
  })
  
  it('should return specific user by ID', async () => {
    const url = new URL(BASE_URL)
    url.searchParams.set('id', '1')
    
    
    const response = await fetch(url.toString())
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toContain('application/json')
    
    expect(data).toHaveProperty('results')
    expect(data.status).toBe('OK')
  })

  it('should handle invalid user ID gracefully', async () => {
    const url = new URL(BASE_URL)
    url.searchParams.set('id', '999')
    
    
    const response = await fetch(url.toString())
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toContain('application/json')
    
    expect(data).toHaveProperty('results')
    expect(data.status).toBe('OK')
  })
})
