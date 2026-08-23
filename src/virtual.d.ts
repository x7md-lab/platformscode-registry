declare module "virtual:mdx-usage" {
  const usage: Record<string, string>
  export default usage
}

declare module "virtual:api-docs" {
  type ApiDoc = { en: string | null; ar: string | null }
  type ApiProp = {
    name: string
    type: string
    optional: boolean
    default: string | null
    doc: ApiDoc
  }
  type ApiPart = {
    name: string
    doc: ApiDoc
    inherits: string[]
    props: ApiProp[]
  }
  const api: Record<string, ApiPart[]>
  export default api
}
