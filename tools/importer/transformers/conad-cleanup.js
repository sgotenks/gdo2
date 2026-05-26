/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: conad cleanup
 * Removes non-authorable site chrome from conad.it pages.
 *
 * Selectors validated against captured DOM (migration-work/cleaned.html):
 * - #onetrust-consent-sdk: OneTrust cookie consent banner (line 1883)
 * - .grecaptcha-badge: Google reCAPTCHA widget (line 1866)
 * - access-widget-ui: Accessibility widget elements (lines 4-11)
 * - .acsb-sr-alert: Accessibility screen reader alert (line 2)
 * - .acsb-sr-only: Accessibility screen reader only links (lines 2, 5)
 * - header.rt051-header: Site header with nav (line 14)
 * - footer.rt050-footer: Site footer (line 1723)
 * - #mp-container: Marketing/tracking container (line 1861)
 * - iframe: reCAPTCHA and tracking iframes (lines 1868, 1876, 1879)
 * - link: Stylesheet link elements
 * - noscript: No-script fallback elements
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove cookie consent and widgets that may block parsing
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '.grecaptcha-badge',
      'access-widget-ui',
      '.acsb-sr-alert',
      '.acsb-sr-only',
    ]);
  }
  if (hookName === TransformHook.afterTransform) {
    // Remove non-authorable site chrome
    WebImporter.DOMUtils.remove(element, [
      'header.rt051-header',
      'footer.rt050-footer',
      '#mp-container',
      'iframe',
      'link',
      'noscript',
    ]);

    // Remove tracking pixels and non-content images
    element.querySelectorAll('img').forEach((img) => {
      const src = img.getAttribute('src') || '';
      if (
        src.includes('ad.doubleclick.net')
        || src.includes('as.ad4m.at')
        || src.includes('loader-710d627b5c6523e756d2.gif')
      ) {
        const wrapper = img.closest('picture') || img;
        const parent = wrapper.parentElement;
        wrapper.remove();
        if (parent && parent.tagName === 'P' && !parent.textContent.trim() && !parent.querySelector('*')) {
          parent.remove();
        }
      }
    });
  }
}
