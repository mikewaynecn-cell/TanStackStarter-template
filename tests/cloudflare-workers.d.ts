declare module "cloudflare:workers" {
  export const exports: {
    default: {
      fetch(request: Request): Promise<Response>;
    };
  };
}
