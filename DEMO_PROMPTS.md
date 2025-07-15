# Company Tech Demo: Sample QA Prompts

## 🎯 Demo Script for API Test Framework

### **Demo Flow: 15-20 minutes**

1. **Framework Overview** (2-3 minutes)
2. **Live Demo: Rule-Based vs GPT-4** (5 minutes)
3. **QA Engineer Scenarios** (8-10 minutes)
4. **Business Impact & ROI** (3-5 minutes)
5. **Q&A** (5 minutes)

---

## 🚀 Demo Scenario 1: E-Commerce Payment API

### **Setup:** "Imagine we're testing our payment processing API"

**QA Prompt:**
```
"Test our payment processing API to ensure it handles real-world scenarios like 
expired credit cards, network timeouts, partial payments, currency conversion 
errors, and fraud detection while maintaining PCI DSS compliance."
```

**Additional Details:**
- **Business Logic:** "Payments must be atomic - either fully processed or fully rolled back"
- **Risk Areas:** "Financial loss, compliance violations, customer trust"
- **User Scenarios:** "International customers, mobile payments, subscription renewals"

**Expected Output:** ~12-15 test scenarios including security, compliance, and edge cases

---

## 🛡️ Demo Scenario 2: User Authentication API

### **Setup:** "Testing our core authentication system"

**QA Prompt:**
```
"Validate our user authentication API including password complexity rules, 
account lockout policies, multi-factor authentication, session management, 
and protection against brute force attacks while ensuring accessibility compliance."
```

**Additional Details:**
- **Business Logic:** "Account lockout after 5 failed attempts, session timeout after 30 minutes"
- **Risk Areas:** "Unauthorized access, credential stuffing, account takeover"
- **Focus Areas:** "Security, compliance, user experience, accessibility"

**Expected Output:** ~10-12 test scenarios covering security and user experience

---

## 📊 Demo Scenario 3: Customer Data API (GDPR Focus)

### **Setup:** "Testing our customer data handling for European customers"

**QA Prompt:**
```
"Test our customer data API to ensure GDPR compliance including data portability, 
right to deletion, consent management, data minimization, and cross-border 
transfer restrictions. Validate audit trails and breach notification capabilities."
```

**Additional Details:**
- **Compliance Requirements:** "GDPR, CCPA, data retention policies"
- **Risk Areas:** "Regulatory fines, data breaches, privacy violations"
- **Business Logic:** "Data must be anonymized after 2 years, deletion within 30 days"

**Expected Output:** ~8-10 compliance-focused test scenarios

---

## 🏥 Demo Scenario 4: Healthcare API (High Reliability)

### **Setup:** "Testing a patient record API for a healthcare system"

**QA Prompt:**
```
"Test our patient records API for a healthcare system where downtime means 
life-or-death situations. Validate data integrity, HIPAA compliance, emergency 
access protocols, audit logging, and failover mechanisms. Ensure 99.99% uptime."
```

**Additional Details:**
- **Business Logic:** "Emergency override must work even during system maintenance"
- **Risk Areas:** "Patient safety, data breaches, regulatory violations"
- **User Scenarios:** "Emergency room access, scheduled procedures, insurance verification"

**Expected Output:** ~15-18 test scenarios including reliability and compliance

---

## 🌍 Demo Scenario 5: International Shipping API

### **Setup:** "Testing our global shipping calculation API"

**QA Prompt:**
```
"Test our international shipping API that calculates rates across 190+ countries. 
Validate currency conversion, customs regulations, restricted items, address 
validation, and real-time carrier integration. Handle Brexit, sanctions, and 
trade restrictions."
```

**Additional Details:**
- **Business Logic:** "Restricted items vary by destination country and carrier"
- **Risk Areas:** "Incorrect shipping costs, customs violations, delivery failures"
- **Focus Areas:** "Internationalization, regulatory compliance, data accuracy"

**Expected Output:** ~12-14 test scenarios covering global complexity

---

## ⚡ Quick Demo Prompts (2-3 minutes each)

### **Financial Services:**
```
"Test our loan approval API for bias prevention, fair lending compliance, 
and accurate credit scoring while protecting sensitive financial data."
```

### **IoT Device Management:**
```
"Test our IoT device management API for firmware updates, security patches, 
device authentication, and handling millions of concurrent connections."
```

### **Content Moderation:**
```
"Test our content moderation API for detecting harmful content, false positives, 
multilingual support, and appeals process while maintaining free speech principles."
```

### **Real Estate Platform:**
```
"Test our property listing API for accurate pricing algorithms, image processing, 
location verification, and integration with MLS systems across different markets."
```

---

## 🎭 Live Demo Script

### **Opening (30 seconds)**
> "Today I'll show you how we can transform API testing from a weeks-long manual process 
> to a minutes-long automated process using AI-powered test generation."

