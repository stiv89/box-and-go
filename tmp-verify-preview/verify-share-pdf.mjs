import pkg from "/tmp/pw-bng/node_modules/playwright/index.js";
const { chromium } = pkg;
import { readFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = dirname(fileURLToPath(import.meta.url));
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({
  channel: "chrome",
  headless: true,
});
const context = await browser.newContext({
  acceptDownloads: true,
  permissions: ["clipboard-read", "clipboard-write"],
  viewport: { width: 1280, height: 900 },
});
const page = await context.newPage();
page.setDefaultTimeout(45000);

try {
  page.on("console", (msg) => {
    if (msg.type() === "error") console.log("PAGE_ERR", msg.text());
  });
  page.on("pageerror", (err) => console.log("PAGE_THROW", err.message));

  await page.goto("http://localhost:3000/builder", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(800);

  for (let i = 0; i < 3; i += 1) {
    await page.getByRole("button", { name: "Continue" }).click();
    await page.waitForTimeout(250);
  }

  await page.getByText("Production tools").click();
  await page.getByRole("button", { name: /Load demo order/ }).click();
  await page.waitForTimeout(400);

  await page.getByRole("button", { name: "Share for approval" }).click();
  await page.getByRole("heading", { name: "Share for approval" }).waitFor();
  await page.getByTestId("share-copy").waitFor();
  await page.getByTestId("share-download").waitFor();
  await page.locator(".bng-proof").waitFor({ timeout: 20000 });

  const layout = await page.evaluate(() => {
    const heading = document.querySelector("h2");
    const toolbar = document.querySelector('[role="toolbar"][aria-label="Share for approval"]');
    const copy = document.querySelector('[data-testid="share-copy"]');
    const download = document.querySelector('[data-testid="share-download"]');
    const native = document.querySelector('[data-testid="share-native"]');
    if (!heading || !toolbar || !copy || !download) {
      return { ok: false };
    }
    const h = heading.getBoundingClientRect();
    const t = toolbar.getBoundingClientRect();
    const parent = heading.parentElement?.parentElement;
    const parentDisplay = parent ? getComputedStyle(parent).display : "";
    return {
      ok: true,
      labels: [copy.textContent?.trim(), native?.textContent?.trim() ?? null, download.textContent?.trim()],
      headingTop: Math.round(h.top),
      toolbarTop: Math.round(t.top),
      sameVisualRow: Math.abs(h.top - t.top) < 96,
      parentDisplay,
    };
  });

  await page.getByTestId("share-copy").click();
  await page.waitForTimeout(400);
  const clipboard = await page.evaluate(() => navigator.clipboard.readText());

  const [download] = await Promise.all([
    page.waitForEvent("download", { timeout: 90000 }),
    page.getByTestId("share-download").click(),
  ]);

  const suggested = download.suggestedFilename();
  const savePath = join(outDir, suggested || "box-and-go-proof.pdf");
  await download.saveAs(savePath);
  const bytes = readFileSync(savePath);
  const header = bytes.subarray(0, 5).toString("utf8");

  console.log(
    JSON.stringify(
      {
        layout,
        clipboardHasBuilderQuery: clipboard.includes("/builder?c="),
        clipboardSample: clipboard.slice(0, 96),
        suggested,
        header,
        size: bytes.length,
      },
      null,
      2,
    ),
  );

  if (!layout.ok || !layout.sameVisualRow) throw new Error("toolbar not on the heading row");
  if (!clipboard.includes("/builder?c=")) throw new Error("clipboard missing /builder?c=");
  if (!suggested.endsWith(".pdf")) throw new Error(`expected .pdf, got ${suggested}`);
  if (header !== "%PDF-") throw new Error(`expected %PDF- header, got ${JSON.stringify(header)}`);
} finally {
  await browser.close();
}
