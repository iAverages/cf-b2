# CF-B2

B2 api wrapper built to work with Cloudflare Workers

This is incomplete, many api endpoints have not been implemented

## Usage

```bash
yarn add git+https://github.com/iAverages/cf-b2.git
```

```ts
import { BackblazeB2 } from "cloudflare-b2/src";

interface Env {}

const b2 = new BackblazeB2({
    applicationKeyId: "application key id",
    applicationKey: "application key",
});

export default {
    fetch: async (request: Request, env: Env, ctx: ExecutionContext) => {
        await b2.authorizeAccount();
        return new Response(JSON.stringify(await b2.getUploadUrl("some bucket ID")));
    },

    // We can register this cron handler to keep the b2 auth config
    // updated. The config is valid for 24hrs, best to setup cron
    // for 20-23hrs
    async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
        ctx.waitUntil(b2.handleScheduledAuthorization());
    },
};
```
