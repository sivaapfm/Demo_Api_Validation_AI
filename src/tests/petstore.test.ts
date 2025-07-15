
import { describe, it, expect, beforeAll } from 'vitest'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables
config({ path: resolve(__dirname, '.env') })

const BASE_URL = 'https://petstore.swagger.io/v2'


describe('Find pet by ID', () => {
  beforeAll(() => {
    
  })

  it('should return success for valid GET request', async () => {
    const url = new URL(BASE_URL)
    url.searchParams.set('api_key', 'test-value')
    
    
    const response = await fetch(url.toString())
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toContain('application/json')
    
    expect(data).toHaveProperty('results')
    expect(data.status).toBe('OK')
  })

  it('should fail when required parameter 'petId' is missing', async () => {
    const url = new URL(BASE_URL)
    url.searchParams.set('api_key', 'test-value')
    
    
    const response = await fetch(url.toString())
    const data = await response.json()
    
    expect(response.status).toBe(400)
    expect(response.headers.get('content-type')).toContain('application/json')
    
    expect(data.status).toMatch(/INVALID_REQUEST|ZERO_RESULTS/)
  })
  
  
})
