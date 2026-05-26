/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-landing
 * Base block: hero
 * Source: https://www.conad.it/hey-conad
 * Selector: #rc100-hero-4606449
 * Generated: 2026-05-25
 *
 * UE Model fields:
 *   - image (reference): Hero image
 *   - imageAlt (text): collapsed into image alt attribute
 *   - text (richtext): Heading + description + CTA combined
 *
 * Source structure:
 *   .rt100-hero__right picture img -> image
 *   .rt100-hero__title h1 -> heading (part of text richtext)
 *   .rt100-hero__text -> description (part of text richtext)
 *   .rt100-hero__ctaArea a -> CTA links (part of text richtext)
 */
export default function parse(element, { document }) {
  // Extract image from the right panel
  const image = element.querySelector('.rt100-hero__right img, .rt100-hero__image img, picture img');

  // Extract heading from the title area
  const heading = element.querySelector('.rt100-hero__title h1, .rt100-hero__title h2, .rt100-hero__left h1, .rt100-hero__left h2');

  // Extract description text
  const descriptionEl = element.querySelector('.rt100-hero__text, .rt100-hero__left .rt001-richtext:not(.rt100-hero__title)');

  // Extract CTA links
  const ctaLinks = Array.from(element.querySelectorAll('.rt100-hero__ctaArea a, .rt100-hero__left a.rt100-hero__cta'));

  // Build image cell with field hint
  const imageCell = [];
  if (image) {
    const imageHint = document.createComment(' field:image ');
    const frag = document.createDocumentFragment();
    frag.appendChild(imageHint);
    frag.appendChild(image);
    imageCell.push(frag);
  }

  // Build text cell (richtext: heading + description + CTAs) with field hint
  const textCell = [];
  const textFrag = document.createDocumentFragment();
  const textHint = document.createComment(' field:text ');
  textFrag.appendChild(textHint);

  if (heading) {
    textFrag.appendChild(heading);
  }

  if (descriptionEl) {
    // Extract paragraph content from the richtext container
    const paragraphs = descriptionEl.querySelectorAll('p');
    if (paragraphs.length > 0) {
      paragraphs.forEach((p) => textFrag.appendChild(p));
    } else {
      // If no paragraphs, wrap raw text in a paragraph
      const p = document.createElement('p');
      p.innerHTML = descriptionEl.innerHTML;
      textFrag.appendChild(p);
    }
  }

  if (ctaLinks.length > 0) {
    const ctaP = document.createElement('p');
    ctaLinks.forEach((link) => ctaP.appendChild(link));
    textFrag.appendChild(ctaP);
  }

  textCell.push(textFrag);

  // Build cells array matching UE model: row 1 = image, row 2 = text (richtext)
  const cells = [];
  if (imageCell.length > 0) {
    cells.push(imageCell);
  } else {
    // Image row must exist per xwalk requirements (all rows required)
    cells.push(['']);
  }
  cells.push(textCell);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-landing', cells });
  element.replaceWith(block);
}
