import { Endpoint, TestScenario } from '../types'

interface GPTTestGeneration {
  scenarios: TestScenario[]
  assertions: string[]
  edgeCases: string[]
  reasoning: string
}

export class GPTTestEnhancer {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async enhanceTestGeneration(endpoint: Endpoint): Promise<GPTTestGeneration> {
    const prompt = this.buildPrompt(endpoint)
    
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
            content: 'You are an expert API testing specialist. Generate comprehensive test scenarios for REST APIs with deep understanding of edge cases, security concerns, and domain-specific validation.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    })

    const data = await response.json()
    return this.parseGPTResponse(data.choices[0].message.content)
  }

  private buildPrompt(endpoint: Endpoint): string {
    return `
Analyze this API endpoint and suggest comprehensive test scenarios:

API: ${endpoint.name}
Method: ${endpoint.method}
URL: ${endpoint.url}
Parameters: ${JSON.stringify(endpoint.parameters, null, 2)}
Authentication: ${JSON.stringify(endpoint.authentication, null, 2)}

Please suggest:
1. Advanced test scenarios beyond basic happy path and validation
2. Domain-specific edge cases based on the API purpose
3. Security test cases
4. Performance considerations
5. Specific assertions for response validation
6. Error handling scenarios

Consider the API's domain (e.g., if it's geocoding, think about international addresses, coordinates, etc.)

Return your response in this JSON format:
{
  "scenarios": [
    {
      "name": "test name",
      "description": "detailed description",
      "input": {"param": "value"},
      "expected": {"status": 200, "contentType": "application/json", "schema": {}},
      "tags": ["tag1", "tag2"]
    }
  ],
  "assertions": [
    "specific assertion suggestions for this API type"
  ],
  "edgeCases": [
    "edge case descriptions"
  ],
  "reasoning": "explanation of why these tests are important for this specific API"
}
`
  }

  private parseGPTResponse(content: string): GPTTestGeneration {
    try {
      // Extract JSON from GPT response (it might have extra text)
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
    } catch (error) {
      console.warn('Failed to parse GPT response:', error)
    }

    // Fallback to empty response
    return {
      scenarios: [],
      assertions: [],
      edgeCases: [],
      reasoning: 'Failed to parse GPT response'
    }
  }

  async generateSmartAssertions(endpoint: Endpoint, responseData: any): Promise<string[]> {
    const prompt = `
Given this API endpoint and sample response, suggest specific assertions:

API: ${endpoint.name}
Sample Response: ${JSON.stringify(responseData, null, 2)}

Generate TypeScript/Vitest assertions that would validate this response appropriately.
Focus on:
- Data structure validation
- Value range checks
- Business logic validation
- Type safety

Return as a JSON array of assertion strings.
`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 1000
      })
    })

    const data = await response.json()
    
    try {
      return JSON.parse(data.choices[0].message.content)
    } catch {
      return []
    }
  }
}
