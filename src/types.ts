export interface Parameter {
  name: string
  type: 'string' | 'number' | 'boolean' | 'array'
  required: boolean
  description?: string
  example?: any
  validation?: {
    min?: number
    max?: number
    pattern?: string
    enum?: any[]
  }
}

export interface ExpectedResponse {
  status: number
  contentType: string
  schema: {
    [key: string]: any
  }
}

export interface TestScenario {
  name: string
  description: string
  input: { [key: string]: any }
  expected: ExpectedResponse
  tags?: string[]
}

export interface Endpoint {
  name: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  url: string
  baseUrl?: string
  parameters: Parameter[]
  headers?: { [key: string]: string }
  authentication?: {
    type: 'api_key' | 'bearer' | 'basic'
    location?: 'header' | 'query' | 'body'
    name?: string
  }
  responses: ExpectedResponse[]
  testScenarios?: TestScenario[]
  rateLimit?: {
    requests: number
    per: 'second' | 'minute' | 'hour'
  }
}
