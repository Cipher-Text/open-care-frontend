import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

type Tree = { [key: string]: string | Tree };

const load = (name: string): Tree => JSON.parse(readFileSync(new URL(`./${name}.json`, import.meta.url), "utf8"));

function flatten(tree: Tree, prefix = ""): Record<string, string> {
	return Object.entries(tree).reduce<Record<string, string>>((all, [key, value]) => {
		if (typeof value === "string") all[`${prefix}${key}`] = value;
		else Object.assign(all, flatten(value, `${prefix}${key}.`));
		return all;
	}, {});
}

/** The names of the {placeholders} in a message, ignoring ICU plural and number detail. */
const placeholders = (message: string) => [...message.matchAll(/\{(\w+)(?:,|\})/g)].map((m) => m[1]).sort();

const en = flatten(load("en"));
const bn = flatten(load("bn"));

test("Bangla and English have the same keys", () => {
	assert.deepEqual(Object.keys(bn).sort(), Object.keys(en).sort());
});

test("no message is empty", () => {
	for (const [key, value] of [...Object.entries(en), ...Object.entries(bn)]) assert.ok(value.trim().length > 0, key);
});

test("each Bangla message uses the same placeholders as the English one", () => {
	for (const key of Object.keys(en)) {
		if (bn[key] === undefined) continue;
		assert.deepEqual(placeholders(bn[key]), placeholders(en[key]), key);
	}
});
