# Core APIs Being Tested

This repository focuses on testing **3 core REST APIs** with comprehensive automated test generation.

## 🗺️ Google Maps Geocoding API

**Endpoint:** `https://maps.googleapis.com/maps/api/geocode/json`
- **Purpose:** Address validation and geocoding services
- **Authentication:** API Key required
- **Test File:** `src/tests/geocoding.test.ts`
- **Business Use Cases:** 
  - Delivery address validation
  - Location-based services
  - International address handling

## 🌍 REST Countries API

**Endpoint:** `https://restcountries.com/v3.1/name`
- **Purpose:** Country information and data lookup
- **Authentication:** None required
- **Test File:** `src/tests/countries.test.ts`  
- **Business Use Cases:**
  - International business operations
  - Shipping restrictions
  - Compliance reporting

## 📝 JSONPlaceholder Posts API

**Endpoint:** `https://jsonplaceholder.typicode.com/posts`
- **Purpose:** Social media posts and content management
- **Authentication:** None required
- **Test File:** `src/tests/posts.test.ts`
- **Business Use Cases:**
  - Content management systems
  - Social media platforms
  - User-generated content

## 🚀 Getting Started

```bash
# Generate tests for all APIs
pnpm run generate-tests all

# Generate tests for specific API
pnpm run generate-tests geocoding
pnpm run generate-tests countries  
pnpm run generate-tests posts

# Run all tests
pnpm test

# AI-enhanced test generation
pnpm run qa-generate
```

## 📁 Repository Structure

The repository has been cleaned to focus only on these 3 core APIs:
- All test files are in `src/tests/` directory
- API configurations are in `src/configs/apiConfigs.ts`
- Demo prompts are focused on these APIs in `DEMO_PROMPTS.md`
- Framework documentation covers these APIs in `FRAMEWORK_GUIDE.md`

No extra APIs, demo files, or obsolete configurations remain.
