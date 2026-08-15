import assert from "node:assert/strict";
import { access, readFile, stat } from "node:fs/promises";
import test from "node:test";

async function sourceBundle() {
  const paths = [
    "../app/page.tsx",
    "../app/layout.tsx",
    "../app/InquiryForm.tsx",
    "../app/ChatGuide.tsx",
    "../lib/products.ts",
  ];
  const files = await Promise.all(paths.map((path) => readFile(new URL(path, import.meta.url), "utf8")));
  return files.join("\n");
}

test("contains bilingual brand, catalog and private enquiry content", async () => {
  const source = await sourceBundle();
  assert.match(source, /力曼小姐/);
  assert.match(source, /Ms Riman/);
  assert.match(source, /产品资料库/);
  assert.match(source, /PRODUCT LIBRARY/);
  assert.match(source, /ICD Dermatology First/);
  assert.match(source, /Botalab Deserticola Plus Shampoo/);
  assert.match(source, /安全咨询与预订/);
});

test("keeps official purchasing and the approved contact email", async () => {
  const source = await sourceBundle();
  assert.match(source, /mall\.riman\.com\/GAOLINZHI\/home/);
  assert.match(source, /linzhiatwork@gmail\.com/);
  assert.match(source, /官方 RIMAN 商城/);
  assert.match(source, /className="header-cta" href="#inquiry"/);
});

test("embeds both customer videos in the hero", async () => {
  const source = await sourceBundle();
  assert.match(source, /\/videos\/riman-story-1\.mp4/);
  assert.match(source, /\/videos\/riman-story-2\.mp4/);
  assert.doesNotMatch(source, /heroPanelTitle/);
});

test("shows all three team contact channels", async () => {
  const source = await sourceBundle();
  assert.match(source, /\/contact\/amanda-wechat\.jpg/);
  assert.match(source, /\/contact\/amanda-whatsapp\.png/);
  assert.match(source, /\/contact\/amanda-wecom\.jpg/);
  assert.match(source, /团队联系方式/);
  assert.match(source, /TEAM CONTACT/);

  const assets = [
    "../public/contact/amanda-wechat.jpg",
    "../public/contact/amanda-whatsapp.png",
    "../public/contact/amanda-wecom.jpg",
  ];

  for (const asset of assets) {
    const details = await stat(new URL(asset, import.meta.url));
    assert.ok(details.size > 0, `${asset} must not be empty`);
  }
});

test("does not publish personal payment, phone or old-brand details", async () => {
  const source = await sourceBundle();
  assert.doesNotMatch(source, /wa\.me\/65\d{8}/);
  assert.doesNotMatch(source, /\+65\s+\d{4}\s+\d{4}/);
  assert.doesNotMatch(source, new RegExp("Sal" + "ly", "i"));
  assert.match(source, /本站不收款/);
  assert.doesNotMatch(source, /A public brand with minimal personal exposure/);
  assert.doesNotMatch(source, /Cloud hosted/);
  assert.doesNotMatch(source, /No personal PayNow/);
});

test("production artifact contains the database migration", async () => {
  await access(new URL("../dist/server/index.js", import.meta.url));
  await access(new URL("../dist/.openai/hosting.json", import.meta.url));
  await access(new URL("../dist/.openai/drizzle/0000_funny_frank_castle.sql", import.meta.url));
});
