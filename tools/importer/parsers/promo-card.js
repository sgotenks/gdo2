/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-service
 * Resource type: block/v1/block
 * Source: https://www.conad.it/hey-conad
 *
 * Model fields: image (reference), imageAlt (collapsed), text (richtext), classes (select)
 * Output: 2 rows, 1 cell each — Row 1: image, Row 2: text (richtext with heading + paragraphs + CTA)
 * imageAlt is collapsed (derived from img alt attribute, no dedicated row).
 */
export default function parse(element, { document }) {
  const isServiceBanner = element.classList.contains('rt104-service-banner');
  const isLancio = element.classList.contains('rt106-lancio');

  let imageEl = null;
  let textElements = [];
  let imagePosition = 'left';

  if (isServiceBanner) {
    imageEl = element.querySelector('.rt104-service-banner__left img, .rt104-service-banner__image img');
    const title = element.querySelector('.rt104-service-banner__title h2, .rt104-service-banner__title h3');
    const text = element.querySelector('.rt104-service-banner__text');
    const cta = element.querySelector('a.rt104-service-banner__cta, a.rt002-cta');

    if (title) textElements.push(title);
    if (text) {
      const paragraphs = text.querySelectorAll('p');
      paragraphs.forEach((p) => textElements.push(p));
    }
    if (cta) textElements.push(cta);
    imagePosition = 'left';
  } else if (isLancio) {
    const slide = element.querySelector('.rt106-lancio__slide');
    const isReversed = slide && slide.classList.contains('rt106-lancio__slide--variant2');

    const title = element.querySelector('.rt106-lancio__titleText h2, .rt106-lancio__titleText h3');
    const textContainer = element.querySelector('.rt106-lancio__text');
    const cta = element.querySelector('a.rt106-lancio__cta, a.rt002-cta');
    imageEl = element.querySelector('.rt106-lancio__image img, picture.rt106-lancio__image img');

    if (title) textElements.push(title);
    if (textContainer) {
      const paragraphs = textContainer.querySelectorAll('p');
      paragraphs.forEach((p) => textElements.push(p));
    }
    if (cta) textElements.push(cta);
    imagePosition = isReversed ? 'left' : 'right';
  } else {
    imageEl = element.querySelector('img');
    const title = element.querySelector('h2, h3');
    const text = element.querySelector('p');
    const cta = element.querySelector('a[href]');

    if (title) textElements.push(title);
    if (text) textElements.push(text);
    if (cta) textElements.push(cta);
    imagePosition = 'left';
  }

  // Build cells as separate rows (one field per row for block/v1/block)
  // Row 1: image field
  const imageCell = document.createElement('div');
  if (imageEl) imageCell.appendChild(imageEl);

  // Row 2: text field (richtext containing heading + description + CTA)
  const textCell = document.createElement('div');
  textElements.forEach((el) => textCell.appendChild(el));

  // Two rows, one cell each → md2jcr maps row1 → image field, row2 → text field
  const cells = [
    [imageCell],
    [textCell],
  ];

  const blockName = imagePosition === 'left' ? 'Promo Card (left)' : 'Promo Card (right)';
  const block = WebImporter.Blocks.createBlock(document, { name: blockName, cells });
  element.replaceWith(block);
}
