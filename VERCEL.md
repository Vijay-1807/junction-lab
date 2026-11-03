# Deploy the full app to Vercel

The UI and simulation backend deploy together. Do not upload only the generated HTML: it requires `/api/simulate` to calculate results.

1. Import the public `Vijay-1807/junction-lab` GitHub repository into Vercel.
2. Keep the repository root as the Root Directory and select **Other** if asked for a framework.
3. The tracked `vercel.json` sets the build command to `node scripts/build-vercel.mjs` and output directory to `public`.
4. Use Node.js 22.x. There are no dependencies, API keys or environment variables to configure.
5. Deploy when ready. Then open `/api/health` and run the guided flyover comparison in the app.

Three Node.js functions under `api/` use Vercel's Web-standard `fetch` export and call the same backend handler as the existing Worker deployment. The static build writes only the UI into `public/index.html`, so the raw session log and source documents are not public web assets.

Local verification:

```sh
npm run build:vercel
npm run build
npm test
```

The adapter and static output are tested locally. A Vercel-hosted deployment has not been performed in this session, at the applicant's request. No claim of successful Vercel hosting is made before that step.

Official references: [Node.js functions](https://vercel.com/docs/functions/runtimes/node-js), [Vercel configuration](https://vercel.com/docs/project-configuration/vercel-json).
