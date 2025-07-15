import { TestGenAgent } from '../agents/TestGenAgent'
import { geocodingAPI, countriesAPI, postsAPI } from '../configs/apiConfigs'
import fs from 'fs'
import path from 'path'

// Available API configurations
const APIs = {
  geocoding: geocodingAPI,
  countries: countriesAPI,
  posts: postsAPI
}

async function generateTestsForAPI(apiName: keyof typeof APIs) {
  const endpoint = APIs[apiName]
  const agent = new TestGenAgent(endpoint)
  const testCode = await agent.generate()

  const testFilePath = path.resolve(__dirname, `../tests/${apiName}.test.ts`)
  fs.writeFileSync(testFilePath, testCode, 'utf-8')
  console.log(`✅ Generated tests for ${endpoint.name}`)
  console.log(`📁 File: ${testFilePath}`)
  console.log(`🧪 Test scenarios: ${getTestScenarioCount(endpoint)}`)
  console.log('---')
}

function getTestScenarioCount(endpoint: any): number {
  let count = 1 // Happy path
  count += endpoint.parameters.filter((p: any) => p.required).length // Required param tests
  if (endpoint.authentication) count += 1 // Auth test
  count += endpoint.parameters.filter((p: any) => p.validation).length // Validation tests
  count += endpoint.testScenarios?.length || 0 // Custom scenarios
  return count
}

async function main() {
  console.log('🚀 Starting API Test Generation...\n')

  // Get API name from command line arguments
  const apiName = process.argv[2]
  
  if (apiName && apiName in APIs) {
    await generateTestsForAPI(apiName as keyof typeof APIs)
  } else if (apiName === 'all') {
    // Generate tests for all APIs
    for (const api of Object.keys(APIs) as Array<keyof typeof APIs>) {
      await generateTestsForAPI(api)
    }
  } else {
    console.log('📋 Available APIs:')
    Object.keys(APIs).forEach(api => {
      console.log(`  - ${api}`)
    })
    console.log('\n💡 Usage:')
    console.log('  npm run generate-tests [api-name]')
    console.log('  npm run generate-tests all')
    console.log('\n📖 Examples:')
    console.log('  npm run generate-tests geocoding')
    console.log('  npm run generate-tests all')
  }
}

main().catch(console.error)
