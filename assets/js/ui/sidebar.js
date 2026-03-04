const normalizeSidebarItems = items => {
    if (!Array.isArray(items)) return [];
    return items
        .map(item => {
            const label = typeof item?.label === 'string' ? item.label.trim() : '';
            const href = typeof item?.href === 'string' ? item.href.trim() : '';
            const children = normalizeSidebarItems(item?.children);
            if (!label || !href || !href.startsWith('#')) return null;
            return { label, href, children };
        })
        .filter(Boolean);
};

const buildSidebarTree = (items, isChildLevel = false) => {
    const frag = document.createDocumentFragment();
    items.forEach(item => {
        const link = document.createElement('a');
        link.className = `sidebar-link${isChildLevel ? ' sidebar-child' : ''}${item.children.length ? ' sidebar-parent' : ''}`;
        link.href = item.href;
        const label = document.createElement('span');
        label.className = 'sidebar-link-label';
        label.textContent = item.label;
        link.appendChild(label);
        if (item.children.length) {
            const tree = document.createElement('div');
            tree.className = 'sidebar-tree';
            tree.appendChild(link);
            const childrenGroup = document.createElement('div');
            childrenGroup.className = 'sidebar-tree-children';
            childrenGroup.setAttribute('role', 'group');
            childrenGroup.setAttribute('aria-label', `${item.label} links`);
            childrenGroup.appendChild(buildSidebarTree(item.children, true));
            tree.appendChild(childrenGroup);
            frag.appendChild(tree);
        } else {
            frag.appendChild(link);
        }
    });
    return frag;
};

export const initSidebar = (els, siteConfig) => {
    if (!els.sidebarToggle || !els.sectionSidebar || !els.sidebarNav) return;
    const navConfig = siteConfig?.navigation || {};
    const title = typeof navConfig.title === 'string' && navConfig.title.trim() ? navConfig.title.trim() : 'Sections';
    const ariaLabel = typeof navConfig.ariaLabel === 'string' && navConfig.ariaLabel.trim() ? navConfig.ariaLabel.trim() : 'Homepage section links';
    const items = normalizeSidebarItems(navConfig.items);
    if (els.sectionSidebarTitle) els.sectionSidebarTitle.textContent = title;
    els.sidebarNav.setAttribute('aria-label', ariaLabel);
    els.sidebarNav.innerHTML = '';
    if (!items.length) return;
    els.sidebarNav.appendChild(buildSidebarTree(items));
    const setSidebarState = open => {
        document.body.classList.toggle('sidebar-open', open);
        els.sidebarToggle.setAttribute('aria-expanded', String(open));
        els.sectionSidebar.setAttribute('aria-hidden', String(!open));
    };

    els.sidebarToggle.addEventListener('click', () => {
        const isOpen = document.body.classList.contains('sidebar-open');
        if (!isOpen) setSidebarState(true);
    });
    els.sidebarClose?.addEventListener('click', () => setSidebarState(false));

    els.sectionSidebar.addEventListener('click', e => {
        if (!(e.target instanceof Element)) return;
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;
        const hash = link.getAttribute('href');
        if (!hash || hash === '#') return;
        const target = document.querySelector(hash);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', hash);
    });
};
