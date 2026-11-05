import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { loginErrorMessage } from "./login-errors.ts";

describe("login error messages", () => {
	it("a wrong password, as Keycloak says it, is a plain 'incorrect' message", () => {
		const message = loginErrorMessage(400, 'Keycloak client error: 401 UNAUTHORIZED {"error":"invalid_grant","error_description":"Invalid user credentials"}');
		assert.equal(message, "Incorrect username or password.");
	});

	it("a wrong server client secret is not blamed on the person and the raw text is never shown", () => {
		const message = loginErrorMessage(400, 'Keycloak client error: 401 UNAUTHORIZED {"error":"unauthorized_client","error_description":"Invalid client or Invalid client credentials"}');
		assert.match(message, /not available right now/);
		assert.ok(!message.includes("unauthorized_client"));
		assert.ok(!message.toLowerCase().includes("credentials"));
	});

	it("no answer or a server failure says the service could not be reached", () => {
		assert.match(loginErrorMessage(null), /could not reach/);
		assert.match(loginErrorMessage(502, "bad gateway"), /could not reach/);
	});

	it("too many attempts and a disabled account have their own messages", () => {
		assert.match(loginErrorMessage(429), /Too many attempts/);
		assert.match(loginErrorMessage(400, "invalid_grant Account temporarily disabled"), /Too many attempts/);
		assert.match(loginErrorMessage(400, "invalid_grant Account disabled"), /disabled/);
		assert.match(loginErrorMessage(400, "invalid_grant Account is not fully set up"), /one more step/);
	});

	it("any other refusal of the credentials reads as incorrect, anything else as a general failure", () => {
		assert.equal(loginErrorMessage(401), "Incorrect username or password.");
		assert.equal(loginErrorMessage(403), "Incorrect username or password.");
		assert.equal(loginErrorMessage(418), "Sign-in did not work. Please try again.");
	});
});
