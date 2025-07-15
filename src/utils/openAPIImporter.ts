import { Endpoint, Parameter } from '../types'
import fs from 'fs'
import yaml from 'yaml'

interface OpenAPISpec {
  openapi: string
  info: { title: string; version: string }
  servers?: Array<{ url: string }>
  paths: {
    [path: string]: {
      [method: string]: {
        summary?: string
        parameters?: Array<{
          name: string
          in: 'query' | 'path' | 'header'
          required?: boolean
          schema: { type: string; enum?: any[]; minimum?: number; maximum?: number }
        }>
        security?: Array<{ [key: string]: string[] }>
        responses: {
          [status: string]: { description: string; content?: any }
        }
      }
    }
  }
  components?: {
    securitySchemes?: {
      [name: string]: {
        type: 'apiKey' | 'http'
        in?: 'query' | 'header'
        name?: string
      }
    }
  }
}

export class OpenAPIImporter {
  static fromFile(filePath: string): Endpoint[] {
    const content = fs.readFileSync(filePath, 'utf-8')
    const spec: OpenAPISpec = filePath.endsWith('.yaml') || filePath.endsWith('.yml') 
      ? yaml.parse(content) 
      : JSON.parse(content)
    
    return this.convertToEndpoints(spec)
  }

  static fromURL(url: string): Promise<Endpoint[]> {
    return fetch(url)
      .then(response => response.json())
      .then(spec => this.convertToEndpoints(spec))
  }

  private static convertToEndpoints(spec: OpenAPISpec): Endpoint[] {
    const endpoints: Endpoint[] = []
    const baseUrl = spec.servers?.[0]?.url || ''

    Object.entries(spec.paths).forEach(([path, pathMethods]) => {
      Object.entries(pathMethods).forEach(([method, operation]) => {
        const endpoint: Endpoint = {
          name: `${operation.summary || `${method.toUpperCase()} ${path}`}`,
          method: method.toUpperCase() as any,
          url: `${baseUrl}${path}`,
          baseUrl,
          parameters: this.convertParameters(operation.parameters || []),
          responses: Object.entries(operation.responses).map(([status, response]) => ({
            status: parseInt(status),
            contentType: 'application/json',
            schema: response.content || {}
          })),
          authentication: this.extractAuthentication(operation.security, spec.components?.securitySchemes)
        }

        endpoints.push(endpoint)
      })
    })

    return endpoints
  }

  private static convertParameters(parameters: any[]): Parameter[] {
    return parameters
      .filter(param => param.in === 'query' || param.in === 'path' || param.in === 'header')
      .map(param => ({
        name: param.name,
        type: param.schema.type as any,
        required: param.required || param.in === 'path', // Path params are always required
        description: param.description || `${param.in} parameter`,
        validation: {
          enum: param.schema.enum,
          min: param.schema.minimum,
          max: param.schema.maximum
        }
      }))
  }

  private static extractAuthentication(security: any[] = [], securitySchemes: any = {}): any {
    if (!security.length) return undefined

    const firstSecurity = security[0]
    const schemeName = Object.keys(firstSecurity)[0]
    const scheme = securitySchemes[schemeName]

    if (!scheme) return undefined

    return {
      type: scheme.type === 'http' ? 'bearer' : 'api_key',
      location: scheme.in,
      name: scheme.name
    }
  }
}

// Example usage function
export function generateFromOpenAPI(specPath: string): void {
  const endpoints = OpenAPIImporter.fromFile(specPath)
  
  console.log(`📋 Found ${endpoints.length} endpoints in OpenAPI spec:`)
  endpoints.forEach(endpoint => {
    console.log(`  - ${endpoint.method} ${endpoint.url}`)
  })
}
