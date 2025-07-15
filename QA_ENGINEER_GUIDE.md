# QA Engineer Guide - Prompt-Driven Test Generation

## Overview

As a QA Engineer, you can now generate comprehensive test suites using **natural language prompts** that describe your specific testing requirements, business logic, and quality concerns.

## 🚀 Quick Start for QA Engineers

### 1. **Interactive Test Generation**
```bash
pnpm run qa- [ ] 🤖 **Generate tests**: Run `pnpm run qa-generate` for interactive modegenerate
```

This launches an interactive session where you can:
- Select the API to test
- Enter your testing requirements in plain English
- Specify business logic to validate
- Define risk areas and user scenarios
- Get comprehensive test code + QA analysis report

### 2. **View QA Examples**
```bash
pnpm run qa-examples
```

See examples of different QA testing scenarios and prompts.

## 🎯 How to Write Effective QA Prompts

### **Business Logic Testing**
```
"Test the payment processing logic to ensure transactions are atomic and reversible"

"Validate the user registration workflow handles duplicate emails correctly"

"Ensure address geocoding provides accurate coordinates for emergency services"
```

### **Security Testing**
```
"Validate input sanitization and SQL injection prevention for all user inputs"

"Test API authentication and authorization boundary conditions"

"Ensure sensitive data is not exposed in error messages or logs"
```

### **Performance Testing**
```
"Validate response times under load and ensure graceful degradation"

"Test memory usage and connection pooling under high concurrency"

"Ensure API rate limiting works correctly without blocking legitimate users"
```

### **User Experience Testing**
```
"Test error messages are user-friendly and provide actionable guidance"

"Validate API responses provide sufficient data for UI requirements"

"Ensure accessibility compliance for all response formats"
```

### **Compliance Testing**
```
"Ensure GDPR compliance for data handling and user consent management"

"Validate PCI DSS compliance for payment processing endpoints"

"Test audit trail requirements for financial transactions"
```

## 🛠️ QA Testing Methods

### **Method 1: Interactive Prompt-Based Testing**

```bash
pnpm run qa-generate
```

**Example Session:**
```
📋 Available APIs:
1. geocoding - Google Maps Geocoding API
2. countries - REST Countries API  
3. posts - JSONPlaceholder Posts API

Select an API (1-3): 1

📝 Main testing requirement/prompt: 
> Test address validation for international addresses including edge cases

🏢 Business logic to test (optional): 
> Ensure coordinates are accurate within 100 meters for navigation purposes

🔍 Testing focus areas (comma-separated): 
> unicode characters, postal codes, coordinate accuracy, response time

⚠️ High-risk areas to test (comma-separated): 
> incorrect coordinates for emergency services, privacy data leakage

👤 User scenarios to validate (comma-separated): 
> user enters incomplete address, user searches non-existent location
```

**Output:**
- `qa-tests-geocoding-2025-07-14.test.ts` - Complete test code
- `qa-tests-geocoding-2025-07-14-report.md` - QA analysis report

### **Method 2: Programmatic QA Testing**

```typescript
import { QATestAgent } from './src/agents/QATestAgent'

const qaAgent = new QATestAgent(process.env.OPENAI_API_KEY!)

// Generate tests from business requirements
const results = await qaAgent.generateFromPrompt(
  geocodingAPI,
  "Validate address geocoding for international emergency services",
  {
    businessLogic: "Coordinates must be accurate within 50 meters for emergency dispatch",
    testingFocus: ["accuracy", "response time", "error handling"],
    riskAreas: ["incorrect emergency coordinates", "service downtime"],
    userScenarios: ["ambulance dispatch", "fire department routing"]
  }
)

// Results include:
// - results.scenarios: TestScenario[]
// - results.testCases: string[]
// - results.riskAssessment: string[]
// - results.coverage: string[]
// - results.reasoning: string
```

### **Method 3: Specialized QA Test Types**

#### **Business Scenario Testing**
```typescript
const businessTests = await qaAgent.generateBusinessScenarioTests(endpoint, [
  "User pays with expired credit card",
  "System handles concurrent user registrations", 
  "API processes bulk address validation requests",
  "User cancels transaction mid-process"
])
```

#### **Risk-Based Testing**
```typescript
const riskTests = await qaAgent.generateRiskBasedTests(endpoint, [
  "Data corruption during high load",
  "Security breaches through API endpoints",
  "Service dependencies failing",
  "Database connection pool exhaustion"
])
```

#### **Compliance Testing**
```typescript
const complianceTests = await qaAgent.generateComplianceTests(endpoint, [
  "GDPR data protection compliance",
  "SOX audit trail requirements",
  "HIPAA privacy protections",
  "PCI DSS payment security"
])
```

## 📊 QA Test Generation Examples

### **Example 1: E-commerce Payment API**

**QA Prompt:**
```
"Test the payment processing API to ensure it handles edge cases like 
network timeouts, partial payments, currency conversion errors, and 
fraud detection scenarios while maintaining PCI compliance."
```

