import assert from "node:assert/strict";
import test from "node:test";
import { validateInquiry } from "../lib/inquiry-validation.mjs";

const valid = {
  type: "question",
  language: "zh",
  nickname: "Visitor",
  contactMethod: "email",
  contactValue: "visitor@example.com",
  productId: "50053",
  message: "Please tell me more.",
  website: "",
  consent: true,
};

test("accepts a minimal consented enquiry", () => {
  const result = validateInquiry(valid);
  assert.equal(result.ok, true);
  assert.equal(result.data.contactValue, "visitor@example.com");
});

test("rejects missing consent and bot honeypot submissions", () => {
  assert.equal(validateInquiry({ ...valid, consent: false }).ok, false);
  assert.equal(validateInquiry({ ...valid, website: "spam.example" }).ok, false);
});

test("bounds stored text length", () => {
  const result = validateInquiry({ ...valid, message: "x".repeat(2000) });
  assert.equal(result.ok, true);
  assert.equal(result.data.message.length, 1200);
});