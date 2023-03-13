import { RemixSite, StackContext } from "sst/constructs";

export function MainStack({ stack }: StackContext) {

  // Create a Remix site
  const site = new RemixSite(stack, "RemixSite", {
    path: "packages/frontend",
    customDomain: {
      domainName: stack.stage === "prod" ? "camilobravo.com" : `${stack.stage}.camilobravo.com`,
      domainAlias: stack.stage === "prod" ? "www.camilobravo.com" : undefined,
    },
    environment: {
      REGION: stack.region,
    },
  });

  stack.addOutputs({
    SiteURL: site.url || "http://localhost:3000",
  });
}
