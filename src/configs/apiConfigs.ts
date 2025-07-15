import { Endpoint } from '../types'

// Google Maps Geocoding API Configuration
export const geocodingAPI: Endpoint = {
  name: 'Google Maps Geocoding API',
  method: 'GET',
  url: 'https://maps.googleapis.com/maps/api/geocode/json',
  parameters: [
    {
      name: 'address',
      type: 'string',
      required: true,
      description: 'The street address to geocode',
      example: '1600 Amphitheatre Parkway, Mountain View, CA'
    },
    {
      name: 'key',
      type: 'string',
      required: true,
      description: 'Your application API key'
    },
    {
      name: 'language',
      type: 'string',
      required: false,
      description: 'Language for results',
      validation: {
        enum: ['en', 'es', 'fr', 'de', 'ja', 'ko']
      }
    },
    {
      name: 'region',
      type: 'string',
      required: false,
      description: 'Region code for biasing',
      validation: {
        pattern: '^[A-Z]{2}$'
      }
    }
  ],
  authentication: {
    type: 'api_key',
    location: 'query',
    name: 'key'
  },
  responses: [
    { status: 200, contentType: 'application/json', schema: {} },
    { status: 400, contentType: 'application/json', schema: {} },
    { status: 401, contentType: 'application/json', schema: {} }
  ],
  testScenarios: [
    {
      name: 'should handle international addresses',
      description: 'Tests geocoding of non-English addresses',
      input: { address: '北京市', key: 'PLACEHOLDER' },
      expected: { status: 200, contentType: 'application/json', schema: {} },
      tags: ['international']
    }
  ]
}

// REST Countries API Configuration
export const countriesAPI: Endpoint = {
  name: 'REST Countries API',
  method: 'GET',
  url: 'https://restcountries.com/v3.1/name',
  baseUrl: 'https://restcountries.com/v3.1',
  parameters: [
    {
      name: 'name',
      type: 'string',
      required: true,
      description: 'Country name to search',
      example: 'united states'
    },
    {
      name: 'fullText',
      type: 'boolean',
      required: false,
      description: 'Whether to match full name only'
    }
  ],
  responses: [
    { status: 200, contentType: 'application/json', schema: {} },
    { status: 404, contentType: 'application/json', schema: {} }
  ]
}

// JSONPlaceholder Posts API Configuration
export const postsAPI: Endpoint = {
  name: 'JSONPlaceholder Posts API',
  method: 'GET',
  url: 'https://jsonplaceholder.typicode.com/posts',
  parameters: [
    {
      name: 'userId',
      type: 'number',
      required: false,
      description: 'Filter posts by user ID',
      validation: { min: 1, max: 10 }
    },
    {
      name: '_limit',
      type: 'number',
      required: false,
      description: 'Limit number of results',
      validation: { min: 1, max: 100 }
    }
  ],
  responses: [
    { status: 200, contentType: 'application/json', schema: {} }
  ]
}
