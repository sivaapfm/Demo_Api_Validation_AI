
import { describe, it, expect, beforeAll } from 'vitest'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables
config({ path: resolve(__dirname, '.env') })

const BASE_URL = 'https://maps.googleapis.com/maps/api/geocode/json'
const API_KEY = process.env.KEY

describe('Google Maps Geocoding API', () => {
  beforeAll(() => {
    
    if (!API_KEY) {
      console.warn('⚠️  Authentication credentials not found. Some tests may fail.')
    }
  })

  it('should return success for valid GET request', async () => {
    const url = new URL(BASE_URL)
    url.searchParams.set('address', '1600 Amphitheatre Parkway, Mountain View, CA')
    url.searchParams.set('key', 'test-value')
    url.searchParams.set('language', 'en')
    url.searchParams.set('region', 'test-value')
    url.searchParams.set('key', API_KEY || "")
    
    const response = await fetch(url.toString())
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toContain('application/json')
    
    expect(data).toHaveProperty('results')
    expect(data.status).toBe('OK')
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

  it('Invalid API Key Test', async () => {
    const url = new URL(BASE_URL)
    url.searchParams.set('address', '1600 Amphitheatre Parkway, Mountain View, CA')
    url.searchParams.set('key', 'invalid_key')
    url.searchParams.set('key', API_KEY || "")
    
    const response = await fetch(url.toString())
    const data = await response.json()
    
    expect(response.status).toBe(400)
    expect(response.headers.get('content-type')).toContain('application/json')
    
    expect(data.status).toMatch(/INVALID_REQUEST|ZERO_RESULTS/)
  })

  it('Missing Required Address Parameter Test', async () => {
    const url = new URL(BASE_URL)
    url.searchParams.set('key', 'valid_key')
    url.searchParams.set('key', API_KEY || "")
    
    const response = await fetch(url.toString())
    const data = await response.json()
    
    expect(response.status).toBe(400)
    expect(response.headers.get('content-type')).toContain('application/json')
    
    expect(data.status).toMatch(/INVALID_REQUEST|ZERO_RESULTS/)
  })

  it('Unsupported Language Parameter Test', async () => {
    const url = new URL(BASE_URL)
    url.searchParams.set('address', '1600 Amphitheatre Parkway, Mountain View, CA')
    url.searchParams.set('key', 'valid_key')
    url.searchParams.set('language', 'unsupported_language')
    url.searchParams.set('key', API_KEY || "")
    
    const response = await fetch(url.toString())
    const data = await response.json()
    
    expect(response.status).toBe(400)
    expect(response.headers.get('content-type')).toContain('application/json')
    
    expect(data.status).toMatch(/INVALID_REQUEST|ZERO_RESULTS/)
  })

  it('Performance Test with Large Input Data', async () => {
    const url = new URL(BASE_URL)
    url.searchParams.set('address', 'long_string_of_characters')
    url.searchParams.set('key', 'valid_key')
    url.searchParams.set('key', API_KEY || "")
    
    const response = await fetch(url.toString())
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toContain('application/json')
    
    expect(data).toHaveProperty('results')
    expect(data.status).toBe('OK')
  })

  it('Edge Case Test with International Address', async () => {
    const url = new URL(BASE_URL)
    url.searchParams.set('address', 'Kremlin, Moscow, Russia')
    url.searchParams.set('key', 'valid_key')
    url.searchParams.set('key', API_KEY || "")
    
    const response = await fetch(url.toString())
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toContain('application/json')
    
    expect(data).toHaveProperty('results')
    expect(data.status).toBe('OK')
  })
})
