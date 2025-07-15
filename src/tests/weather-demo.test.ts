
import { describe, it, expect, beforeAll } from 'vitest'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables
config({ path: resolve(__dirname, '.env') })

const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'
const API_KEY = process.env.APPID

describe('OpenWeatherMap API', () => {
  beforeAll(() => {
    
    if (!API_KEY) {
      console.warn('⚠️  Authentication credentials not found. Some tests may fail.')
    }
  })

  it('should return success for valid GET request', async () => {
    const url = new URL(BASE_URL)
    url.searchParams.set('q', 'London,uk')
    url.searchParams.set('appid', 'test-value')
    url.searchParams.set('units', 'standard')
    url.searchParams.set('appid', API_KEY || "")
    
    const response = await fetch(url.toString())
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toContain('application/json')
    
    expect(data).toHaveProperty('results')
    expect(data.status).toBe('OK')
  })

  it('should fail when required parameter \'q\' is missing', async () => {
    const url = new URL(BASE_URL)
    url.searchParams.set('appid', 'test-value')
    url.searchParams.set('units', 'standard')
    url.searchParams.set('appid', API_KEY || "")
    
    const response = await fetch(url.toString())
    const data = await response.json()
    
    expect(response.status).toBe(400)
    expect(response.headers.get('content-type')).toContain('application/json')
    
    expect(data.status).toMatch(/INVALID_REQUEST|ZERO_RESULTS/)
  })

  it('should fail when required parameter \'appid\' is missing', async () => {
    const url = new URL(BASE_URL)
    url.searchParams.set('q', 'London,uk')
    url.searchParams.set('units', 'standard')
    url.searchParams.set('appid', API_KEY || "")
    
    const response = await fetch(url.toString())
    const data = await response.json()
    
    expect(response.status).toBe(400)
    expect(response.headers.get('content-type')).toContain('application/json')
    
    expect(data.status).toMatch(/INVALID_REQUEST|ZERO_RESULTS/)
  })

  it('should fail with invalid authentication', async () => {
    const url = new URL(BASE_URL)
    url.searchParams.set('q', 'London,uk')
    url.searchParams.set('appid', 'test-value')
    url.searchParams.set('units', 'standard')
    url.searchParams.set('appid', "INVALID_KEY")
    
    const response = await fetch(url.toString())
    const data = await response.json()
    
    expect(response.status).toBe(401)
    expect(response.headers.get('content-type')).toContain('application/json')
    
    expect(data.status).toBe('REQUEST_DENIED')
  })
  
  
})
