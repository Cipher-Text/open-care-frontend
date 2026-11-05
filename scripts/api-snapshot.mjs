// Refreshes docs/openapi.json from a running backend (OPENAPI_URL, default the local one), then run `npm run api:types`.
// The snapshot is what src/types/api.gen.ts and the contract check in src/types/api-contract.ts are built from.
import { writeFile } from "node:fs/promises";

const url = process.env.OPENAPI_URL ?? "http://localhost:6700/api-docs/public";
const response = await fetch(url);
if (!response.ok) {
	console.error(`Could not read ${url}: ${response.status}`);
	process.exit(1);
}
const document = await response.json();
document.servers = [{ url: "/", description: "Snapshot of the backend API; refresh with npm run api:snapshot" }];
await writeFile(new URL("../docs/openapi.json", import.meta.url), `${JSON.stringify(document, null, 2)}\n`);
console.log(`docs/openapi.json: ${Object.keys(document.paths).length} paths, ${Object.keys(document.components?.schemas ?? {}).length} schemas`);
