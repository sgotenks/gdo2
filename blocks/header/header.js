import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 900px)');

function closeAllDropdowns(nav) {
  nav.querySelectorAll('.nav-item.is-open').forEach((item) => {
    item.classList.remove('is-open');
    const link = item.querySelector(':scope > a');
    if (link) link.setAttribute('aria-expanded', 'false');
  });
}

function toggleMenu(nav, forceExpanded = null) {
  const expanded = forceExpanded !== null
    ? !forceExpanded
    : nav.getAttribute('aria-expanded') === 'true';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  document.body.style.overflowY = expanded ? '' : 'hidden';
}

function buildTopbar(section) {
  const topbar = document.createElement('div');
  topbar.className = 'nav-topbar';
  const storeLink = section.querySelector('p a');
  if (storeLink) {
    const store = document.createElement('div');
    store.className = 'nav-store-locator';
    store.appendChild(storeLink.cloneNode(true));
    topbar.appendChild(store);
  }
  const serviceList = section.querySelector('ul');
  if (serviceList) {
    const services = document.createElement('div');
    services.className = 'nav-services';
    [...serviceList.querySelectorAll('li a')].forEach((a) => {
      services.appendChild(a.cloneNode(true));
    });
    topbar.appendChild(services);
  }
  return topbar;
}

function buildBrand(section) {
  const brand = document.createElement('div');
  brand.className = 'nav-brand';
  const hamburger = document.createElement('button');
  hamburger.className = 'nav-hamburger';
  hamburger.setAttribute('aria-label', 'Open navigation');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.innerHTML = '<span class="nav-hamburger-icon"></span>';
  brand.appendChild(hamburger);
  const logoLink = section.querySelector('p a');
  if (logoLink) {
    const logo = document.createElement('div');
    logo.className = 'nav-logo';
    const link = logoLink.cloneNode(true);
    link.className = '';
    logo.appendChild(link);
    brand.appendChild(logo);
  }
  const tools = document.createElement('div');
  tools.className = 'nav-tools';
  const searchBtn = document.createElement('button');
  searchBtn.className = 'nav-search-btn';
  searchBtn.setAttribute('aria-label', 'Cerca');
  searchBtn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/><line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  tools.appendChild(searchBtn);
  const accountList = section.querySelector('ul');
  if (accountList) {
    [...accountList.querySelectorAll('li a')].forEach((a) => {
      const link = a.cloneNode(true);
      link.className = 'nav-account-link';
      tools.appendChild(link);
    });
  }
  brand.appendChild(tools);
  return brand;
}

function buildNavSections(section, panels) {
  const navSections = document.createElement('div');
  navSections.className = 'nav-sections';
  const list = document.createElement('ul');
  list.className = 'nav-list';
  const navLinks = section.querySelector('ul');
  if (navLinks) {
    [...navLinks.querySelectorAll('li a')].forEach((a) => {
      const li = document.createElement('li');
      li.className = 'nav-item';
      const link = a.cloneNode(true);
      link.className = '';
      const label = link.textContent.trim();
      const panel = panels.find((p) => p.trigger === label);
      if (panel) {
        li.classList.add('has-dropdown');
        link.setAttribute('aria-expanded', 'false');
        link.href = '#';
      }
      li.appendChild(link);
      if (panel) {
        const dropdown = document.createElement('div');
        dropdown.className = 'nav-dropdown';
        const dropdownLinks = document.createElement('ul');
        dropdownLinks.className = 'nav-dropdown-links';
        panel.links.forEach((l) => {
          const dli = document.createElement('li');
          const da = document.createElement('a');
          da.href = l.href;
          da.textContent = l.text;
          dli.appendChild(da);
          dropdownLinks.appendChild(dli);
        });
        dropdown.appendChild(dropdownLinks);
        if (panel.featuredImage) {
          const featured = document.createElement('a');
          featured.href = panel.featuredHref;
          featured.className = 'nav-dropdown-featured';
          const img = document.createElement('img');
          img.src = panel.featuredImage;
          img.alt = panel.featuredAlt;
          img.loading = 'lazy';
          featured.appendChild(img);
          dropdown.appendChild(featured);
        }
        li.appendChild(dropdown);
      }
      list.appendChild(li);
    });
  }
  navSections.appendChild(list);
  return navSections;
}

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';

  const resp = await fetch('/content/nav.plain.html');
  if (!resp.ok) {
    const fragment = await loadFragment(navPath);
    if (fragment) {
      block.textContent = '';
      block.append(fragment);
      return;
    }
    return;
  }

  const html = await resp.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const sections = [...doc.body.children];

  const panelData = [];
  sections.slice(3).forEach((sec) => {
    const heading = sec.querySelector('p');
    if (!heading || heading.querySelector('a')) return;
    const trigger = heading.textContent.trim();
    const links = [...sec.querySelectorAll('ul li a')].map((a) => ({
      text: a.textContent.trim(),
      href: a.getAttribute('href'),
    }));
    const featuredImg = sec.querySelector('p a img');
    const featuredLink = featuredImg ? featuredImg.closest('a') : null;
    panelData.push({
      trigger,
      links,
      featuredImage: featuredImg ? featuredImg.getAttribute('src') : null,
      featuredAlt: featuredImg ? featuredImg.getAttribute('alt') : '',
      featuredHref: featuredLink ? featuredLink.getAttribute('href') : '#',
    });
  });

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-expanded', 'false');

  if (sections[0]) nav.appendChild(buildTopbar(sections[0]));
  if (sections[1]) nav.appendChild(buildBrand(sections[1]));
  if (sections[2]) nav.appendChild(buildNavSections(sections[2], panelData));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.appendChild(nav);
  block.appendChild(navWrapper);

  // Dropdown click behavior
  const items = nav.querySelectorAll('.nav-item.has-dropdown');
  items.forEach((item) => {
    const link = item.querySelector(':scope > a');
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const wasOpen = item.classList.contains('is-open');
      closeAllDropdowns(nav);
      if (!wasOpen) {
        item.classList.add('is-open');
        link.setAttribute('aria-expanded', 'true');
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-item.has-dropdown')) {
      closeAllDropdowns(nav);
    }
  });

  // Hamburger
  const hamburgerBtn = nav.querySelector('.nav-hamburger');
  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = nav.getAttribute('aria-expanded') === 'true';
      toggleMenu(nav, isOpen);
      hamburgerBtn.setAttribute('aria-expanded', String(!isOpen));
    });
  }

  // Resize handler
  isDesktop.addEventListener('change', (e) => {
    if (e.matches) {
      nav.setAttribute('aria-expanded', 'false');
      document.body.style.overflowY = '';
      closeAllDropdowns(nav);
      if (hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllDropdowns(nav);
      if (!isDesktop.matches) {
        toggleMenu(nav, true);
        if (hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', 'false');
      }
    }
  });
}
