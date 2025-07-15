# API Test Framework - Complete Guide

## Overview

This is an intelligent API test generation framework built with TypeScript, Vitest, and automated test case generation. The framework can automatically generate comprehensive test suites for REST APIs based on manual configuration or through AI-enhanced test generation.

## 🏗️ Architecture

### Core Components

```
demo-api-validation-ai/
├── src/
│   ├── types.ts              # Type definitions for endpoints, parameters, scenarios
│   ├── agents/
│   │   ├── TestGenAgent.ts   # Main test generation agent
│   │   ├── QATestAgent.ts    # AI-powered QA test agent
│   │   └── GPTTestEnhancer.ts # GPT-4 test enhancement
│   ├── generators/
│   │   ├── generateTestCases.ts  # Core test generation logic
│   │   └── generateTests.ts      # CLI script for batch generation
│   ├── configs/
│   │   └── apiConfigs.ts     # Pre-configured API definitions (geocoding, countries, posts)
│   ├── utils/
│   │   └── openAPIImporter.ts    # OpenAPI/Swagger import utility
│   └── tests/
│       ├── .env              # Environment variables (API keys)
│       └── *.test.ts         # Generated test files
├── scripts/
│   ├── demo.ts               # Complete framework demonstration
│   └── qa-test-generator.ts  # Interactive QA test generation
├── vitest.config.ts          # Vitest configuration
└── package.json
```

## 🚀 How It Works

### 1. API Endpoint Definition

The framework uses a rich `Endpoint` interface to describe APIs:

```typescript
interface Endpoint {
  name: string                    // Human-readable API name
  method: 'GET' | 'POST' | ...   // HTTP method
  url: string                     // Full endpoint URL
  baseUrl?: string                // Base URL for reference
  parameters: Parameter[]         // Input parameters
  authentication?: {              // Auth configuration
    type: 'api_key' | 'bearer' | 'basic'
    location?: 'header' | 'query' | 'body'
    name?: string
  }
  responses: ExpectedResponse[]   // Expected response formats
  testScenarios?: TestScenario[]  // Custom test scenarios
  rateLimit?: {                   // Rate limiting info
    requests: number
    per: 'second' | 'minute' | 'hour'
  }
}
```

### 2. Automatic Test Generation

The framework automatically generates several types of tests:

- **Happy Path Tests**: Valid requests with all required parameters
- **Validation Tests**: Missing required parameters, invalid data types
- **Authentication Tests**: Invalid or missing authentication
- **Boundary Tests**: Edge cases for parameter validation
- **Custom Scenarios**: User-defined test cases

### 3. Test Generation Process

```
API Definition → TestGenAgent → Test Code → Vitest Execution
      ↓              ↓             ↓            ↓
   Endpoints   Scenario Gen   TypeScript    Test Results
```

## 📝 Usage Guide

### Method 1: Manual API Configuration

1. **Define your API in `src/configs/apiConfigs.ts`:**

```typescript
export const myAPI: Endpoint = {
  name: 'My Custom API',
  method: 'GET',
  url: 'https://api.example.com/v1/data',
  parameters: [
    {
      name: 'apiKey',
      type: 'string',
      required: true,
      description: 'Your API key'
    },
    {
      name: 'limit',
      type: 'number',
      required: false,
      validation: { min: 1, max: 100 }
    }
  ],
  authentication: {
    type: 'api_key',
    location: 'query',
    name: 'apiKey'
  },
  responses: [
    { status: 200, contentType: 'application/json', schema: {} },
    { status: 401, contentType: 'application/json', schema: {} }
  ]
}
```

2. **Add to the APIs object in `generateTests.ts`:**

```typescript
const APIs = {
  geocoding: geocodingAPI,
  countries: countriesAPI,
  posts: postsAPI,
  myapi: myAPI  // Add your API here
}
```

3. **Generate tests:**

```bash
pnpm run generate-tests myapi
```

### Method 2: AI-Enhanced Testing

Use the QA Test Agent for intelligent test generation:

```bash
# Start interactive QA test generation
pnpm run qa-generate

# Select from available APIs: geocoding, countries, posts
# Enter business-focused testing requirements
# Get AI-generated comprehensive test scenarios
```

### Method 3: CLI Generation

Generate tests for specific APIs or all at once:

```bash
# Generate tests for a specific API
pnpm run generate-tests geocoding

# Generate tests for all configured APIs
pnpm run generate-tests all

# List available APIs
pnpm run generate-tests
```

## 🔧 Configuration

### Environment Variables

Create `src/tests/.env` with your API keys:

```bash
GOOGLE_API_KEY=your_google_maps_api_key
OPENAI_API_KEY=your_openai_api_key
MY_API_KEY=your_custom_api_key
```

### Vitest Configuration

The framework is configured to:
- Load environment variables from `.env`
- Use single-threaded execution (prevents serialization errors)
- Disable test isolation for better performance
- Use Node.js environment for `fetch` support

## 📊 Generated Test Examples

### Happy Path Test

