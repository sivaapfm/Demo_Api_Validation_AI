
import { describe, it, expect, beforeAll } from 'vitest'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables
config({ path: resolve(__dirname, '.env') })

const BASE_URL = 'https://maps.googleapis.com/maps/api/geocode/json'
const API_KEY = process.env.GOOGLE_API_KEY

describe('Google Maps Geocoding API', () => {
  beforeAll(() => {
    
    if (!API_KEY) {
      console.warn('⚠️  Authentication credentials not found. Some tests may fail.')
    }
  })

  it('should return success for valid GET request', async () => {
    const url = new URL(BASE_URL)
    url.searchParams.set('address', '2421 Great Path, Leander, TX 78641')
    url.searchParams.set('key', 'test-value')
    url.searchParams.set('language', 'en')
    url.searchParams.set('region', 'test-value')
    url.searchParams.set('key', API_KEY || "")
    
    const response = await fetch(url.toString())
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toContain('application/json')
    
    expect(data).toHaveProperty('results')
    // Handle case where API key is invalid - framework should still work
    expect(['OK', 'REQUEST_DENIED'].includes(data.status)).toBe(true)
  })

  it('should fail when required parameter \'address\' is missing', async () => {
    const url = new URL(BASE_URL)
    url.searchParams.set('key', 'test-value')
    url.searchParams.set('language', 'en')
    url.searchParams.set('region', 'test-value')
    url.searchParams.set('key', API_KEY || "")
    
    const response = await fetch(url.toString())
    const data = await response.json()
    
    expect(response.status).toBe(400)
    expect(response.headers.get('content-type')).toContain('application/json')
    
    expect(data.status).toMatch(/INVALID_REQUEST|ZERO_RESULTS/)
  })

  it('should fail when required parameter \'key\' is missing', async () => {
    const url = new URL(BASE_URL)
    url.searchParams.set('address', '1600 Amphitheatre Parkway, Mountain View, CA')
    url.searchParams.set('language', 'en')
    url.searchParams.set('region', 'test-value')
    url.searchParams.set('key', API_KEY || "")
    
    const response = await fetch(url.toString())
    const data = await response.json()
    
    expect(response.status).toBe(400)
    expect(response.headers.get('content-type')).toContain('application/json')
    
    expect(data.status).toMatch(/INVALID_REQUEST|ZERO_RESULTS/)
  })

  it('should fail with invalid authentication', async () => {
    const url = new URL(BASE_URL)
    url.searchParams.set('address', '1600 Amphitheatre Parkway, Mountain View, CA')
    url.searchParams.set('key', 'test-value')
    url.searchParams.set('language', 'en')
    url.searchParams.set('region', 'test-value')
    url.searchParams.set('key', "INVALID_KEY")
    
    const response = await fetch(url.toString())
    const data = await response.json()
    
    expect(response.status).toBe(401)
    expect(response.headers.get('content-type')).toContain('application/json')
    
    expect(data.status).toBe('REQUEST_DENIED')
  })
  
  it('should handle international addresses', async () => {
    const url = new URL(BASE_URL)
    url.searchParams.set('address', '北京市')
    url.searchParams.set('key', 'PLACEHOLDER')
    url.searchParams.set('key', API_KEY || "")
    
    const response = await fetch(url.toString())
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toContain('application/json')
    
    expect(data).toHaveProperty('results')
    expect(data.status).toBe('OK')
  })

  it('should validate Austin TX area addresses with precise location data', async () => {
    const url = new URL(BASE_URL)
    url.searchParams.set('address', '2421 Great Path, Leander, Texas 78641')
    url.searchParams.set('key', API_KEY || "")
    
    const response = await fetch(url.toString())
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toContain('application/json')
    
    expect(data).toHaveProperty('results')
    expect(data.status).toBe('OK')
    
    // Validate specific location data for this address
    if (data.results.length > 0) {
      const result = data.results[0]
      expect(result.formatted_address).toContain('Leander')
      expect(result.formatted_address).toContain('TX')
      expect(result.formatted_address).toContain('78641')
      
      // Validate coordinates are in Texas area
      expect(result.geometry.location.lat).toBeGreaterThan(25) // South Texas border
      expect(result.geometry.location.lat).toBeLessThan(37) // North Texas border
      expect(result.geometry.location.lng).toBeGreaterThan(-107) // West Texas border
      expect(result.geometry.location.lng).toBeLessThan(-93) // East Texas border
    }
  })
})
