import { generateTestCases } from '../generators/generateTestCases'
import { Endpoint } from '../types'
import { GPTTestEnhancer } from './GPTTestEnhancer'

interface TestGenOptions {
  useGPT?: boolean
  gptApiKey?: string
}

export class TestGenAgent {
  constructor(
    private endpoint: Endpoint, 
    private options: TestGenOptions = {}
  ) {}

  public async generate(): Promise<string> {
    if (this.options.useGPT && this.options.gptApiKey) {
      return this.generateWithGPT()
    }
    
    return generateTestCases(this.endpoint)
  }

  private async generateWithGPT(): Promise<string> {
    console.log(`🤖 Using GPT-4 to enhance test generation for ${this.endpoint.name}...`)
    
    const enhancer = new GPTTestEnhancer(this.options.gptApiKey!)
    
    try {
      // Get GPT-4 enhanced scenarios
      const gptEnhancement = await enhancer.enhanceTestGeneration(this.endpoint)
      
      // Merge with rule-based scenarios
      const enhancedEndpoint = {
        ...this.endpoint,
        testScenarios: [
          ...(this.endpoint.testScenarios || []),
          ...gptEnhancement.scenarios
        ]
      }
      
      console.log(`✨ GPT-4 suggested ${gptEnhancement.scenarios.length} additional test scenarios`)
      console.log(`💡 Reasoning: ${gptEnhancement.reasoning}`)
      
      return generateTestCases(enhancedEndpoint)
      
    } catch (error) {
      console.warn('⚠️  GPT-4 enhancement failed, falling back to rule-based generation:', error)
      return generateTestCases(this.endpoint)
    }
  }
}