**Generated Tests:**
- Payment timeout handling
- Partial payment reversal
- Currency conversion edge cases
- Fraud detection validation
- PCI compliance verification
- Error message sanitization
- Audit trail completeness

### **Example 2: User Authentication API**

**QA Prompt:**
```
"Validate user authentication including password complexity, account 
lockout policies, session management, and security against brute force 
attacks while ensuring accessibility compliance."
```

**Generated Tests:**
- Password strength validation
- Account lockout mechanisms
- Session timeout handling
- Brute force protection
- Accessibility compliance
- Multi-factor authentication
- Password reset security

### **Example 3: File Upload API**

**QA Prompt:**
```
"Test file upload functionality for various file types, sizes, and 
edge cases including malware scanning, virus detection, and ensuring 
uploaded files don't compromise server security."
```

**Generated Tests:**
- File type validation
- Size limit enforcement
- Malware detection
- Virus scanning
- Path traversal prevention
- Storage quota management
- Upload progress tracking

## 🎯 QA-Specific Features

### **1. Risk Assessment**
Every test generation includes risk analysis:
```markdown
### Risk Assessment
- **High Risk**: Incorrect coordinates could delay emergency response
- **Medium Risk**: Unicode character handling may cause data corruption  
- **Low Risk**: Slow response time affects user experience
```

### **2. Test Coverage Analysis**
Comprehensive coverage reporting:
```markdown
### Test Coverage Analysis
- ✅ Happy path scenarios (100%)
- ✅ Error handling (95%)
- ✅ Edge cases (85%)
- ⚠️ Performance testing (60%)
- ❌ Load testing (0% - needs manual setup)
```

### **3. Business Impact Assessment**
Each test includes business context:
```markdown
### Business Impact
- **Critical**: Payment processing failures affect revenue
- **High**: User registration issues impact customer acquisition
- **Medium**: Search performance affects user satisfaction
```

### **4. Compliance Validation**
Built-in compliance checking:
```markdown
### Compliance Requirements Met
- ✅ GDPR data handling validation
- ✅ Input sanitization (security)
- ⚠️ Audit trail logging (partial)
- ❌ Performance SLA validation (manual testing required)
```

## 🔧 Advanced QA Techniques

### **1. Boundary Value Analysis**
```
"Test boundary conditions for user age validation (0, 1, 17, 18, 120, 121) 
and ensure appropriate error handling for out-of-range values."
```

### **2. Equivalence Partitioning**
```
"Validate email address input by testing valid formats (user@domain.com), 
invalid formats (missing @, invalid TLD), and edge cases (unicode domains)."
```

### **3. State Transition Testing**
```
"Test user account states (active, suspended, deleted, locked) and validate 
all possible state transitions and their business rules."
```

### **4. Negative Testing**
```
"Generate negative test cases for payment API including invalid card numbers, 
expired dates, insufficient funds, and malformed request payloads."
```

## 📋 QA Deliverables

Each test generation provides:

### **1. Test Code (`.test.ts`)**
- Executable Vitest test suites
- TypeScript with full type safety
- Environment variable integration
- Comprehensive assertions

### **2. QA Analysis Report (`.md`)**
- Test scenario breakdown
- Risk assessment summary
- Coverage analysis
- Business impact evaluation
- Compliance checklist
- Recommended manual testing

### **3. Test Data Recommendations**
- Sample input data sets
- Edge case examples
- Boundary value suggestions
- Invalid input examples

## 🎉 Benefits for QA Engineers

### **⚡ Speed**
- Generate comprehensive test suites in minutes vs. hours
- No need to write test code from scratch
- Instant coverage analysis

### **🧠 Intelligence**
- AI understands business context and risk areas
- Suggests edge cases you might miss
- Domain-specific test scenarios

### **📊 Comprehensive Coverage**
- Automatic happy path + edge case generation
- Security vulnerability testing
- Performance and scalability considerations

### **🔒 Quality Assurance**
- Built-in compliance checking
- Risk-based test prioritization
- Business impact assessment

### **🔄 Maintainability**
- Generated tests are readable TypeScript
- Easy to modify and extend
- Version control friendly

## 🚀 Getting Started Checklist

- [ ] ✅ **Set up environment**: Ensure OpenAI API key is in `.env`
- [ ] 🎯 **Define test scope**: Identify APIs and business logic to test
- [ ] 📝 **Write QA prompts**: Use natural language to describe requirements
- [ ] 🤖 **Generate tests**: Run `npm run qa-generate` for interactive mode
- [ ] 📊 **Review results**: Analyze generated test code and QA reports
- [ ] 🧪 **Execute tests**: Run `pnpm test` to validate API behavior
- [ ] 🔄 **Iterate**: Refine prompts based on results and add custom scenarios

**Ready to transform your API testing? Start with:**
```bash
pnpm run qa-generate
```

Your testing process will never be the same! 🚀
