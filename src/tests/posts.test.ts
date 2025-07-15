
import { describe, it, expect, beforeAll } from 'vitest'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables
config({ path: resolve(__dirname, '.env') })

const BASE_URL = 'https://jsonplaceholder.typicode.com/posts'


describe('JSONPlaceholder Posts API', () => {
  beforeAll(() => {
    
  })

  it('should return success for valid GET request', async () => {
    const url = new URL(BASE_URL)
    url.searchParams.set('userId', '1')
    url.searchParams.set('_limit', '1')
    
    
    const response = await fetch(url.toString())
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toContain('application/json')
    
    // JSONPlaceholder returns an array of posts
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBeGreaterThan(0)
    expect(data[0]).toHaveProperty('userId')
    expect(data[0]).toHaveProperty('id')
    expect(data[0]).toHaveProperty('title')
  })
  
  
})
