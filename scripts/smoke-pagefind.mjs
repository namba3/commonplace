import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { runInNewContext } from "node:vm";

const site = path.resolve(process.argv[2] ?? "book");
const mimeTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json"],
  [".css", "text/css; charset=utf-8"],
]);

const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    const pagesPrefix = pathname.startsWith("/commonplace/") ? "/commonplace" : "";
    let file = path.resolve(site, `.${pathname.slice(pagesPrefix.length)}`);
    assert(file === site || file.startsWith(`${site}${path.sep}`), `path escaped site root: ${pathname}`);
    let metadata = await stat(file);
    if (metadata.isDirectory()) {
      file = path.join(file, "index.html");
      metadata = await stat(file);
    }
    assert(metadata.isFile(), `not a file: ${pathname}`);
    response.writeHead(200, { "content-type": mimeTypes.get(path.extname(file)) ?? "application/octet-stream" });
    response.end(await readFile(file));
  } catch {
    response.writeHead(404);
    response.end("Not found");
  }
});

async function assertResultUrl(url) {
  const response = await fetch(url);
  assert.equal(response.status, 200, `result link did not resolve: ${url}`);
  const fragment = decodeURIComponent(new URL(url).hash.slice(1));
  if (fragment) {
    const source = await response.text();
    const escaped = fragment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    assert(new RegExp(`\\bid=([\"'])${escaped}\\1`).test(source), `result heading does not exist: ${url}`);
  }
}

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
try {
  const { port } = server.address();
  const basePath = `http://127.0.0.1:${port}/commonplace/pagefind/`;
  const pagefindUrl = pathToFileURL(path.join(site, "pagefind", "pagefind.js"));
  const pagefind = await import(pagefindUrl.href);

  const initializerName = (await readdir(site)).find((name) => /^pagefind-init-.*\.js$/.test(name));
  assert(initializerName, "generated mdBook Pagefind initializer is missing");
  const initializer = await readFile(path.join(site, initializerName), "utf8");
  for (const [servedPath, expectedBase] of [["/pagefind-init.js", "/"], ["/commonplace/pagefind-init.js", "/commonplace/"]]) {
    const elements = new Map();
    class FakeElement {
      constructor(tagName) {
        this.tagName = tagName;
        this.attributes = {};
        this.children = [];
        this.classList = { contains: () => false };
      }
      setAttribute(name, value) { this.attributes[name] = value; }
      removeAttribute(name) { delete this.attributes[name]; }
      append(...children) { this.children.push(...children); }
      querySelector() { return null; }
    }
    const main = new FakeElement("main");
    const toolbar = new FakeElement("div");
    const body = new FakeElement("body");
    const head = new FakeElement("head");
    const root = new FakeElement("html");
    class TestMutationObserver { observe() {} }
    const context = {
      document: {
        currentScript: { src: `http://127.0.0.1:${port}${servedPath}` },
        body,
        head,
        documentElement: root,
        querySelector(selector) {
          return selector === "main" ? main : selector === "#mdbook-menu-bar .left-buttons" ? toolbar : null;
        },
        createElement(tagName) {
          const element = new FakeElement(tagName);
          elements.set(tagName, element);
          return element;
        },
      },
      location: { href: `http://127.0.0.1:${port}${servedPath}` },
      fetch: async () => ({ ok: true }),
      MutationObserver: TestMutationObserver,
      URL,
      console,
    };
    runInNewContext(initializer, context);
    await new Promise((resolve) => setImmediate(resolve));
    const config = body.children.find((element) => element.tagName === "pagefind-config");
    assert.equal(config?.attributes["base-url"], expectedBase, `wrong Pagefind base URL at ${servedPath}`);
    assert.equal(config?.attributes["bundle-path"], `${expectedBase}pagefind/`, `wrong Pagefind bundle path at ${servedPath}`);
    assert.equal(main.attributes["data-pagefind-body"], "", `article body not marked at ${servedPath}`);
    assert(toolbar.children.some((element) => element.tagName === "pagefind-modal-trigger"), `search trigger missing at ${servedPath}`);
    assert(head.children.some((element) => element.href?.includes(`${expectedBase}pagefind/pagefind-component-ui.css`)), `component CSS path wrong at ${servedPath}`);
  }
  console.log("Pagefind UI and base URL resolve at / (mdbook serve) and /commonplace/ (Pages)");

  const instance = pagefind.createInstance({ basePath });
  await instance.init();

  const queries = [
    "深層学習",
    "画像生成",
    "Transformer",
    "Rust",
    "ライフタイム",
    "Deep Learning",
    "Rust 所有権",
    "Transformer 多様体",
  ];
  for (const query of queries) {
    const results = (await instance.search(query)).results;
    assert(results.length > 0, `no results for: ${query}`);
    const pages = await Promise.all(results.map((result) => result.data()));
    const urls = pages.map((page) => page.url);
    assert.equal(new Set(urls).size, urls.length, `duplicate result URLs for: ${query}`);
    assert(urls.every((url) => new URL(url).pathname.startsWith("/commonplace/")), `bad result URL for: ${query}`);
    assert(urls.every((url) => !url.endsWith("/print.html")), `print.html indexed for: ${query}`);
    assert(pages.every((page) => page.meta?.title), `missing result title for: ${query}`);
    assert(pages.some((page) => page.excerpt.includes("<mark>")), `no highlighted excerpt for: ${query}`);
    await Promise.all(pages.map((page) => assertResultUrl(page.url)));
    await Promise.all(pages.flatMap((page) => page.sub_results.map((result) => assertResultUrl(result.url))));
    console.log(`${query}: ${results.length} results`);
  }
  const upper = (await instance.search("Transformer")).results.length;
  const lower = (await instance.search("transformer")).results.length;
  assert.equal(lower, upper, "English search should ignore letter case");
  console.log("transformer: case-insensitive result count matches Transformer");
  assert.equal((await instance.search("🛸🛸🛸")).results.length, 0, "unexpected results for an absent term");
  console.log("no-match query: zero results");

  const localInstance = pagefind.createInstance({ basePath: `http://127.0.0.1:${port}/pagefind/` });
  await localInstance.init();
  const localPage = await (await localInstance.search("深層学習")).results[0].data();
  assert(new URL(localPage.url).pathname.startsWith("/ai/"), `local result URL did not use root paths: ${localPage.url}`);
  await assertResultUrl(localPage.url);
  console.log(`mdbook serve result URL: ${new URL(localPage.url).pathname}`);
} finally {
  await new Promise((resolve) => server.close(resolve));
}
