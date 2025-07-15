import { Endpoint, TestScenario } from '../types'
import { GPTTestEnhancer } from './GPTTestEnhancer'

interface QAPromptOptions {
  businessLogic?: string
  testingFocus?: string[]
  riskAreas?: string[]
  userScenarios?: string[]
  dataConstraints?: string[]
  complianceRequirements?: string[]
}

interface QATestGeneration {
  scenarios: TestScenario[]
  testCases: string[]
  riskAssessment: string[]
  coverage: string[]
  reasoning: string
}

export class QATestAgent {
  private gptEnhancer: GPTTestEnhancer

  constructor(private apiKey: string) {
    this.gptEnhancer = new GPTTestEnhancer(apiKey)
  }

  /**
   * Generate tests based on QA engineer prompts and business requirements
   */
  async generateFromPrompt(
    endpoint: Endpoint, 
    qaPrompt: string, 
    options: QAPromptOptions = {}
  ): Promise<QATestGeneration> {
    
    const enhancedPrompt = this.buildQAPrompt(endpoint, qaPrompt, options)
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: this.getQASystemPrompt()
          },
          {
            role: 'user',
            content: enhancedPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 3000
      })
    })

    const data = await response.json()
    return this.parseQAResponse(data.choices[0].message.content)
  }

  /**
   * Generate tests focused on specific business scenarios
   */
  async generateBusinessScenarioTests(
    endpoint: Endpoint,
    scenarios: string[]
  ): Promise<TestScenario[]> {
    
    const prompt = `
As a QA Engineer, I need to test these business scenarios for the ${endpoint.name} API:

${scenarios.map((scenario, i) => `${i + 1}. ${scenario}`).join('\n')}

API Details:
- Method: ${endpoint.method}
- URL: ${endpoint.url}
- Parameters: ${JSON.stringify(endpoint.parameters, null, 2)}

Generate specific test cases that validate each business scenario, including:
- Happy path for each scenario
- Edge cases and boundary conditions
- Error handling
- Data validation
- User experience considerations

Return as JSON array of TestScenario objects.
`

    const response = await this.callGPT(prompt)
    try {
      return JSON.parse(response)
    } catch {
      return []
    }
  }

  /**
   * Generate risk-based test scenarios
   */
  async generateRiskBasedTests(
    endpoint: Endpoint,
    riskAreas: string[]
  ): Promise<TestScenario[]> {
    
    const prompt = `
As a QA Engineer, I need to create risk-based tests for ${endpoint.name} focusing on these risk areas:

${riskAreas.map((risk, i) => `${i + 1}. ${risk}`).join('\n')}

Create test scenarios that specifically validate these risks, including:
- Failure modes and error conditions
- Security vulnerabilities
- Performance bottlenecks
- Data corruption scenarios
- Integration points
- User impact scenarios

Return comprehensive test scenarios as JSON.
`

    const response = await this.callGPT(prompt)
    try {
      return JSON.parse(response)
    } catch {
      return []
    }
  }

  /**
   * Generate compliance and regulation tests
   */
  async generateComplianceTests(
    endpoint: Endpoint,
    requirements: string[]
  ): Promise<TestScenario[]> {
    
    const prompt = `
Generate compliance test scenarios for ${endpoint.name} to validate these requirements:

${requirements.map((req, i) => `${i + 1}. ${req}`).join('\n')}

Focus on:
- Data privacy and protection
- Regulatory compliance validation
- Audit trail verification
- Access control testing
- Data retention policies
- Cross-border data transfer rules

Return detailed test scenarios as JSON.
`

    const response = await this.callGPT(prompt)
    try {
      return JSON.parse(response)
    } catch {
      return []
    }
  }

  private buildQAPrompt(
    endpoint: Endpoint, 
    qaPrompt: string, 
    options: QAPromptOptions
  ): string {
    return `
As an experienced QA Engineer, I need comprehensive test scenarios for this API:

API: ${endpoint.name}
Method: ${endpoint.method}
URL: ${endpoint.url}
Parameters: ${JSON.stringify(endpoint.parameters, null, 2)}
Authentication: ${JSON.stringify(endpoint.authentication, null, 2)}

QA REQUIREMENTS:
${qaPrompt}

${options.businessLogic ? `BUSINESS LOGIC TO TEST:\n${options.businessLogic}\n` : ''}

${options.testingFocus?.length ? `TESTING FOCUS AREAS:\n${options.testingFocus.map(f => `- ${f}`).join('\n')}\n` : ''}

${options.riskAreas?.length ? `HIGH-RISK AREAS:\n${options.riskAreas.map(r => `- ${r}`).join('\n')}\n` : ''}

${options.userScenarios?.length ? `USER SCENARIOS TO VALIDATE:\n${options.userScenarios.map(s => `- ${s}`).join('\n')}\n` : ''}

${options.dataConstraints?.length ? `DATA CONSTRAINTS:\n${options.dataConstraints.map(c => `- ${c}`).join('\n')}\n` : ''}

${options.complianceRequirements?.length ? `COMPLIANCE REQUIREMENTS:\n${options.complianceRequirements.map(c => `- ${c}`).join('\n')}\n` : ''}

Please generate:
1. Comprehensive test scenarios covering the requirements above
2. Risk assessment for each test area
3. Test coverage analysis
4. Specific test cases with expected results
5. Reasoning for why each test is important

Return in this JSON format:
{
  "scenarios": [TestScenario objects],
  "testCases": ["detailed test case descriptions"],
  "riskAssessment": ["risk analysis for each area"],
  "coverage": ["coverage analysis"],
  "reasoning": "overall testing strategy explanation"
}
`
  }

  private getQASystemPrompt(): string {
    return `
You are a Senior QA Engineer with 10+ years of experience in API testing, test automation, and quality assurance. You specialize in:

- Risk-based testing strategies
- Business logic validation
- Edge case identification
- Compliance and security testing
- User experience validation
- Performance and scalability testing
- Test automation best practices

When generating test scenarios, consider:
- Real-world usage patterns
- Potential failure modes
- Security vulnerabilities
- Performance implications
- User impact scenarios
- Regulatory compliance
- Integration points
- Data quality and integrity

Provide comprehensive, practical test scenarios that a QA team can implement effectively.
`
  }

  private async callGPT(prompt: string): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 2000
      })
    })

    const data = await response.json()
    return data.choices[0].message.content
  }

  private parseQAResponse(content: string): QATestGeneration {
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
    } catch (error) {
      console.warn('Failed to parse QA response:', error)
    }

    return {
      scenarios: [],
      testCases: [],
      riskAssessment: [],
      coverage: [],
      reasoning: 'Failed to parse response'
    }
  }
}
