/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-service
 * Base block: columns
 * Source: https://www.conad.it/hey-conad
 * Generated: 2026-05-25
 *
 * Always outputs: image column first, text/CTA column second.
 * The author controls visual layout (image left vs right) via a block class in the Universal Editor.
 */
export default function parse(element, { document }) {
  const isServiceBanner = element.classList.contains('rt104-service-banner');
  const isLancio = element.classList.contains('rt106-lancio');

  let imageCol = [];
  let textCol = [];
  let imagePosition = 'left';

  if (isServiceBanner) {
    const image = element.querySelector('.rt104-service-banner__left img, .rt104-service-banner__image img');
    const title = element.querySelector('.rt104-service-banner__title h2, .rt104-service-banner__title h3');
    const text = element.querySelector('.rt104-service-banner__text');
    const cta = element.querySelector('a.rt104-service-banner__cta, a.rt002-cta');

    if (image) imageCol.push(image);
    if (title) textCol.push(title);
    if (text) {
      const paragraphs = text.querySelectorAll('p');
      paragraphs.forEach((p) => textCol.push(p));
    }
    if (cta) textCol.push(cta);
    imagePosition = 'left';
  } else if (isLancio) {
    const slide = element.querySelector('.rt106-lancio__slide');
    const isReversed = slide && slide.classList.contains('rt106-lancio__slide--variant2');

    const title = element.querySelector('.rt106-lancio__titleText h2, .rt106-lancio__titleText h3');
    const textContainer = element.querySelector('.rt106-lancio__text');
    const cta = element.querySelector('a.rt106-lancio__cta, a.rt002-cta');
    const image = element.querySelector('.rt106-lancio__image img, picture.rt106-lancio__image img');

    if (title) textCol.push(title);
    if (textContainer) {
      const paragraphs = textContainer.querySelectorAll('p');
      paragraphs.forEach((p) => textCol.push(p));
    }
    if (cta) textCol.push(cta);
    if (image) imageCol.push(image);

    imagePosition = isReversed ? 'left' : 'right';
  } else {
    const image = element.querySelector('img');
    const title = element.querySelector('h2, h3');
    const text = element.querySelector('p');
    const cta = element.querySelector('a[href]');

    if (image) imageCol.push(image);
    if (title) textCol.push(title);
    if (text) textCol.push(text);
    if (cta) textCol.push(cta);
    imagePosition = 'left';
  }

  // Always: image first cell, text second cell
  const cells = [[imageCol, textCol]];
  const blockName = imagePosition === 'left' ? 'columns-service (left)' : 'columns-service (right)';
  const block = WebImporter.Blocks.createBlock(document, { name: blockName, cells });
  element.replaceWith(block);
}
