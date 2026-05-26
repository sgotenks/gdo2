/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cta-banner (formerly columns-banner)
 * Resource type: block/v1/block
 * Source: https://www.conad.it/hey-conad
 * Selector: #rc137-strillo-app-429211653
 *
 * Model: single "text" richtext field
 * Output: 3 rows with 1 cell each (icon | title+subtitle | badges)
 * The block CSS handles the 3-cell horizontal layout.
 */
export default function parse(element, { document }) {
  // Cell 1: Icon
  const iconCell = document.createElement('div');
  const iconP = document.createElement('p');
  iconP.textContent = '⬇';
  iconCell.appendChild(iconP);

  // Cell 2: Title + subtitle
  const textCell = document.createElement('div');
  const titleDiv = element.querySelector('.rt137-strillo-app__title, [class*="strillo-app__title"]');
  const textDiv = element.querySelector('.rt137-strillo-app__text, [class*="strillo-app__text"]');
  if (titleDiv) {
    const titleP = titleDiv.querySelector('p') || titleDiv;
    textCell.appendChild(titleP);
  }
  if (textDiv) {
    const textP = textDiv.querySelector('p') || textDiv;
    textCell.appendChild(textP);
  }

  // Cell 3: Store badge links
  const badgeCell = document.createElement('div');
  const ctaLinks = Array.from(element.querySelectorAll('a.rt137-strillo-app__cta, a[class*="strillo-app__cta"]'));
  ctaLinks.forEach((link) => badgeCell.appendChild(link));

  const cells = [
    [iconCell],
    [textCell],
    [badgeCell],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'CTA Banner', cells });
  element.replaceWith(block);
}
