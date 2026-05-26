/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-service
 * Base block: block/v1/block (not columns/v1/columns)
 * Source: https://www.conad.it/hey-conad
 *
 * Model fields: image (reference), imageAlt (text, collapsed), text (richtext), classes (select)
 * Always outputs: image in first cell, text in second cell.
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

  // Build cells: Row 1 = [image cell, text cell]
  // Add field hints for xwalk model mapping
  const imageWrapper = document.createElement('div');
  const imageHint = document.createComment(' field:image ');
  imageWrapper.appendChild(imageHint);
  imageCol.forEach((el) => imageWrapper.appendChild(el));

  const textWrapper = document.createElement('div');
  const textHint = document.createComment(' field:text ');
  textWrapper.appendChild(textHint);
  textCol.forEach((el) => textWrapper.appendChild(el));

  const cells = [[imageWrapper, textWrapper]];
  const blockName = imagePosition === 'left' ? 'Columns Service (left)' : 'Columns Service (right)';
  const block = WebImporter.Blocks.createBlock(document, { name: blockName, cells });
  element.replaceWith(block);
}
