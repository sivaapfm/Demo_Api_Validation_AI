import { Endpoint, Parameter, TestScenario } from '../types'

export function generateTestCases(endpoint: Endpoint): string {
  const testCases = generateAutomaticTestCases(endpoint)
  const customScenarios = endpoint.testScenarios || []
  
  return `
import { describe, it, expect, beforeAll } from 'vitest'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables
config({ path: resolve(__dirname, '.env') })

const BASE_URL = '${endpoint.baseUrl || endpoint.url}'
${generateAuthConstants(endpoint)}

describe('${endpoint.name}', () => {
  beforeAll(() => {
    ${generateSetupCode(endpoint)}
  })

  ${testCases.map(scenario => generateTestCase(endpoint, scenario)).join('\n\n  ')}
  
  ${customScenarios.map(scenario => generateCustomTestCase(endpoint, scenario)).join('\n\n  ')}
})
`
}

function generateAuthConstants(endpoint: Endpoint): string {
  if (!endpoint.authentication) return ''
  
  switch (endpoint.authentication.type) {
    case 'api_key':
      return `const API_KEY = process.env.${endpoint.authentication.name?.toUpperCase() || 'API_KEY'}`
    case 'bearer':
      return `const BEARER_TOKEN = process.env.BEARER_TOKEN`
    case 'basic':
      return `const USERNAME = process.env.USERNAME\nconst PASSWORD = process.env.PASSWORD`
    default:
      return ''
  }
}

function generateSetupCode(endpoint: Endpoint): string {
  if (!endpoint.authentication) return ''
  
  const authVar = endpoint.authentication.type === 'api_key' ? 'API_KEY' : 
                  endpoint.authentication.type === 'bearer' ? 'BEARER_TOKEN' : 'USERNAME'
  
  return `
    if (!${authVar}) {
      console.warn('⚠️  Authentication credentials not found. Some tests may fail.')
    }`
}

function generateAutomaticTestCases(endpoint: Endpoint): TestScenario[] {
  const scenarios: TestScenario[] = []
  
  // 1. Happy path test
  scenarios.push({
    name: `should return success for valid ${endpoint.method} request`,
    description: 'Tests the main success path with valid parameters',
    input: generateValidInput(endpoint.parameters),
    expected: { status: 200, contentType: 'application/json', schema: {} },
    tags: ['happy-path']
  })
  
  // 2. Required parameter validation tests
  endpoint.parameters
    .filter(param => param.required)
    .forEach(param => {
      scenarios.push({
        name: `should fail when required parameter '${param.name}' is missing`,
        description: `Tests validation for missing required parameter`,
        input: generateInputWithoutParam(endpoint.parameters, param.name),
        expected: { status: 400, contentType: 'application/json', schema: {} },
        tags: ['validation', 'required-params']
      })
    })
  
  // 3. Authentication tests
  if (endpoint.authentication) {
    scenarios.push({
      name: 'should fail with invalid authentication',
      description: 'Tests authentication failure scenarios',
      input: generateValidInput(endpoint.parameters),
      expected: { status: 401, contentType: 'application/json', schema: {} },
      tags: ['authentication']
    })
  }
  
  return scenarios
}

function generateValidInput(parameters: Parameter[]): { [key: string]: any } {
  const input: { [key: string]: any } = {}
  
  parameters.forEach(param => {
    if (param.example !== undefined) {
      input[param.name] = param.example
    } else {
      switch (param.type) {
        case 'string':
          input[param.name] = param.validation?.enum?.[0] || 'test-value'
          break
        case 'number':
          input[param.name] = param.validation?.min || 1
          break
        case 'boolean':
          input[param.name] = true
          break
        case 'array':
          input[param.name] = ['test-item']
          break
      }
    }
  })
  
  return input
}

function generateInputWithoutParam(parameters: Parameter[], excludeParam: string): { [key: string]: any } {
  const input = generateValidInput(parameters)
  delete input[excludeParam]
  return input
}

function generateTestCase(endpoint: Endpoint, scenario: TestScenario): string {
  const requestParams = generateRequestParams(endpoint, scenario.input, scenario.tags?.includes('authentication') ? 'invalid' : 'valid')
  
  return `it('${scenario.name.replace(/'/g, "\\'")}', async () => {
    ${requestParams}
    
    const response = await fetch(url.toString())
    const data = await response.json()
    
    expect(response.status).toBe(${scenario.expected.status})
    expect(response.headers.get('content-type')).toContain('${scenario.expected.contentType}')
    
    ${generateAssertions(scenario)}
  })`
}

function generateCustomTestCase(endpoint: Endpoint, scenario: TestScenario): string {
  return generateTestCase(endpoint, scenario)
}

function generateRequestParams(endpoint: Endpoint, input: { [key: string]: any }, authType: 'valid' | 'invalid'): string {
  const urlConstruction = `const url = new URL(BASE_URL)`
  const paramsSetting = Object.entries(input)
    .map(([key, value]) => `url.searchParams.set('${key}', '${value}')`)
    .join('\n    ')
  
  let authSetting = ''
  if (endpoint.authentication && endpoint.authentication.location === 'query') {
    const authValue = authType === 'valid' ? 'API_KEY || ""' : '"INVALID_KEY"'
    authSetting = `url.searchParams.set('${endpoint.authentication.name}', ${authValue})`
  }
  
  return `${urlConstruction}
    ${paramsSetting}
    ${authSetting}`
}

function generateAssertions(scenario: TestScenario): string {
  let assertions = ''
  
  if (scenario.expected.status === 200) {
    assertions = `expect(data).toHaveProperty('results')
    expect(data.status).toBe('OK')`
  } else if (scenario.expected.status === 400) {
    assertions = `expect(data.status).toMatch(/INVALID_REQUEST|ZERO_RESULTS/)`
  } else if (scenario.expected.status === 401) {
    assertions = `expect(data.status).toBe('REQUEST_DENIED')`
  }
  
  return assertions
}
