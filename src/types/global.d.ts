export { };

declare global {
  interface Window {
    shopify: Record<string, any>
  }
  
  interface ImportMeta {
    glob: (pattern: string) => Record<string, () => Promise<any>>;
  }
  
}

