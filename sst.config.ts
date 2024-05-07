/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "camilobravo",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      providers: {
        aws: {
          region: "us-east-1",
        },
      }
    };
  },
  async run() {
    new sst.aws.Nextjs("MyWeb", {
      domain: {
        name: $app.stage === "production" ? "camilobravo.com" : "dev.camilobravo.com",
      },
    });
  },
  
});
