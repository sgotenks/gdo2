/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: conad sections
 * Section breaks and Section Metadata are handled directly in the import script
 * after parsers run, since parsers replace source elements and invalidate selectors.
 */
export default function transform(hookName, element, payload) {
  if (hookName === 'beforeTransform') {
    // Section logic moved to import script post-parsing phase
  }
  if (hookName === 'afterTransform') {
    // Section logic moved to import script post-parsing phase
  }
}
