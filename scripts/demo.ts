#!/usr/bin/env ts-node

/**
 * Demo: How to Auto-Generate Tests for Any API
 * 
 * This script demonstrates how to quickly set up automated testing
 * for any REST API using the API Test Framework.
 */

import { TestGenAgent } from '../src/agents/TestGenAgent'
import { Endpoint } from '../src/types'
import fs from 'fs'
import path from 'path'

// Example 1: Define a simple REST API manually
const weatherAPI: Endpoint = {
  name: 'OpenWeatherMap API',
  method: 'GET',
  url: 'https://api.openweathermap.org/data/2.5/weather',
  parameters: [
    {
      name: 'q',
      type: 'string',
      required: true,
      description: 'City name, state code and country code divided by comma',
      example: 'London,uk'
    },
    {
      name: 'appid',
      type: 'string',
      required: true,
      description: 'Your unique API key'
    },
    {
      name: 'units',
      type: 'string',
      required: false,
      description: 'Units of measurement',
      validation: {
        enum: ['standard', 'metric', 'imperial']
      }
    }
  ],
  authentication: {
    type: 'api_key',
    location: 'query',
    name: 'appid'
  },
  responses: [
    { status: 200, contentType: 'application/json', schema: {} },
    { status: 401, contentType: 'application/json', schema: {} },
    { status: 404, contentType: 'application/json', schema: {} }
  ]
}

// Example 2: Define a more complex API with custom scenarios
const userAPI: Endpoint = {
  name: 'User Management API',
  method: 'GET',
  url: 'https://jsonplaceholder.typicode.com/users',
  parameters: [
    {
      name: 'id',
      type: 'number',
      required: false,
      description: 'User ID to filter by',
      validation: { min: 1, max: 10 }
    },
    {
      name: 'email',
      type: 'string',
      required: false,
      description: 'Filter by email address',
      validation: {
        pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'
      }
    }
  ],
  responses: [
    { status: 200, contentType: 'application/json', schema: {} },
    { status: 400, contentType: 'application/json', schema: {} }
  ],
  testScenarios: [
    {
      name: 'should return specific user by ID',
      description: 'Test fetching a specific user by their ID',
      input: { id: 1 },
      expected: { status: 200, contentType: 'application/json', schema: {} },
      tags: ['specific-user']
    },
    {
      name: 'should handle invalid user ID gracefully',
      description: 'Test behavior with non-existent user ID',
      input: { id: 999 },
      expected: { status: 200, contentType: 'application/json', schema: {} },
      tags: ['edge-case']
    }
  ]
}

async function generateTestsForAPI(endpoint: Endpoint, filename: string) {
  console.log(`\n🔧 Generating tests for: ${endpoint.name}`)
  console.log(`📍 URL: ${endpoint.url}`)
  console.log(`📝 Parameters: ${endpoint.parameters.length}`)
  console.log(`🔐 Authentication: ${endpoint.authentication ? 'Yes' : 'No'}`)
  
  try {
    // Generate test code using the TestGenAgent
    const agent = new TestGenAgent(endpoint)
    const testCode = await agent.generate()
    
    // Save to file
    const testFilePath = path.resolve(__dirname, `../src/tests/${filename}.test.ts`)
    fs.writeFileSync(testFilePath, testCode, 'utf-8')
    
    console.log(`✅ Tests generated successfully!`)
    console.log(`📁 File: ${testFilePath}`)
    
    // Count test scenarios
    const scenarios = countTestScenarios(endpoint)
    console.log(`🧪 Generated ${scenarios} test scenarios:`)
    console.log('   • Happy path test')
    if (endpoint.parameters.some(p => p.required)) {
      console.log('   • Required parameter validation tests')
    }
    if (endpoint.authentication) {
      console.log('   • Authentication failure tests')
    }
    if (endpoint.parameters.some(p => p.validation)) {
      console.log('   • Parameter validation tests')
    }
    if (endpoint.testScenarios) {
      console.log(`   • ${endpoint.testScenarios.length} custom scenario(s)`)
    }
    
  } catch (error) {
    console.error(`❌ Error generating tests:`, error)
  }
}

function countTestScenarios(endpoint: Endpoint): number {
  let count = 1 // Happy path
  count += endpoint.parameters.filter(p => p.required).length
  if (endpoint.authentication) count += 1
  count += endpoint.parameters.filter(p => p.validation).length
  count += endpoint.testScenarios?.length || 0
  return count
}

async function demonstrateFramework() {
  console.log('🚀 API Test Framework Demo')
  console.log('============================')
  console.log('This demo shows how to auto-generate comprehensive test suites for any REST API.\n')
  
  // Generate tests for the weather API
  await generateTestsForAPI(weatherAPI, 'weather-demo')
  
  // Generate tests for the user API
  await generateTestsForAPI(userAPI, 'users-demo')
  
  console.log('\n🎯 What was generated?')
  console.log('Each test file includes:')
  console.log('• Vitest test suite with describe/it blocks')
  console.log('• Environment variable loading (.env support)')
  console.log('• HTTP requests using native fetch')
  console.log('• Response validation (status, content-type, data)')
  console.log('• Automatic parameter validation testing')
  console.log('• Authentication testing (if configured)')
  console.log('• Custom scenario testing')
  
  console.log('\n📋 Next Steps:')
  console.log('1. Add your API keys to .env file in the root directory')
  console.log('2. Run the tests: npm test')
  console.log('3. Customize test scenarios as needed')
  console.log('4. Import from OpenAPI specs: OpenAPIImporter.fromFile()')
  
  console.log('\n🔧 To add your own API:')
  console.log('1. Define an Endpoint object (see examples above)')
  console.log('2. Run: new TestGenAgent(endpoint).generate()')
  console.log('3. Save the generated test code to a .test.ts file')
  console.log('4. Execute with Vitest')
  
  console.log('\n✨ Framework Benefits:')
  console.log('• Zero manual test writing')
  console.log('• Comprehensive test coverage')
  console.log('• Type-safe TypeScript')
  console.log('• OpenAPI/Swagger import support')
  console.log('• Extensible and customizable')
  console.log('• Modern testing stack (Vitest + fetch)')
}

// Run the demo
if (require.main === module) {
  demonstrateFramework().catch(console.error)
}
