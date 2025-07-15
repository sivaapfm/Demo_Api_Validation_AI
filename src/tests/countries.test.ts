
import { describe, it, expect, beforeAll } from 'vitest'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables
config({ path: resolve(__dirname, '.env') })

const BASE_URL = 'https://restcountries.com/v3.1/name/united states'


describe('REST Countries API', () => {
  beforeAll(() => {
    
  })

  it('should return success for valid GET request', async () => {
    const url = new URL(BASE_URL)
    url.searchParams.set('fullText', 'true')
    
    
    const response = await fetch(url.toString())
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toContain('application/json')
    
    // REST Countries returns an array of countries
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBeGreaterThan(0)
    expect(data[0]).toHaveProperty('name')
    expect(data[0].name).toHaveProperty('common')
  })

  it('should fail when required parameter \'name\' is missing', async () => {
    const url = new URL(BASE_URL)
    url.searchParams.set('fullText', 'true')
    
    
    const response = await fetch(url.toString())
    const data = await response.json()
    
    expect(response.status).toBe(400)
    expect(response.headers.get('content-type')).toContain('application/json')
    
    expect(data.status).toMatch(/INVALID_REQUEST|ZERO_RESULTS/)
  })
  
  
})
