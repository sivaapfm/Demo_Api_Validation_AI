#!/usr/bin/env ts-node

/**
 * Demo: GPT-4 Enhanced Test Generation
 * 
 * This script demonstrates the difference between rule-based and GPT-4 enhanced test generation
 */

import { TestGenAgent } from '../src/agents/TestGenAgent'
import { geocodingAPI } from '../src/configs/apiConfigs'
import { config } from 'dotenv'
import { resolve } from 'path'
import fs from 'fs'

// Load environment variables
config({ path: resolve(__dirname, '../.env') })

async function compareTestGeneration() {
  console.log('🔬 Comparing Rule-Based vs GPT-4 Enhanced Test Generation\n')
  
  const openaiApiKey = process.env.OPENAI_API_KEY
  
  if (!openaiApiKey) {
    console.log('❌ OpenAI API key not found in .env file')
    console.log('Please add OPENAI_API_KEY to .env file in the root directory to test GPT-4 enhancement')
    return
  }

  // 1. Generate tests with rule-based approach
  console.log('🔧 Generating tests with RULE-BASED approach...')
  const ruleBasedAgent = new TestGenAgent(geocodingAPI)
  const ruleBasedTests = await ruleBasedAgent.generate()
  
  fs.writeFileSync('./rule-based-tests.ts', ruleBasedTests)
  console.log('✅ Rule-based tests saved to rule-based-tests.ts')
  
  // Count scenarios in rule-based
  const ruleBasedScenarios = (ruleBasedTests.match(/it\(/g) || []).length
  console.log(`📊 Generated ${ruleBasedScenarios} test scenarios\n`)

  // 2. Generate tests with GPT-4 enhancement
  console.log('🤖 Generating tests with GPT-4 ENHANCED approach...')
  const gptAgent = new TestGenAgent(geocodingAPI, {
    useGPT: true,
    gptApiKey: openaiApiKey
  })
  
  try {
    const gptEnhancedTests = await gptAgent.generate()
    
    fs.writeFileSync('./gpt-enhanced-tests.ts', gptEnhancedTests)
    console.log('✅ GPT-4 enhanced tests saved to gpt-enhanced-tests.ts')
    
    // Count scenarios in GPT-enhanced
    const gptScenarios = (gptEnhancedTests.match(/it\(/g) || []).length
    console.log(`📊 Generated ${gptScenarios} test scenarios\n`)
    
    // Compare
    console.log('📈 COMPARISON:')
    console.log(`Rule-based:     ${ruleBasedScenarios} scenarios`)
    console.log(`GPT-4 enhanced: ${gptScenarios} scenarios`)
    console.log(`Improvement:    +${gptScenarios - ruleBasedScenarios} scenarios (${Math.round((gptScenarios / ruleBasedScenarios - 1) * 100)}% increase)`)
    
  } catch (error) {
    console.error('❌ GPT-4 test generation failed:', error)
  }
}

async function demonstrateGPTAdvantages() {
  console.log('\n🎯 GPT-4 Enhanced Test Generation Advantages:\n')
  
  console.log('1. 🧠 INTELLIGENT EDGE CASE DISCOVERY')
  console.log('   Rule-based: Fixed patterns (missing params, auth, validation)')
  console.log('   GPT-4: Context-aware (international addresses, coordinate bounds, etc.)')
  
  console.log('\n2. 🎯 DOMAIN-SPECIFIC VALIDATION')
  console.log('   Rule-based: expect(data).toHaveProperty("results")')
  console.log('   GPT-4: expect(data.results[0].geometry.location.lat).toBeWithinRange(-90, 90)')
  
  console.log('\n3. 🔒 SECURITY-AWARE TESTING')
  console.log('   Rule-based: Basic parameter validation')
  console.log('   GPT-4: SQL injection, XSS, rate limiting, input sanitization')
  
  console.log('\n4. 📝 HUMAN-READABLE SCENARIOS')
  console.log('   Rule-based: "should fail when required parameter missing"')
  console.log('   GPT-4: "should handle malformed international postal codes gracefully"')
  
  console.log('\n5. 🌍 BUSINESS CONTEXT UNDERSTANDING')
  console.log('   Rule-based: Generic API testing')
  console.log('   GPT-4: Understanding geocoding means coordinates, addresses, map data')
}

async function main() {
  await compareTestGeneration()
  await demonstrateGPTAdvantages()
  
  console.log('\n🚀 How to Enable GPT-4 Enhancement:')
  console.log('const agent = new TestGenAgent(endpoint, {')
  console.log('  useGPT: true,')
  console.log('  gptApiKey: process.env.OPENAI_API_KEY')
  console.log('})')
}

if (require.main === module) {
  main().catch(console.error)
}
