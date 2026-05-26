/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-hey-conad.js
  var import_hey_conad_exports = {};
  __export(import_hey_conad_exports, {
    default: () => import_hey_conad_default
  });

  // tools/importer/parsers/hero-landing.js
  function parse(element, { document }) {
    const image = element.querySelector(".rt100-hero__right img, .rt100-hero__image img, picture img");
    const heading = element.querySelector(".rt100-hero__title h1, .rt100-hero__title h2, .rt100-hero__left h1, .rt100-hero__left h2");
    const descriptionEl = element.querySelector(".rt100-hero__text, .rt100-hero__left .rt001-richtext:not(.rt100-hero__title)");
    const ctaLinks = Array.from(element.querySelectorAll(".rt100-hero__ctaArea a, .rt100-hero__left a.rt100-hero__cta"));
    const imageCell = [];
    if (image) {
      const imageHint = document.createComment(" field:image ");
      const frag = document.createDocumentFragment();
      frag.appendChild(imageHint);
      frag.appendChild(image);
      imageCell.push(frag);
    }
    const textCell = [];
    const textFrag = document.createDocumentFragment();
    const textHint = document.createComment(" field:text ");
    textFrag.appendChild(textHint);
    if (heading) {
      textFrag.appendChild(heading);
    }
    if (descriptionEl) {
      const paragraphs = descriptionEl.querySelectorAll("p");
      if (paragraphs.length > 0) {
        paragraphs.forEach((p) => textFrag.appendChild(p));
      } else {
        const p = document.createElement("p");
        p.innerHTML = descriptionEl.innerHTML;
        textFrag.appendChild(p);
      }
    }
    if (ctaLinks.length > 0) {
      const ctaP = document.createElement("p");
      ctaLinks.forEach((link) => ctaP.appendChild(link));
      textFrag.appendChild(ctaP);
    }
    textCell.push(textFrag);
    const cells = [];
    if (imageCell.length > 0) {
      cells.push(imageCell);
    } else {
      cells.push([""]);
    }
    cells.push(textCell);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-landing", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cta-banner.js
  function parse2(element, { document }) {
    const iconCell = document.createElement("div");
    const iconP = document.createElement("p");
    iconP.textContent = "\u2B07";
    iconCell.appendChild(iconP);
    const textCell = document.createElement("div");
    const titleDiv = element.querySelector('.rt137-strillo-app__title, [class*="strillo-app__title"]');
    const textDiv = element.querySelector('.rt137-strillo-app__text, [class*="strillo-app__text"]');
    if (titleDiv) {
      const titleP = titleDiv.querySelector("p") || titleDiv;
      textCell.appendChild(titleP);
    }
    if (textDiv) {
      const textP = textDiv.querySelector("p") || textDiv;
      textCell.appendChild(textP);
    }
    const badgeCell = document.createElement("div");
    const ctaLinks = Array.from(element.querySelectorAll('a.rt137-strillo-app__cta, a[class*="strillo-app__cta"]'));
    ctaLinks.forEach((link) => badgeCell.appendChild(link));
    const cells = [
      [iconCell],
      [textCell],
      [badgeCell]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "CTA Banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/promo-card.js
  function parse3(element, { document }) {
    const isServiceBanner = element.classList.contains("rt104-service-banner");
    const isLancio = element.classList.contains("rt106-lancio");
    let imageEl = null;
    let textElements = [];
    let imagePosition = "left";
    if (isServiceBanner) {
      imageEl = element.querySelector(".rt104-service-banner__left img, .rt104-service-banner__image img");
      const title = element.querySelector(".rt104-service-banner__title h2, .rt104-service-banner__title h3");
      const text = element.querySelector(".rt104-service-banner__text");
      const cta = element.querySelector("a.rt104-service-banner__cta, a.rt002-cta");
      if (title) textElements.push(title);
      if (text) {
        const paragraphs = text.querySelectorAll("p");
        paragraphs.forEach((p) => textElements.push(p));
      }
      if (cta) textElements.push(cta);
      imagePosition = "left";
    } else if (isLancio) {
      const slide = element.querySelector(".rt106-lancio__slide");
      const isReversed = slide && slide.classList.contains("rt106-lancio__slide--variant2");
      const title = element.querySelector(".rt106-lancio__titleText h2, .rt106-lancio__titleText h3");
      const textContainer = element.querySelector(".rt106-lancio__text");
      const cta = element.querySelector("a.rt106-lancio__cta, a.rt002-cta");
      imageEl = element.querySelector(".rt106-lancio__image img, picture.rt106-lancio__image img");
      if (title) textElements.push(title);
      if (textContainer) {
        const paragraphs = textContainer.querySelectorAll("p");
        paragraphs.forEach((p) => textElements.push(p));
      }
      if (cta) textElements.push(cta);
      imagePosition = isReversed ? "left" : "right";
    } else {
      imageEl = element.querySelector("img");
      const title = element.querySelector("h2, h3");
      const text = element.querySelector("p");
      const cta = element.querySelector("a[href]");
      if (title) textElements.push(title);
      if (text) textElements.push(text);
      if (cta) textElements.push(cta);
      imagePosition = "left";
    }
    const imageCell = document.createElement("div");
    if (imageEl) imageCell.appendChild(imageEl);
    const textCell = document.createElement("div");
    textElements.forEach((el) => textCell.appendChild(el));
    const cells = [
      [imageCell],
      [textCell]
    ];
    const blockName = imagePosition === "left" ? "Promo Card (left)" : "Promo Card (right)";
    const block = WebImporter.Blocks.createBlock(document, { name: blockName, cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/conad-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        ".grecaptcha-badge",
        "access-widget-ui",
        ".acsb-sr-alert",
        ".acsb-sr-only"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header.rt051-header",
        "footer.rt050-footer",
        "#mp-container",
        ".rt117-breadcrumb",
        "iframe",
        "link",
        "noscript"
      ]);
      element.querySelectorAll("img").forEach((img) => {
        const src = img.getAttribute("src") || "";
        if (src.includes("ad.doubleclick.net") || src.includes("as.ad4m.at") || src.includes("loader-710d627b5c6523e756d2.gif")) {
          const wrapper = img.closest("picture") || img;
          const parent = wrapper.parentElement;
          wrapper.remove();
          if (parent && parent.tagName === "P" && !parent.textContent.trim() && !parent.querySelector("*")) {
            parent.remove();
          }
        }
      });
    }
  }

  // tools/importer/transformers/conad-sections.js
  function transform2(hookName, element, payload) {
    if (hookName === "beforeTransform") {
    }
    if (hookName === "afterTransform") {
    }
  }

  // tools/importer/import-hey-conad.js
  var parsers = {
    "hero-landing": parse,
    "cta-banner": parse2,
    "promo-card": parse3
  };
  var PAGE_TEMPLATE = {
    name: "hey-conad",
    description: "Hey Conad landing page - loyalty program or promotional page",
    urls: ["https://www.conad.it/hey-conad"],
    blocks: [
      {
        name: "hero-landing",
        instances: ["#rc100-hero-4606449"]
      },
      {
        name: "cta-banner",
        instances: ["#rc137-strillo-app-429211653"]
      },
      {
        name: "promo-card",
        instances: ["#rc104-service-banner-140342423", "#rc106-lancio-1497915825", "#rc106-lancio-299779392", "#rc106-lancio-2109453761"]
      }
    ],
    sections: [
      { id: "section-1", name: "Hero", selector: "section:has(#rc100-hero-4606449)", style: null, blocks: ["hero-landing"], defaultContent: [] },
      { id: "section-2", name: "App Download Banner", selector: "section:has(#rc137-strillo-app-429211653)", style: null, blocks: ["cta-banner"], defaultContent: [] },
      { id: "section-3", name: "Section Title", selector: "section:has(.rt138-richtext-section)", style: null, blocks: [], defaultContent: [".rt138-richtext-section .rt001-richtext p"] },
      { id: "section-4", name: "HeyConad App Service Banner", selector: "section:has(#rc104-service-banner-140342423)", style: "white", blocks: ["promo-card"], defaultContent: [] },
      { id: "section-5", name: "HeyConad Assicurazioni", selector: "section:has(#rc106-lancio-1497915825)", style: "white", blocks: ["promo-card"], defaultContent: [] },
      { id: "section-6", name: "HeyConad Spesa Online", selector: "section:has(#rc106-lancio-299779392)", style: "white", blocks: ["promo-card"], defaultContent: [] },
      { id: "section-7", name: "HeyConad Viaggi", selector: "section:has(#rc106-lancio-2109453761)", style: "white", blocks: ["promo-card"], defaultContent: [] },
      { id: "section-8", name: "Footnotes", selector: "section:has(#rc1-richtext-298676983)", style: null, blocks: [], defaultContent: ["#rc1-richtext-298676983 p"] }
    ]
  };
  var transformers = [
    transform,
    transform2
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    return pageBlocks;
  }
  function insertSectionBreaks(main, document) {
    const allTables = [...main.querySelectorAll("table")];
    const serviceTables = allTables.filter((table) => {
      const headerCell = table.querySelector("tr:first-child td, tr:first-child th");
      if (!headerCell) return false;
      const name = headerCell.textContent.trim().toLowerCase();
      return name.startsWith("promo card") || name.startsWith("promo-card");
    });
    serviceTables.forEach((table) => {
      const hr = document.createElement("hr");
      table.parentNode.insertBefore(hr, table);
      const metaTable = WebImporter.Blocks.createBlock(document, {
        name: "Section Metadata",
        cells: [["style", "white"]]
      });
      if (table.nextSibling) {
        table.parentNode.insertBefore(metaTable, table.nextSibling);
      } else {
        table.parentNode.appendChild(metaTable);
      }
    });
  }
  var import_hey_conad_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        }
      });
      executeTransformers("afterTransform", main, payload);
      insertSectionBreaks(main, document);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      main.querySelectorAll("img").forEach((img) => {
        const src = img.getAttribute("src") || "";
        if (src.includes("ad.doubleclick.net") || src.includes("as.ad4m.at") || src.includes("loader-710d627b5c6523e756d2")) {
          const wrapper = img.closest("picture") || img;
          const parent = wrapper.parentElement;
          wrapper.remove();
          if (parent && parent.tagName === "P" && !parent.textContent.trim() && !parent.querySelector("*")) {
            parent.remove();
          }
        }
      });
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_hey_conad_exports);
})();