```typescript
it('should return success for valid GET request', async () => {
  const url = new URL('https://api.example.com/v1/data')
  url.searchParams.set('apiKey', API_KEY || "")
  url.searchParams.set('limit', '10')
  
  const response = await fetch(url.toString())
  const data = await response.json()
  
  expect(response.status).toBe(200)
  expect(response.headers.get('content-type')).toContain('application/json')
})
```

### Validation Test

```typescript
it('should fail when required parameter \\'apiKey\\' is missing', async () => {
  const url = new URL('https://api.example.com/v1/data')
  url.searchParams.set('limit', '10')
  
  const response = await fetch(url.toString())
  const data = await response.json()
  
  expect(response.status).toBe(400)
  expect(data.status).toMatch(/INVALID_REQUEST|ERROR/)
})
```

## 🎯 Auto-Generation Features

### 1. Parameter Validation

Automatically generates tests for:
- Required parameter validation
- Data type validation
- Enum value validation
- Range validation (min/max)
- Pattern validation (regex)

### 2. Authentication Testing

Generates tests for:
- Missing authentication
- Invalid credentials
- Expired tokens
- Wrong authentication method

### 3. Response Validation

Validates:
- HTTP status codes
- Content-Type headers
- Response structure
- Error message formats

### 4. Edge Cases

Automatically tests:
- Empty parameters
- Boundary values
- Special characters
- Large datasets
- Rate limiting

## 🔄 Extending the Framework

### Adding New Test Types

1. **Extend the `TestScenario` interface:**

```typescript
interface TestScenario {
  name: string
  description: string
  input: { [key: string]: any }
  expected: ExpectedResponse
  tags?: string[]
  setup?: () => Promise<void>      // Add setup hooks
  teardown?: () => Promise<void>   // Add cleanup hooks
}
```

2. **Add new test generators in `generateTestCases.ts`:**

```typescript
function generatePerformanceTests(endpoint: Endpoint): TestScenario[] {
  return [{
    name: 'should respond within acceptable time',
    description: 'Performance test for response time',
    input: generateValidInput(endpoint.parameters),
    expected: { status: 200, contentType: 'application/json', schema: {} },
    tags: ['performance']
  }]
}
```

### Adding New Import Sources

Create new importers for different API specification formats:

```typescript
export class PostmanImporter {
  static fromCollection(collection: any): Endpoint[] {
    // Convert Postman collection to Endpoint[]
  }
}

export class InsomniaImporter {
  static fromWorkspace(workspace: any): Endpoint[] {
    // Convert Insomnia workspace to Endpoint[]
  }
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Syntax Errors in Generated Tests**
   - Check for unescaped quotes in test names
   - Verify template string formatting

2. **API Key Issues**
   - Ensure `.env` file is in `src/tests/` directory
   - Check environment variable names match usage in tests

3. **Vitest Serialization Errors**
   - Use `fetch` instead of Axios
   - Ensure `isolate: false` in vitest config

4. **Rate Limiting**
   - Add delays between test runs
   - Configure rate limiting in endpoint definitions

### Debugging Generated Tests

1. **Check generated test files:**
```bash
cat src/tests/your-api.test.ts
```

2. **Run specific test files:**
```bash
pnpm exec vitest run src/tests/your-api.test.ts
```

3. **Enable debug logging:**
```typescript
// In test files
console.log('Request URL:', url.toString())
console.log('Response:', data)
```

## 🚀 Best Practices

### 1. API Configuration

- Use descriptive names for endpoints and parameters
- Include comprehensive parameter validation rules
- Define realistic test data in examples
- Document authentication requirements clearly

### 2. Test Organization

- Group related APIs in separate config files
- Use consistent naming conventions
- Tag tests appropriately for filtering
- Include both positive and negative test cases

### 3. Maintenance

- Keep OpenAPI specs up to date
- Regenerate tests when API changes
- Monitor test failures for API changes
- Update authentication credentials regularly

## 📈 Advanced Features

### 1. Schema Validation

Add JSON schema validation to responses:

```typescript
import Ajv from 'ajv'

const responseSchema = {
  type: 'object',
  properties: {
    data: { type: 'array' },
    status: { type: 'string' }
  },
  required: ['data', 'status']
}

// In test
const ajv = new Ajv()
const validate = ajv.compile(responseSchema)
expect(validate(data)).toBe(true)
```

### 2. Contract Testing

Generate contract tests between services:

```typescript
function generateContractTests(endpoint: Endpoint): string {
  // Generate Pact.js or similar contract tests
}
```

### 3. Load Testing

Generate performance test suites:

```typescript
function generateLoadTests(endpoint: Endpoint): string {
  // Generate k6 or Artillery test scripts
}
```

## 🎉 Summary

This framework provides a complete solution for automated API testing:

- **✅ Zero-config test generation** from API specifications
- **✅ Multiple input sources** (manual config, OpenAPI, Swagger)
- **✅ Comprehensive test coverage** (happy path, validation, auth, edge cases)
- **✅ Type-safe TypeScript** implementation
- **✅ Modern testing stack** (Vitest, native fetch)
- **✅ Environment management** with dotenv
- **✅ Extensible architecture** for custom test types

The framework scales from simple APIs to complex enterprise systems, making API testing effortless and comprehensive.
