import { RemixSite, StackContext } from "sst/constructs";

export function MainStack({ stack }: StackContext) {

  // Create a Remix site
  const site = new RemixSite(stack, "RemixSite", {
    path: "packages/frontend",
    customDomain: {
      domainName: "camilobravo.com",
      domainAlias: "www.camilobravo.com",
    },
    environment: {
      REGION: stack.region,
    },
  });

  stack.addOutputs({
    SiteURL: site.url || "http://localhost:3000",
  });
}
