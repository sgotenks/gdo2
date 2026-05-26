/* eslint-disable */
/* global WebImporter */

import heroLandingParser from './parsers/hero-landing.js';
import columnsBannerParser from './parsers/columns-banner.js';
import promoCardParser from './parsers/promo-card.js';

import conadCleanupTransformer from './transformers/conad-cleanup.js';
import conadSectionsTransformer from './transformers/conad-sections.js';

const parsers = {
  'hero-landing': heroLandingParser,
  'columns-banner': columnsBannerParser,
  'promo-card': promoCardParser,
};

const PAGE_TEMPLATE = {
  name: 'hey-conad',
  description: 'Hey Conad landing page - loyalty program or promotional page',
  urls: ['https://www.conad.it/hey-conad'],
  blocks: [
    {
      name: 'hero-landing',
      instances: ['#rc100-hero-4606449'],
    },
    {
      name: 'columns-banner',
      instances: ['#rc137-strillo-app-429211653'],
    },
    {
      name: 'promo-card',
      instances: ['#rc104-service-banner-140342423', '#rc106-lancio-1497915825', '#rc106-lancio-299779392', '#rc106-lancio-2109453761'],
    },
  ],
  sections: [
    { id: 'section-1', name: 'Hero', selector: 'section:has(#rc100-hero-4606449)', style: null, blocks: ['hero-landing'], defaultContent: [] },
    { id: 'section-2', name: 'App Download Banner', selector: 'section:has(#rc137-strillo-app-429211653)', style: null, blocks: ['columns-banner'], defaultContent: [] },
    { id: 'section-3', name: 'Section Title', selector: 'section:has(.rt138-richtext-section)', style: null, blocks: [], defaultContent: ['.rt138-richtext-section .rt001-richtext p'] },
    { id: 'section-4', name: 'HeyConad App Service Banner', selector: 'section:has(#rc104-service-banner-140342423)', style: 'white', blocks: ['promo-card'], defaultContent: [] },
    { id: 'section-5', name: 'HeyConad Assicurazioni', selector: 'section:has(#rc106-lancio-1497915825)', style: 'white', blocks: ['promo-card'], defaultContent: [] },
    { id: 'section-6', name: 'HeyConad Spesa Online', selector: 'section:has(#rc106-lancio-299779392)', style: 'white', blocks: ['promo-card'], defaultContent: [] },
    { id: 'section-7', name: 'HeyConad Viaggi', selector: 'section:has(#rc106-lancio-2109453761)', style: 'white', blocks: ['promo-card'], defaultContent: [] },
    { id: 'section-8', name: 'Footnotes', selector: 'section:has(#rc1-richtext-298676983)', style: null, blocks: [], defaultContent: ['#rc1-richtext-298676983 p'] },
  ],
};

const transformers = [
  conadCleanupTransformer,
  conadSectionsTransformer,
];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
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
          section: blockDef.section || null,
        });
      });
    });
  });
  return pageBlocks;
}

/**
 * Insert section breaks between block tables after parsers have run.
 * Each promo-card block gets its own section with Section Metadata.
 * <hr> elements as direct children of main act as section dividers.
 */
function insertSectionBreaks(main, document) {
  // Find all promo-card block tables
  const allTables = [...main.querySelectorAll('table')];
  const serviceTables = allTables.filter((table) => {
    const headerCell = table.querySelector('tr:first-child td, tr:first-child th');
    if (!headerCell) return false;
    const name = headerCell.textContent.trim().toLowerCase();
    return name.startsWith('promo card') || name.startsWith('promo-card');
  });

  // For each promo-card table, ensure it's in its own section
  serviceTables.forEach((table) => {
    // Insert <hr> before this block to start a new section
    const hr = document.createElement('hr');
    table.parentNode.insertBefore(hr, table);

    // Add Section Metadata after this block (still in the same section)
    const metaTable = WebImporter.Blocks.createBlock(document, {
      name: 'Section Metadata',
      cells: [['style', 'white']],
    });
    // Insert Section Metadata after the block table
    if (table.nextSibling) {
      table.parentNode.insertBefore(metaTable, table.nextSibling);
    } else {
      table.parentNode.appendChild(metaTable);
    }
  });
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

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

    executeTransformers('afterTransform', main, payload);

    // Insert section breaks so each promo-card block is in its own section
    insertSectionBreaks(main, document);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // Remove tracking pixels and non-content images (after URL resolution)
    main.querySelectorAll('img').forEach((img) => {
      const src = img.getAttribute('src') || '';
      if (
        src.includes('ad.doubleclick.net')
        || src.includes('as.ad4m.at')
        || src.includes('loader-710d627b5c6523e756d2')
      ) {
        const wrapper = img.closest('picture') || img;
        const parent = wrapper.parentElement;
        wrapper.remove();
        if (parent && parent.tagName === 'P' && !parent.textContent.trim() && !parent.querySelector('*')) {
          parent.remove();
        }
      }
    });

    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
