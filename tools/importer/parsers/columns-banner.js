/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-banner
 * Base block: columns
 * Source: https://www.conad.it/hey-conad
 * Selector: #rc137-strillo-app-429211653
 * Description: Compact app-download banner with icon, title/subtitle text, and store badge links.
 *   Column 1: Download icon
 *   Column 2: Title + subtitle
 *   Column 3: Store badge links (Apple Store, Google Play)
 * Note: Columns blocks do NOT require field hint comments (per xwalk hinting rules).
 * Generated: 2026-05-25
 */
export default function parse(element, { document }) {
  // Column 1: Icon element
  const iconSpan = element.querySelector('span.rt137-strillo-app__icon, span[class*="icon"]');
  const col1 = [];
  if (iconSpan) {
    // Represent icon as text content since it's a CSS icon class
    const iconText = document.createElement('p');
    iconText.textContent = '⬇';
    col1.push(iconText);
  }

  // Column 2: Title + subtitle text
  const titleDiv = element.querySelector('.rt137-strillo-app__title, [class*="strillo-app__title"]');
  const textDiv = element.querySelector('.rt137-strillo-app__text, [class*="strillo-app__text"]');
  const col2 = [];
  if (titleDiv) {
    const titleP = titleDiv.querySelector('p');
    if (titleP) {
      col2.push(titleP);
    } else {
      col2.push(titleDiv);
    }
  }
  if (textDiv) {
    const textP = textDiv.querySelector('p');
    if (textP) {
      col2.push(textP);
    } else {
      col2.push(textDiv);
    }
  }

  // Column 3: Store badge links (Apple Store + Google Play)
  const ctaLinks = Array.from(element.querySelectorAll('a.rt137-strillo-app__cta, a[class*="strillo-app__cta"]'));
  const col3 = [];
  ctaLinks.forEach((link) => {
    col3.push(link);
  });

  // Build cells array: single row with 3 columns matching library example
  const cells = [
    [col1, col2, col3],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-banner', cells });
  element.replaceWith(block);
}
