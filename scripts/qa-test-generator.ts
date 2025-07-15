#!/usr/bin/env ts-node

/**
 * QA Engineer Interactive Test Generator
 * 
 * This tool allows QA engineers to generate tests using natural language prompts
 * and specific business logic requirements.
 */

import { QATestAgent } from '../src/agents/QATestAgent'
import { geocodingAPI, countriesAPI, postsAPI } from '../src/configs/apiConfigs'
import { TestGenAgent } from '../src/agents/TestGenAgent'
import { Endpoint } from '../src/types'
import { config } from 'dotenv'
import { resolve } from 'path'
import fs from 'fs'
import * as readline from 'readline'

// Load environment variables
config({ path: resolve(__dirname, '../.env') })

const APIs = {
  geocoding: geocodingAPI,
  countries: countriesAPI,
  posts: postsAPI
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function ask(question: string): Promise<string> {
  return new Promise(resolve => {
    rl.question(question, resolve)
  })
}

async function selectAPI(): Promise<{ key: string; endpoint: Endpoint }> {
  console.log('\n📋 Available APIs:')
  Object.entries(APIs).forEach(([key, api], index) => {
    console.log(`${index + 1}. ${key} - ${api.name}`)
  })
  
  const choice = await ask('\nSelect an API (1-3): ')
  const apiKeys = Object.keys(APIs)
  const selectedKey = apiKeys[parseInt(choice) - 1]
  
  if (!selectedKey) {
    console.log('❌ Invalid selection')
    process.exit(1)
  }
  
  return { key: selectedKey, endpoint: APIs[selectedKey as keyof typeof APIs] }
}

async function getQAPrompt(): Promise<{
  prompt: string
  businessLogic?: string
  testingFocus?: string[]
  riskAreas?: string[]
  userScenarios?: string[]
}> {
  console.log('\n🎯 QA Test Generation - Enter your requirements:\n')
  
  const prompt = await ask('📝 Main testing requirement/prompt: ')
  
  const businessLogic = await ask('🏢 Business logic to test (optional, press Enter to skip): ')
  
  const focusInput = await ask('🔍 Testing focus areas (comma-separated, optional): ')
  const testingFocus = focusInput ? focusInput.split(',').map(s => s.trim()) : []
  
  const riskInput = await ask('⚠️  High-risk areas to test (comma-separated, optional): ')
  const riskAreas = riskInput ? riskInput.split(',').map(s => s.trim()) : []
  
  const scenarioInput = await ask('👤 User scenarios to validate (comma-separated, optional): ')
  const userScenarios = scenarioInput ? scenarioInput.split(',').map(s => s.trim()) : []
  
  return {
    prompt,
    businessLogic: businessLogic || undefined,
    testingFocus: testingFocus.length > 0 ? testingFocus : undefined,
    riskAreas: riskAreas.length > 0 ? riskAreas : undefined,
    userScenarios: userScenarios.length > 0 ? userScenarios : undefined
  }
}

async function generateQATests() {
  console.log('🔬 QA Engineer Test Generator')
  console.log('================================\n')
  
  const openaiApiKey = process.env.OPENAI_API_KEY
  if (!openaiApiKey) {
    console.log('❌ OpenAI API key not found in .env file')
    console.log('Please add OPENAI_API_KEY to .env file in the root directory')
    return
  }

  // Step 1: Select API
  const { key: apiKey, endpoint } = await selectAPI()
  console.log(`\n✅ Selected: ${endpoint.name}`)

  // Step 2: Get QA requirements
  const qaInput = await getQAPrompt()

  // Step 3: Generate tests
  console.log('\n🤖 Generating QA-focused tests...')
  
  try {
    const qaAgent = new QATestAgent(openaiApiKey)
    
    const qaResults = await qaAgent.generateFromPrompt(endpoint, qaInput.prompt, {
      businessLogic: qaInput.businessLogic,
      testingFocus: qaInput.testingFocus,
      riskAreas: qaInput.riskAreas,
      userScenarios: qaInput.userScenarios
    })
    
    console.log(`\n✨ Generated ${qaResults.scenarios.length} test scenarios`)
    console.log(`📊 Risk Assessment: ${qaResults.riskAssessment.length} areas identified`)
    console.log(`📋 Test Cases: ${qaResults.testCases.length} detailed cases`)
    
    // Step 4: Generate actual test code
    console.log('\n🔧 Generating TypeScript test code...')
    
    const enhancedEndpoint = {
      ...endpoint,
      testScenarios: [...(endpoint.testScenarios || []), ...qaResults.scenarios]
    }
    
    const testAgent = new TestGenAgent(enhancedEndpoint, {
      useGPT: true,
      gptApiKey: openaiApiKey
    })
    
    const testCode = await testAgent.generate()
    
    // Step 5: Save results
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filename = `qa-tests-${apiKey}-${timestamp}`
    
    // Save test code
    fs.writeFileSync(`${filename}.test.ts`, testCode)
    
    // Save QA analysis
    const qaReport = `# QA Test Analysis Report
    
## API: ${endpoint.name}
## Generated: ${new Date().toISOString()}

### Requirements
${qaInput.prompt}

### Business Logic
${qaInput.businessLogic || 'None specified'}

### Testing Focus Areas
${qaInput.testingFocus?.map(f => `- ${f}`).join('\n') || 'None specified'}

### Risk Areas
${qaInput.riskAreas?.map(r => `- ${r}`).join('\n') || 'None specified'}

### User Scenarios
${qaInput.userScenarios?.map(s => `- ${s}`).join('\n') || 'None specified'}

### Generated Test Scenarios
${qaResults.scenarios.map((scenario, i) => `
${i + 1}. **${scenario.name}**
   - Description: ${scenario.description}
   - Tags: ${scenario.tags?.join(', ') || 'None'}
   - Expected Status: ${scenario.expected.status}
`).join('')}

### Risk Assessment
${qaResults.riskAssessment.map(risk => `- ${risk}`).join('\n')}

### Test Coverage Analysis
${qaResults.coverage.map(coverage => `- ${coverage}`).join('\n')}

### QA Reasoning
${qaResults.reasoning}

### Detailed Test Cases
${qaResults.testCases.map((testCase, i) => `
${i + 1}. ${testCase}
`).join('')}
`
    
    fs.writeFileSync(`${filename}-report.md`, qaReport)
    
    console.log(`\n✅ Files generated:`)
    console.log(`📁 Test Code: ${filename}.test.ts`)
    console.log(`📄 QA Report: ${filename}-report.md`)
    
    // Step 6: Show summary
    console.log('\n📊 Generation Summary:')
    console.log(`🧪 Test Scenarios: ${qaResults.scenarios.length}`)
    console.log(`⚠️  Risk Areas: ${qaResults.riskAssessment.length}`)
    console.log(`📋 Test Cases: ${qaResults.testCases.length}`)
    console.log(`📈 Coverage Areas: ${qaResults.coverage.length}`)
    
  } catch (error) {
    console.error('❌ Error generating QA tests:', error)
  }
}

async function showExamples() {
  console.log('\n💡 QA Prompt Examples:\n')
  
  console.log('🎯 **Business Logic Testing:**')
  console.log('"Test the payment processing logic to ensure transactions are atomic and reversible"')
  
  console.log('\n🔒 **Security Testing:**')
  console.log('"Validate input sanitization and SQL injection prevention for all user inputs"')
  
  console.log('\n🌍 **Internationalization Testing:**')
  console.log('"Test address validation for international addresses including unicode characters"')
  
  console.log('\n📊 **Performance Testing:**')
  console.log('"Validate response times under load and ensure graceful degradation"')
  
  console.log('\n✅ **Compliance Testing:**')
  console.log('"Ensure GDPR compliance for data handling and user consent management"')
  
  console.log('\n👤 **User Experience Testing:**')
  console.log('"Test error messages are user-friendly and provide actionable guidance"')
  
  console.log('\n🔄 **Integration Testing:**')
  console.log('"Validate third-party service integration and fallback mechanisms"')
}

async function main() {
  const args = process.argv.slice(2)
  
  if (args.includes('--examples')) {
    await showExamples()
    rl.close()
    return
  }
  
  try {
    await generateQATests()
  } catch (error) {
    console.error('Error:', error)
  } finally {
    rl.close()
  }
}

if (require.main === module) {
  main()
}
