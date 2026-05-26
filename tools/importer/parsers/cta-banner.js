/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cta-banner
 * Resource type: block/v1/block
 * Source: https://www.conad.it/hey-conad
 *
 * Model fields: icon (richtext), text (richtext), appleBadge (reference), googleBadge (reference)
 * Output: 4 rows, 1 cell each
 *   Row 1: icon text
 *   Row 2: title + subtitle
 *   Row 3: Apple Store badge image
 *   Row 4: Google Play badge image
 */
export default function parse(element, { document }) {
  // Row 1: Icon
  const iconCell = document.createElement('div');
  const iconP = document.createElement('p');
  iconP.textContent = '⬇';
  iconCell.appendChild(iconP);

  // Row 2: Title + subtitle
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

  // Row 3: Apple Store badge image
  const appleCell = document.createElement('div');
  const ctaLinks = Array.from(element.querySelectorAll('a.rt137-strillo-app__cta, a[class*="strillo-app__cta"]'));
  const appleLink = ctaLinks.find((l) => (l.getAttribute('href') || '').includes('apple'));
  if (appleLink) {
    const appleImg = appleLink.querySelector('img');
    if (appleImg) appleCell.appendChild(appleImg);
  }

  // Row 4: Google Play badge image
  const googleCell = document.createElement('div');
  const googleLink = ctaLinks.find((l) => (l.getAttribute('href') || '').includes('play.google') || (l.getAttribute('href') || '').includes('play.app.goo'));
  if (googleLink) {
    const googleImg = googleLink.querySelector('img');
    if (googleImg) googleCell.appendChild(googleImg);
  }

  const cells = [
    [iconCell],
    [textCell],
    [appleCell],
    [googleCell],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'CTA Banner', cells });
  element.replaceWith(block);
}