### **Framework Demo (2 minutes)**
```bash
# Show the basic framework
pnpm run generate-tests all

# Show GPT-4 enhancement
pnpm run qa-generate
```

### **Live QA Generation (5 minutes)**
**Choose:** Payment API scenario (most relatable to business)

1. **Select API:** Geocoding (simple, visual)
2. **Enter Prompt:** Payment processing scenario
3. **Show Results:** Generated test code + QA report
4. **Run Tests:** Live execution

### **Business Impact (2 minutes)**
> "What used to take our QA team 2-3 days now takes 10 minutes. 
> We went from 5 basic tests to 15 comprehensive scenarios including 
> security, compliance, and edge cases we never thought of."

---

## 📊 Demo Talking Points

### **Before This Framework:**
- ❌ **Manual test writing:** 2-3 days per API
- ❌ **Limited coverage:** Only happy path + basic validation  
- ❌ **Missing edge cases:** Security vulnerabilities discovered in production
- ❌ **No compliance testing:** Regulatory issues found during audits
- ❌ **Inconsistent quality:** Depends on individual QA engineer experience

### **After This Framework:**
- ✅ **Automated generation:** 10-15 minutes per API
- ✅ **Comprehensive coverage:** Happy path, security, compliance, edge cases
- ✅ **AI-powered intelligence:** Discovers scenarios humans miss
- ✅ **Built-in compliance:** GDPR, PCI DSS, HIPAA validation included
- ✅ **Consistent quality:** Every API gets enterprise-grade testing

### **ROI Calculation:**
```
Traditional Approach:
- QA Engineer: $100/hour
- Time per API: 16 hours (2 days)
- Cost per API: $1,600

Framework Approach:  
- Setup time: 15 minutes
- GPT-4 cost: $0.03 per API
- QA review: 1 hour  
- Total cost: ~$100

Savings: $1,500 per API (94% reduction)
```

---

## 🎯 Demo Success Metrics

### **Technical Metrics:**
- **Test Generation Speed:** 5 seconds to 10 minutes
- **Test Coverage Increase:** 200-400% more scenarios
- **Bug Detection:** Find security/compliance issues before production
- **Code Quality:** TypeScript, type-safe, maintainable tests

### **Business Metrics:**
- **Time to Market:** Faster API releases
- **Risk Reduction:** Fewer production incidents
- **Compliance:** Automated regulatory validation
- **Team Productivity:** QA focuses on strategy vs. coding

---

## 🎤 Demo One-Liners

### **Opening Hook:**
> "What if I told you we could generate comprehensive API test suites in 10 minutes 
> that would normally take our QA team 2-3 days to write?"

### **Framework Positioning:**
> "This isn't replacing QA engineers - it's giving them superpowers. They become 
> test architects instead of test coders."

### **Business Value:**
> "We're not just testing APIs faster - we're testing them better. AI finds edge 
> cases and security vulnerabilities that humans typically miss."

### **Technical Credibility:**
> "Built on modern stack: TypeScript, Vitest, GPT-4. Integrates with existing 
> CI/CD. Generates maintainable, readable test code."

### **Closing:**
> "The question isn't whether we can afford to implement this framework - 
> it's whether we can afford NOT to implement it."

---

## 🚀 Interactive Demo Commands

### **Start with Basic Generation:**
```bash
pnpm run generate-tests geocoding
cat src/tests/geocoding.test.ts | head -30
```

### **Show GPT-4 Enhancement:**
```bash
pnpm run qa-generate
# Select: geocoding API
# Prompt: "Test address validation for emergency services dispatch"
```

### **Run the Tests:**
```bash
pnpm test
```

### **Show QA Examples:**
```bash
pnpm run qa-examples
```

---

## 💡 Audience-Specific Variations

### **For Engineering Leadership:**
Focus on: Technical debt reduction, team productivity, code quality

### **For Product Management:**
Focus on: Faster releases, reduced bugs, better user experience

### **For QA Teams:**
Focus on: Enhanced capabilities, strategic work, comprehensive coverage

### **For Security Teams:**
Focus on: Automated vulnerability detection, compliance validation

### **For Executive Leadership:**
Focus on: ROI, risk reduction, competitive advantage

---

## 🎯 Demo Backup Plans

### **If Live Demo Fails:**
- Pre-generated test files ready to show
- Screenshots/videos of successful runs
- Focus on business value and ROI

### **If Questions About Cost:**
- Show ROI calculation
- Compare to manual testing costs
- Emphasize bug prevention value

### **If Questions About AI Reliability:**
- Show fallback to rule-based generation
- Demonstrate human review process
- Highlight AI as enhancement, not replacement

**Remember:** The goal is to show business value, not just technical features!
