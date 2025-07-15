#!/usr/bin/env ts-node

/**
 * QA Testing Examples
 * 
 * This script demonstrates various QA testing scenarios you can use with the framework
 */

import { QATestAgent } from '../src/agents/QATestAgent'
import { geocodingAPI } from '../src/configs/apiConfigs'
import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(__dirname, '../.env') })

async function demonstrateQAScenarios() {
  console.log('🎯 QA Engineer Testing Scenarios Demo\n')
  
  const openaiApiKey = process.env.OPENAI_API_KEY
  if (!openaiApiKey) {
    console.log('❌ OpenAI API key required')
    return
  }

  const qaAgent = new QATestAgent(openaiApiKey)

  // Example 1: Business Logic Testing
  console.log('🏢 Example 1: Business Logic Testing')
  console.log('=====================================')
  
  const businessLogicPrompt = `
  Test the geocoding business logic to ensure:
  - Address normalization works correctly
  - Coordinate accuracy is within acceptable bounds
  - International address formats are handled properly
  - Ambiguous addresses return multiple results when appropriate
  `
  
  try {
    const businessResults = await qaAgent.generateFromPrompt(
      geocodingAPI, 
      "Validate the core business logic for address geocoding",
      {
        businessLogic: businessLogicPrompt.trim(),
        testingFocus: [
          "Address normalization",
          "Coordinate accuracy", 
          "International support",
          "Ambiguity handling"
        ],
        riskAreas: [
          "Incorrect coordinates for emergency services",
          "Privacy concerns with address data",
          "Performance with large batch requests"
        ]
      }
    )
    
    console.log(`✅ Generated ${businessResults.scenarios.length} business logic test scenarios`)
    console.log(`💡 Reasoning: ${businessResults.reasoning.substring(0, 200)}...`)
    
  } catch (error) {
    console.log('❌ Business logic test generation failed:', error)
  }

  console.log('\n' + '='.repeat(50) + '\n')

  // Example 2: Security Testing
  console.log('🔒 Example 2: Security Testing')
  console.log('===============================')
  
  try {
    const securityResults = await qaAgent.generateFromPrompt(
      geocodingAPI,
      "Perform comprehensive security testing to identify vulnerabilities",
      {
        testingFocus: [
          "Input validation",
          "SQL injection prevention", 
          "API key security",
          "Rate limiting"
        ],
        riskAreas: [
          "Unauthorized access to location data",
          "API key exposure",
          "DoS attacks via malformed requests",
          "Data leakage through error messages"
        ]
      }
    )
    
    console.log(`🔐 Generated ${securityResults.scenarios.length} security test scenarios`)
    console.log(`⚠️  Risk assessment: ${securityResults.riskAssessment.length} areas identified`)
    
  } catch (error) {
    console.log('❌ Security test generation failed:', error)
  }

  console.log('\n' + '='.repeat(50) + '\n')

  // Example 3: User Experience Testing
  console.log('👤 Example 3: User Experience Testing')
  console.log('======================================')
  
  try {
    const uxResults = await qaAgent.generateFromPrompt(
      geocodingAPI,
      "Ensure excellent user experience across all interaction scenarios",
      {
        userScenarios: [
          "User enters incomplete address",
          "User searches for non-existent location", 
          "User makes typos in address",
          "User needs address in different language",
          "User experiences slow network connection"
        ],
        testingFocus: [
          "Error message clarity",
          "Response time expectations",
          "Graceful degradation",
          "Accessibility compliance"
        ]
      }
    )
    
    console.log(`👥 Generated ${uxResults.scenarios.length} UX test scenarios`)
    console.log(`📋 Test cases: ${uxResults.testCases.length} detailed cases`)
    
  } catch (error) {
    console.log('❌ UX test generation failed:', error)
  }

  console.log('\n' + '='.repeat(50) + '\n')

  // Example 4: Compliance Testing
  console.log('✅ Example 4: Compliance Testing')
  console.log('==================================')
  
  try {
    const complianceScenarios = await qaAgent.generateComplianceTests(
      geocodingAPI,
      [
        "GDPR compliance for location data processing",
        "Data retention policies for geocoding history", 
        "Cross-border data transfer regulations",
        "User consent management for location tracking",
        "Audit trail requirements for location queries"
      ]
    )
    
    console.log(`📋 Generated ${complianceScenarios.length} compliance test scenarios`)
    complianceScenarios.forEach((scenario, i) => {
      console.log(`   ${i + 1}. ${scenario.name}`)
    })
    
  } catch (error) {
    console.log('❌ Compliance test generation failed:', error)
  }
}

async function showQACommands() {
  console.log('\n🚀 QA Engineer Commands:\n')
  
  console.log('1. **Interactive Test Generation:**')
  console.log('   npx ts-node scripts/qa-test-generator.ts')
  console.log('   - Guided prompts for test requirements')
  console.log('   - Business logic specification')
  console.log('   - Risk area identification')
  console.log('   - User scenario validation\n')
  
  console.log('2. **View QA Examples:**')
  console.log('   npx ts-node scripts/qa-test-generator.ts --examples')
  console.log('   - Common QA testing scenarios')
  console.log('   - Prompt templates')
  console.log('   - Best practices\n')
  
  console.log('3. **Programmatic QA Testing:**')
  console.log('   ```typescript')
  console.log('   const qaAgent = new QATestAgent(apiKey)')
  console.log('   const results = await qaAgent.generateFromPrompt(endpoint, prompt, options)')
  console.log('   ```\n')
  
  console.log('4. **Business Scenario Testing:**')
  console.log('   ```typescript')
  console.log('   const scenarios = await qaAgent.generateBusinessScenarioTests(endpoint, [')
  console.log('     "User pays with expired credit card",')
  console.log('     "System handles concurrent user registrations"')
  console.log('   ])')
  console.log('   ```\n')
  
  console.log('5. **Risk-Based Testing:**')
  console.log('   ```typescript')
  console.log('   const riskTests = await qaAgent.generateRiskBasedTests(endpoint, [')
  console.log('     "Data corruption during high load",')
  console.log('     "Security breaches through API endpoints"')
  console.log('   ])')
  console.log('   ```')
}

async function main() {
  const args = process.argv.slice(2)
  
  if (args.includes('--commands')) {
    await showQACommands()
    return
  }
  
  await demonstrateQAScenarios()
  await showQACommands()
}

if (require.main === module) {
  main().catch(console.error)
}
