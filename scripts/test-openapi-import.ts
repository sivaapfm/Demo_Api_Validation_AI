#!/usr/bin/env ts-node
import { OpenAPIImporter } from '../src/utils/openAPIImporter'
import { TestGenAgent } from '../src/agents/TestGenAgent'
import fs from 'fs'
import path from 'path'

async function testOpenAPIImport() {
  console.log('🔍 Testing OpenAPI Import...\n')
  
  try {
    // Import endpoints from OpenAPI spec
    const endpoints = OpenAPIImporter.fromFile('./examples/petstore.yaml')
    
    console.log(`📋 Found ${endpoints.length} endpoints:`)
    endpoints.forEach((endpoint, index) => {
      console.log(`  ${index + 1}. ${endpoint.method} ${endpoint.name}`)
      console.log(`     URL: ${endpoint.url}`)
      console.log(`     Parameters: ${endpoint.parameters.length}`)
      console.log(`     Auth: ${endpoint.authentication ? 'Yes' : 'No'}`)
      console.log('')
    })
    
    // Generate tests for the first endpoint
    if (endpoints.length > 0) {
      console.log('🧪 Generating tests for first endpoint...\n')
      const agent = new TestGenAgent(endpoints[0])
      const testCode = await agent.generate()
      
      const testFilePath = path.resolve(__dirname, '../src/tests/petstore.test.ts')
      fs.writeFileSync(testFilePath, testCode, 'utf-8')
      console.log(`✅ Generated tests for ${endpoints[0].name}`)
      console.log(`📁 File: ${testFilePath}`)
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

testOpenAPIImport()
