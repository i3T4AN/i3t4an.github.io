import { convertMarkdownToHTML, sanitizeHTML } from '../utils/markdown.js';
import { initSidebar } from '../ui/sidebar.js';
'use strict';
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
    const SITE = window.SITE;
    const els = {
        brandName: $('#brandName'), footerName: $('#footerName'), brandTag: $('#brandTag'), heroTitle: $('#heroTitle'), heroParagraph: $('#heroParagraph'),
        linkGithub: $('#linkGithub'), linkLinkedIn: $('#linkLinkedIn'), linkEmail: $('#linkEmail'),
        skillsGrid: $('#skillsGrid'), year: $('#year'), sort: $('#sort'),
        publishedTitle: $('#publishedTitle'), publishedGrid: $('#publishedGrid'), publishedEmpty: $('#published-empty'),
        elsewhereTitle: $('#elsewhereTitle'), elsewhereTrack: $('#elsewhereTrack'),
        header: $('header'), filters: $('#filters'), gridDev: $('#grid-dev'), gridAI: $('#grid-ai'), gridEnt: $('#grid-enterprise'),
        projectsEmpty: $('#projects-empty'), themeToggle: $('#themeToggle'), themeIcon: $('#themeIcon'), themeText: $('#themeText'), brandLogo: $('#brandLogo'),
        langImg: null, streakImg: null, starsTotal: null, constellationHoverOutput: null,
        terminalBody: $('#terminalBody'), terminalInput: $('#terminalInput'), terminalOutput: $('#terminalOutput'),
        terminalClose: $('#terminalClose'), terminalMaximize: $('#terminalMaximize'),
        terminalTitle: $('#terminalTitle'), currentPrompt: $('#currentPrompt'),
        constellationCanvas: null,
        readmeModal: $('#readmeModal'), modalTitle: $('#modalTitle'), modalBody: $('#modalBody'), modalClose: $('#modalClose'), modalGitHubLink: $('#modalGitHubLink'),
        paperModal: $('#paperModal'), paperModalBody: $('#paperModalBody'), paperModalClose: $('#paperModalClose'),
        sidebarToggle: $('#sidebarToggle'), sectionSidebar: $('#sectionSidebar'), sidebarClose: $('#sidebarClose'),
        sidebarNav: $('#sidebarNav'), sectionSidebarTitle: $('#sectionSidebarTitle')
    };
    let paperBlobUrl = '';
    const clearPaperBlobUrl = () => { if (paperBlobUrl) { URL.revokeObjectURL(paperBlobUrl); paperBlobUrl = '' } };
    const hideModal = (modal, onHide) => {
        if (typeof onHide === 'function') onHide();
        if (modal) modal.style.display = 'none';
    };
    const hideReadmeModal = () => hideModal(els.readmeModal);
    const hidePaperModal = () => hideModal(els.paperModal, () => {
        clearPaperBlobUrl();
        if (els.paperModalBody) els.paperModalBody.innerHTML = '';
    });
    const initModal = () => {
        els.modalClose?.addEventListener('click', hideReadmeModal);
        els.readmeModal?.addEventListener('click', e => { if (e.target === els.readmeModal) hideReadmeModal() });
        els.paperModalClose?.addEventListener('click', hidePaperModal);
        els.paperModal?.addEventListener('click', e => { if (e.target === els.paperModal) hidePaperModal() });
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') {
                if (els.readmeModal?.style.display === 'block') hideReadmeModal();
                if (els.paperModal?.style.display === 'block') hidePaperModal();
            }
        });
    };
    const fetchReadme = async (owner, repo, branch) => {
        const res = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/${encodeURIComponent(branch)}/README.md`);
        if (!res.ok) throw new Error(`Failed: ${res.status}`);
        return res.text();
    };
    const showReadmeModal = async (repoName, repoUrl, defaultBranch) => {
        const parsed = parseRepoPath(repoUrl);
        if (!parsed) { els.modalBody.innerHTML = '<div class="error">Invalid repository URL</div>'; return }
        // Old browser cache entries may predate default_branch; retain the prior behavior only for those entries.
        const branch = String(defaultBranch || 'main').trim();
        els.modalTitle.textContent = `${repoName} - README`;
        els.modalBody.innerHTML = '<div class="loading">Loading README...</div>';
        els.modalGitHubLink.href = repoUrl;
        els.readmeModal.style.display = 'block';
        try {
            const content = await fetchReadme(parsed.owner, parsed.name, branch);
            const readmeBaseUrl = `https://raw.githubusercontent.com/${parsed.owner}/${parsed.name}/${encodeURIComponent(branch)}/`;
            els.modalBody.innerHTML = `<div class="readme-content">${sanitizeHTML(convertMarkdownToHTML(content, { baseUrl: readmeBaseUrl }))}</div>`;
        } catch (e) { els.modalBody.innerHTML = `<div class="error">Unable to load README: ${e.message}</div>` }
    };
    class Terminal {
        constructor() {
            this.history = [];
            this.historyIndex = 0;
            this.draftInput = '';
            this.maxOutputLines = 300;
            this.terminal = $('.terminal');
            this.commands = {
                '--help': () => this.showHelp(),
                'help': () => this.showHelp(),
                'about': () => this.showAbout(),
                'skills': () => this.showSkills(),
                'projects': () => this.showProjects(),
                'project': a => this.showProject(a),
                'links': () => this.showLinks(),
                'theme': a => this.setTheme(a),
                'clear': () => this.clear(),
                'history': () => this.showHistory(),
                'palette': () => this.showPalette(),
                'whoami': () => this.showWhoami()
            };
            this.init();
        }

        output(text, type = 'text', copyable = false) {
            const div = document.createElement('div');
            div.className = 'terminal-output';
            if (type === 'command') {
                const prompt = document.createElement('span');
                prompt.className = 'terminal-prompt';
                prompt.textContent = text.prompt;
                const cmd = document.createElement('span');
                cmd.className = 'terminal-command';
                cmd.textContent = text.cmd;
                div.appendChild(prompt);
                div.appendChild(cmd);
            } else if (type === 'ascii') {
                const pre = document.createElement('pre');
                pre.className = 'terminal-ascii';
                pre.textContent = String(text);
                div.appendChild(pre);
            } else {
                const span = document.createElement('span');
                if (type !== 'text') span.className = `command-${type}`;
                span.textContent = text;
                div.appendChild(span);
                if (copyable) this.addCopyButton(div);
            }
            els.terminalOutput.appendChild(div);
            this.trimOutput();
            this.scrollToBottom();
        }

        trimOutput() {
            while (els.terminalOutput.childElementCount > this.maxOutputLines) {
                els.terminalOutput.removeChild(els.terminalOutput.firstElementChild);
            }
        }

        scrollToBottom() {
            els.terminalBody.scrollTop = els.terminalBody.scrollHeight;
        }

        focusInput() {
            els.terminalInput?.focus();
        }

        parseInput(input) {
            const parts = [];
            let current = '';
            let quote = null;
            for (let i = 0; i < input.length; i++) {
                const ch = input[i];
                const escaped = input[i - 1] === '\\';
                if ((ch === '"' || ch === "'") && !escaped) {
                    quote = quote === ch ? null : (quote || ch);
                    continue;
                }
                if (/\s/.test(ch) && !quote) {
                    if (current) { parts.push(current); current = '' }
                } else {
                    current += ch;
                }
            }
            if (current) parts.push(current);
            return parts;
        }

        setTerminalState(nextState) {
            this.terminal.classList.remove('minimized', 'maximized');
            if (nextState) this.terminal.classList.add(nextState);
            const minimized = this.terminal.classList.contains('minimized');
            const maximized = this.terminal.classList.contains('maximized');
            els.terminalClose?.setAttribute('aria-pressed', String(minimized));
            els.terminalMaximize?.setAttribute('aria-pressed', String(maximized));
            els.terminalClose?.setAttribute('title', minimized ? 'Restore' : 'Minimize');
            els.terminalMaximize?.setAttribute('title', maximized ? 'Restore' : 'Maximize');
        }

        init() {
            els.terminalClose?.setAttribute('aria-pressed', 'false');
            els.terminalMaximize?.setAttribute('aria-pressed', 'false');
            els.terminalClose?.addEventListener('click', () => {
                const isMinimized = this.terminal.classList.contains('minimized');
                this.setTerminalState(isMinimized ? null : 'minimized');
                this.focusInput();
            });
            els.terminalMaximize?.addEventListener('click', () => {
                const isMaximized = this.terminal.classList.contains('maximized');
                this.setTerminalState(isMaximized ? null : 'maximized');
                this.focusInput();
            });
            els.terminalInput?.addEventListener('keydown', e => {
                if (e.key === 'Enter') {
                    const value = e.target.value;
                    e.target.value = '';
                    this.exec(value);
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    this.navHistory(-1);
                } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    this.navHistory(1);
                }
            });
            els.terminalBody?.addEventListener('click', e => {
                if (e.target === els.terminalBody || e.target === els.terminalOutput) {
                    this.focusInput();
                }
            });
            this.historyIndex = this.history.length;
            this.output(SITE.terminal.welcomeMessage, 'help');
        }

        exec(cmd) {
            const trimmed = cmd.trim();
            if (!trimmed) return;
            this.history.push(trimmed);
            this.historyIndex = this.history.length;
            this.draftInput = '';
            this.output({ prompt: SITE.terminal.prompt, cmd: trimmed }, 'command');
            const [c, ...args] = this.parseInput(trimmed);
            const fn = this.commands[c.toLowerCase()];
            if (fn) fn(args);
            else this.output(SITE.terminal.messages.commandNotFound.replace('{cmd}', c), 'error');
            this.focusInput();
        }

        addCopyButton(container) {
            const copy = document.createElement('span');
            copy.className = 'copy-icon';
            copy.textContent = '📋';
            copy.title = 'Copy to clipboard';
            copy.setAttribute('tabindex', '0');
            const copyText = () => navigator.clipboard.writeText(container.textContent.replace('📋', '').trim())
                .then(() => { copy.textContent = '✓'; setTimeout(() => copy.textContent = '📋', 1200) });
            copy.addEventListener('click', copyText);
            copy.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); copyText() } });
            container.appendChild(copy);
            container.setAttribute('tabindex', '0');
        }

        navHistory(d) {
            if (!this.history.length) return;
            if (d < 0 && this.historyIndex === this.history.length) this.draftInput = els.terminalInput.value;
            this.historyIndex = Math.max(0, Math.min(this.history.length, this.historyIndex + d));
            els.terminalInput.value = this.historyIndex < this.history.length
                ? this.history[this.historyIndex]
                : this.draftInput;
        }

        showHelp() {
            this.output(SITE.terminal.messages.commandsTitle, 'help');
            Object.entries(SITE.terminal.commands).forEach(([k, v]) => this.output(`  ${k.padEnd(20)} ${v}`));
            this.output(`  ${'help'.padEnd(20)} Alias for --help`);
        }

        showAbout() {
            this.output(SITE.hero.title, 'help');
            this.output(`\n${decodeHTML(sanitizeHTML(SITE.hero.paragraph))}`, 'text', true);
        }

        showSkills() {
            const m = SITE.terminal.messages;
            this.output(m.skillsTitle, 'help');
            [['development', m.developmentTitle], ['automation', m.automationTitle], ['systems', m.systemsTitle]].forEach(([k, t]) => {
                if (!Array.isArray(SITE.skills[k]) || !SITE.skills[k].length) return;
                this.output(`\n${t.toUpperCase()}:\n`);
                SITE.skills[k].forEach(s => this.output(`  • ${s}\n`));
            });
        }

        showProjects() {
            this.output(SITE.terminal.messages.projectsInfo, 'help');
            this.output('\nAvailable repositories:\n');
            SITE.repos.forEach(r => { const p = parseRepoPath(r.url); if (p) this.output(`  ${p.name}\n`) });
            this.output(`\n${SITE.terminal.messages.projectsBrowse}`, 'text', true);
        }

        showProject(args) {
            if (!args.length) { this.output(SITE.terminal.messages.projectUsage, 'error'); return }
            const repo = SITE.repos.find(r => { const p = parseRepoPath(r.url); return p && p.name.toLowerCase() === args[0].toLowerCase() });
            if (repo) {
                const p = parseRepoPath(repo.url);
                this.output(SITE.terminal.messages.projectDetails.replace('{name}', p.name), 'help');
                this.output(`\nGroup: ${repo.group}\nURL: ${repo.url}\n${SITE.terminal.messages.projectNote}`, 'text', true);
            } else this.output(`Project "${args[0]}" not found. Use "projects" to see available repositories.`, 'error');
        }

        showLinks() {
            const s = SITE.socials;
            this.output(SITE.terminal.messages.connectTitle, 'help');
            this.output(`\nGitHub:   ${s.github}\nLinkedIn: ${s.linkedin}\nEmail:    ${s.email.replace('mailto:', '')}`, 'text', true);
        }

        setTheme(args) {
            const t = args[0]?.toLowerCase();
            if (['light', 'dark', 'auto'].includes(t)) {
                setAppTheme(t);
                this.output(SITE.terminal.messages.themeSet.replace('{theme}', t), 'success');
            } else this.output(SITE.terminal.messages.themeUsage, 'error');
        }

        clear() { els.terminalOutput.innerHTML = '' }

        showHistory() {
            const h = this.history.slice(-20);
            this.output(SITE.terminal.messages.historyTitle, 'help');
            this.output('\n');
            h.forEach((c, i) => this.output(`  ${(this.history.length - h.length + i + 1).toString().padStart(3)}  ${c}\n`));
        }

        showPalette() {
            const vars = ['--bg-primary', '--bg-secondary', '--text-primary', '--text-secondary', '--accent', '--accent-hover', '--border', '--shadow-glow'];
            this.output(SITE.terminal.messages.paletteTitle, 'help');
            this.output('\n');
            const style = getComputedStyle(document.documentElement);
            vars.forEach(v => this.output(`${v}: ${style.getPropertyValue(v).trim()}\n`));
        }

        showWhoami() {
            const rawArt = String(SITE.terminal.asciiArt || '').replace(/\r/g, '');
            const lines = rawArt.split('\n');
            while (lines.length && !lines[0].trim()) lines.shift();
            while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
            const minIndent = lines.reduce((min, line) => {
                if (!line.trim()) return min;
                const indent = (line.match(/^[ \t]*/) || [''])[0].length;
                return Math.min(min, indent);
            }, Infinity);
            const art = minIndent === Infinity ? '' : lines.map(line => line.slice(minIndent)).join('\n');
            this.output(art, 'ascii');
        }
    }

    const REPO_GROUP_LABELS = {
        ai: 'Automation & AI',
        enterprise: 'Enterprise Systems / Cloud',
        dev: 'Programming / Development'
    };
    class RepoConstellation {
        constructor(canvas, tooltipEl, onSelectRepo) {
            this.canvas = canvas;
            this.tooltipEl = tooltipEl;
            this.onSelectRepo = onSelectRepo;
            this.ctx = canvas?.getContext('2d');
            this.nodes = [];
            this.links = [];
            this.pointer = { x: 0, y: 0, inside: false };
            this.hoveredNode = null;
            this.rafId = null;
            this.width = 0;
            this.height = 0;
            this.lastTooltip = '';
            this.tooltipBaseFontPx = 0;
            this.tooltipMinFontPx = 7;
            this.reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
            this.pageVisible = !document.hidden;
            this.inViewport = true;
            this.visibilityObserver = null;
            this.palette = {
                surface: '#0b1120',
                text: '#e2e8f0',
                textMuted: '#94a3b8',
                border: 'rgba(148,163,184,.25)',
                grid: 'rgba(148,163,184,.2)',
                link: 'rgba(148,163,184,.22)',
                linkActive: 'rgba(0,212,255,.48)',
                ai: '#00d4ff',
                enterprise: '#a855f7',
                dev: '#4ade80'
            };
            if (!this.canvas || !this.ctx) return;
            this.onPointerMove = this.onPointerMove.bind(this);
            this.onPointerLeave = this.onPointerLeave.bind(this);
            this.onClick = this.onClick.bind(this);
            this.onResize = this.onResize.bind(this);
            this.onMotionPreferenceChange = this.onMotionPreferenceChange.bind(this);
            this.onVisibilityChange = this.onVisibilityChange.bind(this);
            this.onVisibilityObserved = this.onVisibilityObserved.bind(this);
            this.loop = this.loop.bind(this);
            this.canvas.addEventListener('pointermove', this.onPointerMove, { passive: true });
            this.canvas.addEventListener('pointerleave', this.onPointerLeave, { passive: true });
            this.canvas.addEventListener('click', this.onClick);
            addEventListener('resize', this.onResize, { passive: true });
            document.addEventListener('visibilitychange', this.onVisibilityChange);
            if (this.reducedMotionQuery.addEventListener) this.reducedMotionQuery.addEventListener('change', this.onMotionPreferenceChange);
            else this.reducedMotionQuery.addListener(this.onMotionPreferenceChange);
            if ('IntersectionObserver' in window) {
                this.visibilityObserver = new IntersectionObserver(this.onVisibilityObserved, {
                    root: null,
                    threshold: 0.01
                });
                this.visibilityObserver.observe(this.canvas);
            }
            this.refreshPalette();
            this.resize();
            this.setTooltip('');
            this.drawBackground();
        }

        prefersReducedMotion() {
            return Boolean(this.reducedMotionQuery?.matches);
        }

        readVar(name, fallback) {
            const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
            return value || fallback;
        }

        refreshPalette() {
            const isDark = document.documentElement.classList.contains('theme-dark');
            this.palette = {
                surface: this.readVar('--stats-panel-bg', isDark ? '#0b1120' : '#f8faff'),
                text: this.readVar('--text-primary', isDark ? '#e2e8f0' : '#1f2937'),
                textMuted: this.readVar('--text-secondary', isDark ? '#94a3b8' : '#475569'),
                border: this.readVar('--border', 'rgba(148,163,184,.25)'),
                grid: isDark ? 'rgba(71,85,105,.24)' : 'rgba(148,163,184,.26)',
                link: isDark ? 'rgba(148,163,184,.26)' : 'rgba(71,85,105,.22)',
                linkActive: isDark ? 'rgba(0,212,255,.6)' : 'rgba(0,212,255,.44)',
                ai: this.readVar('--constellation-ai', '#00d4ff'),
                enterprise: this.readVar('--constellation-enterprise', '#a855f7'),
                dev: this.readVar('--constellation-dev', '#4ade80')
            };
            if (this.nodes.length) this.render(performance.now());
        }

        onMotionPreferenceChange() {
            this.stop();
            this.render(performance.now());
            this.ensureFrame();
        }

        onVisibilityChange() {
            this.pageVisible = !document.hidden;
            if (!this.pageVisible) {
                this.stop();
                return;
            }
            this.render(performance.now());
            this.ensureFrame();
        }

        onVisibilityObserved(entries) {
            const isVisible = entries.some(entry => entry.isIntersecting && entry.intersectionRatio > 0);
            this.inViewport = isVisible;
            if (!this.inViewport) {
                this.stop();
                return;
            }
            this.render(performance.now());
            this.ensureFrame();
        }

        canAnimate() {
            return this.pageVisible && this.inViewport;
        }

        onResize() {
            this.resize();
            this.render(performance.now());
            this.fitTooltipText();
            this.ensureFrame();
        }

        resize() {
            const rect = this.canvas.getBoundingClientRect();
            this.width = Math.max(1, Math.floor(rect.width || this.canvas.clientWidth || 0));
            this.height = Math.max(1, Math.floor(rect.height || this.canvas.clientHeight || 0));
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            this.canvas.width = Math.floor(this.width * dpr);
            this.canvas.height = Math.floor(this.height * dpr);
            this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        setRepos(repos) {
            const list = Array.isArray(repos)
                ? [...repos].filter(Boolean).sort((a, b) => (Number(b?.stargazers_count) || 0) - (Number(a?.stargazers_count) || 0))
                : [];
            if (!list.length) {
                this.nodes = [];
                this.links = [];
                this.setTooltip('No repositories available.');
                this.stop();
                this.drawBackground();
                return;
            }
            const maxStars = Math.max(...list.map(r => Number(r?.stargazers_count) || 0), 1);
            this.nodes = list.map((repo, index) => {
                const starValue = Number(repo?.stargazers_count) || 0;
                const radial = Math.sqrt((index + 1) / (list.length + 1));
                return {
                    id: index,
                    repo,
                    group: repo.__group || 'dev',
                    stars: starValue,
                    language: repo.language || 'Other',
                    radial,
                    angle: index * 2.399963229728653,
                    speed: 0.4 + Math.random() * 0.85,
                    phase: Math.random() * Math.PI * 2,
                    wobble: 4 + Math.random() * 8,
                    radius: 4 + ((Math.log1p(starValue) / Math.log1p(maxStars)) * 16),
                    x: this.width / 2,
                    y: this.height / 2
                };
            });
            this.links = this.buildLinks();
            this.setTooltip('');
            this.stop();
            this.render(performance.now());
            this.ensureFrame();
        }

        buildLinks() {
            const links = [];
            const seen = new Set();
            const connect = (a, b) => {
                if (!a || !b || a === b) return;
                const key = [a.id, b.id].sort((x, y) => x - y).join(':');
                if (seen.has(key)) return;
                seen.add(key);
                links.push([a, b]);
            };
            const grouped = new Map();
            this.nodes.forEach(node => {
                const bucket = grouped.get(node.group) || [];
                bucket.push(node);
                grouped.set(node.group, bucket);
            });
            grouped.forEach(groupNodes => {
                const sorted = [...groupNodes].sort((a, b) => a.radial - b.radial);
                for (let i = 1; i < sorted.length; i++) connect(sorted[i - 1], sorted[i]);
            });
            const hubs = [...this.nodes].sort((a, b) => b.stars - a.stars).slice(0, Math.min(10, this.nodes.length));
            for (let i = 1; i < hubs.length; i++) connect(hubs[0], hubs[i]);
            return links;
        }

        getGroupColor(group) {
            if (group === 'ai') return this.palette.ai;
            if (group === 'enterprise') return this.palette.enterprise;
            return this.palette.dev;
        }

        onPointerMove(event) {
            const rect = this.canvas.getBoundingClientRect();
            this.pointer.x = event.clientX - rect.left;
            this.pointer.y = event.clientY - rect.top;
            this.pointer.inside = true;
            this.render(performance.now());
        }

        onPointerLeave() {
            this.pointer.inside = false;
            this.hoveredNode = null;
            this.setTooltip('');
            this.render(performance.now());
        }

        onClick() {
            if (typeof this.onSelectRepo !== 'function') return;
            const targetNode = this.hoveredNode;
            if (!targetNode) return;
            this.onSelectRepo(targetNode.repo);
        }

        setTooltip(text) {
            if (!this.tooltipEl) return;
            const nextText = text ?? '';
            if (nextText === this.lastTooltip) return;
            this.lastTooltip = nextText;
            this.tooltipEl.textContent = nextText;
            this.fitTooltipText();
        }

        fitTooltipText() {
            if (!this.tooltipEl) return;
            if (!this.tooltipBaseFontPx) {
                const computed = getComputedStyle(this.tooltipEl);
                const parsed = Number.parseFloat(computed.fontSize);
                if (Number.isFinite(parsed) && parsed > 0) this.tooltipBaseFontPx = parsed;
            }
            const baseSize = this.tooltipBaseFontPx || 14;
            const minSize = this.tooltipMinFontPx;
            if (!this.tooltipEl.textContent) {
                this.tooltipEl.style.fontSize = '';
                return;
            }
            let size = baseSize;
            this.tooltipEl.style.fontSize = `${size}px`;
            let guard = 0;
            while (this.tooltipEl.scrollWidth > this.tooltipEl.clientWidth && size > minSize && guard < 40) {
                size = Math.max(minSize, size - 0.5);
                this.tooltipEl.style.fontSize = `${size}px`;
                guard++;
            }
        }

        drawBackground() {
            this.ctx.clearRect(0, 0, this.width, this.height);
            this.ctx.fillStyle = this.palette.surface;
            this.ctx.fillRect(0, 0, this.width, this.height);
            this.ctx.strokeStyle = this.palette.grid;
            this.ctx.lineWidth = 1;
            for (let x = 24; x < this.width; x += 24) {
                this.ctx.beginPath();
                this.ctx.moveTo(x, 0);
                this.ctx.lineTo(x, this.height);
                this.ctx.stroke();
            }
            for (let y = 24; y < this.height; y += 24) {
                this.ctx.beginPath();
                this.ctx.moveTo(0, y);
                this.ctx.lineTo(this.width, y);
                this.ctx.stroke();
            }
        }

        findNearestNodeToPointer(maxDistance = Infinity) {
            if (!this.pointer.inside || !this.nodes.length) return null;
            let nearest = null;
            let bestDistance = Infinity;
            this.nodes.forEach(node => {
                const distance = Math.hypot(node.x - this.pointer.x, node.y - this.pointer.y);
                if (distance < bestDistance) {
                    bestDistance = distance;
                    nearest = node;
                }
            });
            if (!nearest) return null;
            return bestDistance <= maxDistance ? nearest : null;
        }

        findHoveredNode() {
            const nearest = this.findNearestNodeToPointer(Infinity);
            if (!nearest) return null;
            const distance = Math.hypot(nearest.x - this.pointer.x, nearest.y - this.pointer.y);
            return distance <= nearest.radius + 10 ? nearest : null;
        }

        render(now = performance.now()) {
            if (!this.nodes.length) return;
            const t = now / 1000;
            const centerX = this.width / 2;
            const centerY = this.height / 2;
            const orbitScale = Math.min(this.width, this.height) * 0.41;
            this.drawBackground();
            this.nodes.forEach(node => {
                const baseAngle = node.angle + (t * 0.07);
                let x = centerX + (Math.cos(baseAngle) * node.radial * orbitScale) + (Math.cos((t * node.speed) + node.phase) * node.wobble);
                let y = centerY + (Math.sin(baseAngle) * node.radial * orbitScale) + (Math.sin((t * node.speed) + node.phase) * node.wobble);
                node.x = Math.min(this.width - node.radius - 6, Math.max(node.radius + 6, x));
                node.y = Math.min(this.height - node.radius - 6, Math.max(node.radius + 6, y));
            });
            this.hoveredNode = this.findHoveredNode();
            this.links.forEach(([a, b]) => {
                const emphasized = this.hoveredNode && (a === this.hoveredNode || b === this.hoveredNode);
                this.ctx.beginPath();
                this.ctx.moveTo(a.x, a.y);
                this.ctx.lineTo(b.x, b.y);
                this.ctx.strokeStyle = emphasized ? this.palette.linkActive : this.palette.link;
                this.ctx.lineWidth = emphasized ? 1.8 : 1;
                this.ctx.stroke();
            });
            this.nodes.forEach(node => {
                const hovered = node === this.hoveredNode;
                const color = this.getGroupColor(node.group);
                this.ctx.beginPath();
                this.ctx.fillStyle = color;
                this.ctx.shadowColor = color;
                this.ctx.shadowBlur = hovered ? 24 : 12;
                this.ctx.arc(node.x, node.y, node.radius + (hovered ? 1.8 : 0), 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.shadowBlur = 0;
                this.ctx.strokeStyle = document.documentElement.classList.contains('theme-dark') ? 'rgba(248,250,252,.7)' : 'rgba(15,23,42,.65)';
                this.ctx.lineWidth = hovered ? 1.8 : 1;
                this.ctx.stroke();
            });
            if (this.hoveredNode) {
                const hoveredRepo = this.hoveredNode.repo;
                this.setTooltip(`${hoveredRepo.name} | ${this.hoveredNode.language} | ${REPO_GROUP_LABELS[this.hoveredNode.group] || this.hoveredNode.group} | ${formatNumber(this.hoveredNode.stars)} stars | Pushed ${formatRepoLastUpdated(hoveredRepo)}`);
            } else {
                this.setTooltip('');
            }
        }

        loop(now) {
            this.rafId = null;
            this.render(now);
            this.ensureFrame();
        }

        ensureFrame() {
            if (this.rafId || this.prefersReducedMotion() || !this.nodes.length || !this.canAnimate()) return;
            this.rafId = requestAnimationFrame(this.loop);
        }

        stop() {
            if (!this.rafId) return;
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
    }

    const parseRepoPath = url => { try { const u = new URL(url); const [owner, name] = u.pathname.slice(1).split('/'); return { owner, name } } catch { return null } };
    const relativeTime = d => {
        const timestamp = Date.parse(d || '');
        if (!Number.isFinite(timestamp)) return 'Unknown';
        const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
        const sec = (timestamp - Date.now()) / 1e3;
        const units = [[31536e3, 'year'], [2592e3, 'month'], [604800, 'week'], [86400, 'day'], [3600, 'hour'], [60, 'minute'], [1, 'second']];
        for (const [s, u] of units) {
            const v = sec / s;
            if (Math.abs(v) >= 1 || u === 'second') return rtf.format(Math.round(v), u);
        }
        return 'Unknown';
    };
    const getRepoLastUpdatedValue = repo => {
        const pushedAt = String(repo?.pushed_at || '').trim();
        return pushedAt || '';
    };
    const getRepoUpdatedTimestamp = repo => {
        const raw = getRepoLastUpdatedValue(repo);
        if (!raw) return 0;
        const parsed = Date.parse(raw);
        return Number.isFinite(parsed) ? parsed : 0;
    };
    const formatRepoLastUpdated = repo => {
        const raw = getRepoLastUpdatedValue(repo);
        return raw ? relativeTime(raw) : 'Unknown';
    };
    const getStorage = () => {
        const candidates = [];
        try { candidates.push(localStorage); } catch { }
        try { candidates.push(sessionStorage); } catch { }
        for (const store of candidates) {
            try {
                const probe = '__portfolio_cache_probe__';
                store.setItem(probe, '1');
                store.removeItem(probe);
                return store;
            } catch { }
        }
        return null;
    };
    const CACHE_TTL_MS = 12 * 60 * 60 * 1000;
    const cacheStorage = getStorage();
    const cache = {
        get: (key, maxAgeMs = CACHE_TTL_MS) => {
            if (!cacheStorage) return null;
            try {
                const raw = cacheStorage.getItem(key);
                if (!raw) return null;
                const parsed = JSON.parse(raw);
                if (parsed && typeof parsed === 'object' && 'value' in parsed && typeof parsed.cachedAt === 'number') {
                    if (maxAgeMs > 0 && (Date.now() - parsed.cachedAt) > maxAgeMs) {
                        cacheStorage.removeItem(key);
                        return null;
                    }
                    return parsed.value;
                }
                return parsed;
            } catch {
                return null;
            }
        },
        set: (key, value) => {
            if (!cacheStorage) return;
            try {
                cacheStorage.setItem(key, JSON.stringify({ value, cachedAt: Date.now() }));
            } catch { }
        }
    };

    const getGitHubUsername = site => {
        const explicit = site.profile?.githubUsername?.trim();
        if (explicit) return explicit;
        const parsed = parseRepoPath(site.socials?.github || '');
        return parsed?.owner || '';
    };
    const buildGitHubSources = (username, light, dark) => {
        if (!username) return { light: [], dark: [] };
        const encoded = encodeURIComponent(username);
        return { light: [light(encoded)], dark: [dark(encoded)] };
    };
    const buildGitHubLangSources = username => buildGitHubSources(
        username,
        encoded => `https://github-readme-stats-sigma-five.vercel.app/api/top-langs?username=${encoded}&show_icons=true&locale=en&layout=compact&theme=default&hide_border=true&custom_title=Top%20Languages&v=5`,
        encoded => `https://github-readme-stats-sigma-five.vercel.app/api/top-langs?username=${encoded}&show_icons=true&locale=en&layout=compact&hide_border=true&bg_color=1a1b27&title_color=A855F7&text_color=CFD6E2&icon_color=00D4FF&custom_title=Top%20Languages&v=4`
    );
    const buildGitHubStreakSources = username => buildGitHubSources(
        username,
        encoded => `https://streak-stats.demolab.com?user=${encoded}&theme=default&hide_border=true`,
        encoded => `https://streak-stats.demolab.com?user=${encoded}&theme=tokyonight&hide_border=true`
    );

    const formatRepoName = name => String(name || '').replace(/[-_]/g, ' ').replace(/\b\w/g, m => m.toUpperCase());
    const formatNumber = n => new Intl.NumberFormat('en-US').format(Number(n) || 0);
    const fetchJsonCached = async (key, url, headers, map = d => d, ttlMs = CACHE_TTL_MS) => {
        const cached = cache.get(key, ttlMs);
        if (cached) return cached;
        try {
            const r = await fetch(url, { headers });
            if (!r.ok) throw new Error(String(r.status));
            const out = map(await r.json());
            if (out) cache.set(key, out);
            return out;
        } catch {
            return null;
        }
    };

    const fetchRepo = async (owner, name) => {
        const key = `gh:${owner}/${name}`;
        const repo = await fetchJsonCached(
            key,
            `https://api.github.com/repos/${owner}/${name}`,
            { Accept: 'application/vnd.github+json' },
            d => ({
                html_url: d.html_url,
                description: d.description || formatRepoName(name),
                language: d.language || 'Other',
                stargazers_count: d.stargazers_count || 0,
                pushed_at: d.pushed_at || null,
                default_branch: d.default_branch || '',
                name
            }),
            CACHE_TTL_MS
        );
        if (repo) return repo;
        return {
            html_url: `https://github.com/${owner}/${name}`,
            description: formatRepoName(name),
            language: 'Other',
            stargazers_count: 0,
            pushed_at: null,
            default_branch: '',
            name
        };
    };
    const animateNumber = (el, from, to, duration = 850) => {
        if (!el) return;
        const start = performance.now();
        const begin = Number(from) || 0;
        const end = Number(to) || 0;
        const tick = now => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            const value = Math.round(begin + (end - begin) * eased);
            el.textContent = formatNumber(value);
            if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    };
    const setStarsTotal = (value, animate = false) => {
        if (!els.starsTotal) return;
        const next = Number(value);
        if (!Number.isFinite(next)) {
            els.starsTotal.textContent = 'N/A';
            return;
        }
        const prev = Number(els.starsTotal.dataset.value || '0');
        els.starsTotal.dataset.value = String(next);
        if (animate) animateNumber(els.starsTotal, prev, next);
        else els.starsTotal.textContent = formatNumber(next);
    };
    const setFeaturedStarsTotal = repos => {
        if (!Array.isArray(repos)) {
            setStarsTotal(NaN, false);
            return;
        }
        const total = repos.reduce((sum, repo) => sum + (Number(repo?.stargazers_count) || 0), 0);
        setStarsTotal(total, true);
    };

    const normalizeDoi = v => String(v || '')
        .trim()
        .replace(/^https?:\/\/(dx\.)?doi\.org\//i, '')
        .replace(/^doi:\s*/i, '');
    const extractZenodoRecordId = doi => {
        const m = String(doi || '').match(/(?:^|\/)zenodo\.(\d+)$/i);
        return m?.[1] || '';
    };
    const decodeHTML = html => { const d = document.createElement('div'); d.innerHTML = html; return d.textContent || '' };
    const cleanAbstractText = abstract => decodeHTML(String(abstract || '')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<li[^>]*>/gi, '\n- ')
        .replace(/<\/li>/gi, '')
        .replace(/<\/(jats:p|p|jats:title|title|jats:sec|sec|ul|ol|div)>/gi, '\n')
        .replace(/<[^>]+>/g, ' '))
        .replace(/\r/g, '')
        .replace(/[ \t]+\n/g, '\n')
        .replace(/\n[ \t]+/g, '\n')
        .replace(/[ \t]{2,}/g, ' ')
        .replace(/(^|\n)\s*(?:[-*]|\u2022|\d+\.)\s+/g, '$1- ')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
    const getPublishedYear = m => {
        const parts = m?.issued?.['date-parts']?.[0] || m?.published?.['date-parts']?.[0] || m?.created?.['date-parts']?.[0];
        return Array.isArray(parts) && parts[0] ? String(parts[0]) : '';
    };
    const getCrossrefMailto = () => String(SITE?.socials?.email || '')
        .replace(/^mailto:/i, '')
        .trim();
    const fetchPaperByDoi = async doi => {
        if (!doi) return null;
        const mailto = getCrossrefMailto();
        const suffix = mailto ? `?mailto=${encodeURIComponent(mailto)}` : '';
        return fetchJsonCached(`crossref:${doi.toLowerCase()}`, `https://api.crossref.org/works/${encodeURIComponent(doi)}${suffix}`, { Accept: 'application/json' }, payload => payload?.message || null);
    };
    const fetchZenodoRecord = async recordId => {
        if (!recordId) return null;
        return fetchJsonCached(`zenodo:${recordId}`, `https://zenodo.org/api/records/${encodeURIComponent(recordId)}`, { Accept: 'application/json' });
    };
    const resolveZenodoPdfUrl = rec => {
        const files = Array.isArray(rec?.files) ? rec.files : [];
        const pdf = files.find(f => /\.pdf$/i.test(String(f?.key || '')));
        return String(pdf?.links?.self || pdf?.links?.download || '');
    };
    const fetchInlinePdfUrl = async pdfUrl => {
        const url = String(pdfUrl || '').trim();
        if (!url) return '';
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(String(res.status));
            const blob = await res.blob();
            return URL.createObjectURL(blob.type === 'application/pdf' ? blob : new Blob([blob], { type: 'application/pdf' }));
        } catch {
            return '';
        }
    };
    const resolvePaperPdfUrl = (item, metadata) => {
        if (item.pdfUrl) return item.pdfUrl;
        const links = Array.isArray(metadata?.link) ? metadata.link : [];
        const match = links.find(l => {
            const type = String(l?.['content-type'] || '').toLowerCase();
            const u = String(l?.URL || '');
            return type.includes('pdf') || /\.pdf(\?|$)/i.test(u);
        });
        return match?.URL || '';
    };
    const buildPublishedEntry = async item => {
        const doi = normalizeDoi(item?.doi);
        const zenodoRecordId = extractZenodoRecordId(doi);
        if (zenodoRecordId) {
            const record = await fetchZenodoRecord(zenodoRecordId);
            if (record) {
                const title = String(record?.metadata?.title || '').trim() || (doi ? `DOI ${doi}` : '');
                if (!title) return null;
                const year = String(record?.metadata?.publication_date || '').slice(0, 4);
                const abstract = cleanAbstractText(record?.metadata?.description);
                const tldr = abstract || `Published on Zenodo${year ? ` (${year})` : ''}.`;
                return {
                    doi,
                    title,
                    tldr,
                    year,
                    pdfUrl: item?.pdfUrl || resolveZenodoPdfUrl(record)
                };
            }
        }
        const metadata = doi ? await fetchPaperByDoi(doi) : null;
        const title = (Array.isArray(metadata?.title) ? String(metadata.title.find(Boolean) || '') : '') || (doi ? `DOI ${doi}` : '');
        if (!title) return null;
        const abstract = cleanAbstractText(metadata?.abstract);
        const journal = Array.isArray(metadata?.['container-title']) ? String(metadata['container-title'][0] || '') : '';
        const year = getPublishedYear(metadata);
        const tldr = abstract || `Published${journal ? ` in ${journal}` : ''}${year ? ` (${year})` : ''}.`;
        return {
            doi,
            title,
            tldr,
            year,
            pdfUrl: resolvePaperPdfUrl(item, metadata)
        };
    };
    const showPaperModal = async paper => {
        if (!els.paperModal || !els.paperModalBody) return;
        clearPaperBlobUrl();
        els.paperModalBody.scrollTop = 0;
        els.paperModalBody.innerHTML = '<div class="loading">Loading PDF...</div>';
        const inlinePdfUrl = await fetchInlinePdfUrl(paper.pdfUrl);
        els.paperModalBody.innerHTML = '';
        if (inlinePdfUrl) {
            paperBlobUrl = inlinePdfUrl;
            const frame = document.createElement('iframe');
            frame.className = 'paper-pdf-frame';
            frame.src = `${inlinePdfUrl}#page=1&view=FitH&toolbar=0&navpanes=0&scrollbar=0`;
            frame.title = `PDF viewer: ${paper.title}`;
            frame.loading = 'lazy';
            els.paperModalBody.appendChild(frame);
        } else {
            const msg = document.createElement('div');
            msg.className = 'error';
            msg.textContent = 'No direct PDF URL found for this DOI.';
            els.paperModalBody.appendChild(msg);
        }
        els.paperModal.style.display = 'block';
    };

    let GH_LANG_SOURCES = { light: [], dark: [] };
    let GH_STREAK_SOURCES = { light: [], dark: [] };
    let repoConstellation = null;
    const setImageWithFallback = (img, urls) => {
        if (!img || !urls?.length) return;
        img.dataset.fallbackIndex = '0';
        img.style.removeProperty('display');
        img.onerror = () => {
            const next = Number(img.dataset.fallbackIndex || '0') + 1;
            if (next < urls.length) { img.dataset.fallbackIndex = String(next); img.src = urls[next] }
            else { img.onerror = null; img.style.opacity = '.35' }
        };
        img.src = urls[0];
    };
    const updateThemeButton = isDark => {
        if (els.brandLogo) {
            els.brandLogo.src = isDark
                ? './assets/images/branding/i3T4AN_Logo_White.png'
                : './assets/images/branding/i3T4AN_Logo_Black.png';
        }
        if (els.themeIcon) {
            els.themeIcon.innerHTML = isDark
                ? '<svg viewBox="0 0 24 24" class="social-icon" aria-hidden="true"><path fill="currentColor" d="M12 4.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 12 4.5Zm0 10.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 4.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 12 19.5ZM4.5 12a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5A.75.75 0 0 1 4.5 12Zm12 0a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5A.75.75 0 0 1 16.5 12ZM6.7 6.7a.75.75 0 0 1 1.06 0l1.06 1.06a.75.75 0 0 1-1.06 1.06L6.7 7.76a.75.75 0 0 1 0-1.06Zm8.48 8.48a.75.75 0 0 1 1.06 0l1.06 1.06a.75.75 0 0 1-1.06 1.06l-1.06-1.06a.75.75 0 0 1 0-1.06ZM6.7 17.3a.75.75 0 0 1 0-1.06l1.06-1.06a.75.75 0 0 1 1.06 1.06L7.76 17.3a.75.75 0 0 1-1.06 0Zm8.48-8.48a.75.75 0 0 1 0-1.06l1.06-1.06a.75.75 0 1 1 1.06 1.06l-1.06 1.06a.75.75 0 0 1-1.06 0Z"/></svg>'
                : '<svg viewBox="0 0 24 24" class="social-icon" aria-hidden="true"><path fill="currentColor" d="M14.72 3.24a.75.75 0 0 1 .24.94 7.5 7.5 0 0 0 9.36 10.06.75.75 0 0 1 .94.94A9 9 0 1 1 13.78 2.76a.75.75 0 0 1 .94.48Z"/></svg>';
        }
        if (els.themeText) els.themeText.textContent = isDark ? 'Light' : 'Dark';
        els.themeToggle?.setAttribute('aria-pressed', String(isDark));
    };
    const updateGitHubStats = isDark => { const mode = isDark ? 'dark' : 'light'; setImageWithFallback(els.langImg, GH_LANG_SOURCES[mode]); setImageWithFallback(els.streakImg, GH_STREAK_SOURCES[mode]) };
    const applyTheme = t => {
        const isDark = t === 'dark';
        document.documentElement.classList.toggle('theme-dark', isDark);
        updateThemeButton(isDark);
        updateGitHubStats(isDark);
        if (repoConstellation) {
            try {
                repoConstellation.refreshPalette();
            } catch {
                repoConstellation = null;
            }
        }
    };
    const persistTheme = theme => cacheStorage?.setItem('theme', theme);
    const setAppTheme = (theme, persist = true) => {
        if (theme === 'auto') { cacheStorage?.removeItem('theme'); applyTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); return }
        if (persist) persistTheme(theme);
        applyTheme(theme);
    };
    const initTheme = () => {
        const saved = cacheStorage?.getItem('theme');
        setAppTheme(saved || 'dark', false);
        els.themeToggle?.addEventListener('click', () => {
            const theme = document.documentElement.classList.contains('theme-dark') ? 'light' : 'dark';
            setAppTheme(theme);
        });
    };
    const initViewportScanHeight = () => {
        const setScanViewportHeight = () => {
            document.documentElement.style.setProperty('--scan-viewport-height', `${window.innerHeight}px`);
        };
        setScanViewportHeight();
        addEventListener('resize', setScanViewportHeight, { passive: true });
        addEventListener('orientationchange', setScanViewportHeight, { passive: true });
    };
    const initScrollStartAtTop = () => {
        if (location.hash) return;
        const navEntries = performance.getEntriesByType?.('navigation') || [];
        const navType = navEntries[0]?.type;
        if (navType === 'back_forward') return;
        requestAnimationFrame(() => {
            window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        });
    };
    const initHeaderScroll = () => addEventListener('scroll', () => els.header.classList.toggle('scrolled', scrollY > 20), { passive: true });
    const initTextureParallax = () => {
        const root = document.documentElement;
        const scroller = document.scrollingElement || document.documentElement;
        let targetPercent = 0;
        let renderedPercent = 0;
        let rafId = 0;

        const apply = value => root.style.setProperty('--bg-texture-pan-x', `${value.toFixed(3)}%`);
        const tick = () => {
            rafId = 0;
            const delta = targetPercent - renderedPercent;
            renderedPercent += delta * 0.16;
            if (Math.abs(delta) < 0.03) renderedPercent = targetPercent;
            apply(renderedPercent);
            if (renderedPercent !== targetPercent) rafId = requestAnimationFrame(tick);
        };
        const updateTarget = () => {
            const maxScroll = Math.max(1, scroller.scrollHeight - scroller.clientHeight);
            const progress = Math.min(1, Math.max(0, scroller.scrollTop / maxScroll));
            targetPercent = progress * 100;
            if (!rafId) rafId = requestAnimationFrame(tick);
        };
        addEventListener('scroll', updateTarget, { passive: true });
        addEventListener('resize', updateTarget, { passive: true });
        addEventListener('orientationchange', updateTarget, { passive: true });
        targetPercent = 0;
        renderedPercent = 0;
        apply(0);
        updateTarget();
    };
    const initCursorOverlay = () => {
        if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;
        const cursor = document.createElement('img');
        let x = -9999;
        let y = -9999;
        let visible = false;
        let needsPaint = true;
        let rafId = 0;
        const cursorScale = 0.5;
        const hotspotX = 2.75;
        const hotspotY = 2.75;

        cursor.id = 'cursor-overlay';
        cursor.alt = '';
        cursor.setAttribute('aria-hidden', 'true');
        cursor.draggable = false;
        cursor.src = './Cursor.png';

        const schedulePaint = () => {
            if (rafId) return;
            rafId = requestAnimationFrame(paint);
        };

        const paint = () => {
            rafId = 0;
            if (needsPaint) {
                cursor.style.transform = `translate3d(${x - hotspotX}px, ${y - hotspotY}px, 0) scale(${cursorScale})`;
                cursor.style.opacity = visible ? '1' : '0';
                needsPaint = false;
            }
        };

        const onMove = event => {
            x = event.clientX;
            y = event.clientY;
            visible = true;
            needsPaint = true;
            schedulePaint();
        };

        document.body.appendChild(cursor);
        addEventListener('mousemove', onMove, { passive: true });
        addEventListener('mouseenter', onMove, { passive: true });
        addEventListener('mouseleave', () => { visible = false; needsPaint = true; schedulePaint() }, { passive: true });
        addEventListener('visibilitychange', () => {
            if (!document.hidden) return;
            visible = false;
            needsPaint = true;
            schedulePaint();
        });
    };

    const buildSkillCol = (title, items) => { const col = document.createElement('div'); col.className = 'col'; col.innerHTML = `<h4>${title}</h4>`; const ul = document.createElement('ul'), frag = document.createDocumentFragment(); items.forEach(t => { const li = document.createElement('li'); li.textContent = t; frag.appendChild(li) }); ul.appendChild(frag); col.appendChild(ul); return col };
    const buildGitHubActivityCol = (firstName, langSrc, streakSrc) => {
        const col = document.createElement('div');
        col.className = 'col primary-col';
        col.innerHTML = `
            <h4>GitHub Activity</h4>
            <div class="github-stats">
                <img id="githubStatsImg" src="${langSrc}" alt="${firstName}'s GitHub Language Stats" loading="lazy">
                <div class="constellation-shell">
                    <canvas id="repoConstellationCanvas" class="constellation-canvas" aria-label="Interactive map of featured repositories"></canvas>
                </div>
                <img id="githubStreakImg" src="${streakSrc}" alt="${firstName}'s GitHub Streak Stats" loading="lazy">
            </div>
            <div class="github-stars-total">
                <div class="github-stars-cell github-stars-cell-total">
                    <span class="github-stars-label">Total Stars</span>
                    <span id="githubStarsTotal" class="github-stars-value" aria-live="polite" aria-atomic="true">...</span>
                </div>
                <div class="github-stars-cell github-stars-cell-hover">
                    <span id="constellationHoverOutput" class="constellation-hover-output" aria-live="off"></span>
                </div>
            </div>
        `;
        return col;
    };
    const getSafeGitHubRepoUrl = rawUrl => {
        try {
            const url = new URL(String(rawUrl || ''));
            const host = url.hostname.toLowerCase();
            if (url.protocol !== 'https:') return '';
            if (host !== 'github.com' && host !== 'www.github.com') return '';
            const [owner, name] = url.pathname.split('/').filter(Boolean);
            if (!owner || !name) return '';
            return `https://github.com/${owner}/${name}`;
        } catch {
            return '';
        }
    };
    const buildCard = repo => {
        const card = document.createElement('article');
        card.className = 'card';
        const repoName = String(repo?.name || 'Untitled Repository');
        const repoDescription = String(repo?.description || 'No description provided.');
        const repoLanguage = String(repo?.language || 'Other');
        const repoUrl = getSafeGitHubRepoUrl(repo?.html_url);
        const repoStars = formatNumber(repo?.stargazers_count);
        const pushedLabel = formatRepoLastUpdated(repo);
        card.dataset.repoName = repoName.toLowerCase();
        card.dataset.repoUrl = repoUrl.toLowerCase();

        const title = document.createElement('h5');
        const titleLink = document.createElement('a');
        titleLink.textContent = repoName;
        titleLink.href = repoUrl || '#';
        if (repoUrl) {
            titleLink.target = '_blank';
            titleLink.rel = 'noopener';
        }
        title.appendChild(titleLink);

        const description = document.createElement('p');
        description.className = 'desc';
        description.textContent = repoDescription;

        const meta = document.createElement('div');
        meta.className = 'meta';
        const lang = document.createElement('span');
        lang.className = 'lang';
        lang.textContent = repoLanguage;
        const stars = document.createElement('span');
        stars.textContent = `⭐ ${repoStars}`;
        const pushed = document.createElement('span');
        pushed.textContent = `Pushed ${pushedLabel}`;
        meta.append(lang, stars, pushed);

        const actions = document.createElement('div');
        actions.className = 'actions';
        const githubLink = document.createElement('a');
        githubLink.className = 'gh-link';
        githubLink.textContent = 'View on GitHub →';
        githubLink.href = repoUrl || '#';
        if (repoUrl) {
            githubLink.target = '_blank';
            githubLink.rel = 'noopener';
        }
        actions.appendChild(githubLink);

        card.append(title, description, meta, actions);
        card.addEventListener('click', e => {
            if (e.target.closest('.gh-link')) return;
            e.preventDefault();
            if (!repoUrl) return;
            showReadmeModal(repoName, repoUrl, repo?.default_branch);
        });
        return card;
    };
    const buildPaperCard = paper => {
        const card = document.createElement('article');
        card.className = 'card paper-card';
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');

        const title = document.createElement('h5');
        title.textContent = paper.title;
        card.appendChild(title);

        const desc = document.createElement('div');
        desc.className = 'desc';
        const markdownDescription = String(paper.tldr || '').replace(/^\u2022\s+/gm, '- ');
        const renderedDescription = convertMarkdownToHTML(markdownDescription).replace(/<p>((?:[-*] [^<]*(?:<br>)?)+)<\/p>/g, (_, block) => {
            const items = block.split('<br>').map(line => line.trim()).filter(Boolean).map(line => line.replace(/^[-*]\s+/, ''));
            return `<ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>`;
        });
        desc.innerHTML = sanitizeHTML(renderedDescription);
        card.appendChild(desc);

        const meta = document.createElement('div');
        meta.className = 'meta';
        const doiTag = document.createElement('span');
        doiTag.className = 'lang';
        doiTag.textContent = 'DOI';
        const doiValue = document.createElement('span');
        doiValue.className = 'paper-doi';
        doiValue.textContent = paper.doi || 'N/A';
        meta.appendChild(doiTag);
        meta.appendChild(doiValue);
        if (paper.year) {
            const year = document.createElement('span');
            year.textContent = paper.year;
            meta.appendChild(year);
        }
        card.appendChild(meta);

        const actions = document.createElement('div');
        actions.className = 'actions';
        const readHint = document.createElement('span');
        readHint.className = 'gh-link paper-read-hint';
        readHint.textContent = 'Read PDF →';
        actions.appendChild(readHint);
        card.appendChild(actions);

        const open = () => showPaperModal(paper);
        card.addEventListener('click', open);
        card.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                open();
            }
        });
        return card;
    };
    const renderPublishedWork = papers => {
        const cfg = SITE.publishedWork || {};
        if (els.publishedTitle) els.publishedTitle.textContent = cfg.sectionTitle || 'Published Work';
        if (!els.publishedGrid) return;
        els.publishedGrid.innerHTML = '';
        if (!papers.length) {
            if (els.publishedEmpty) {
                els.publishedEmpty.textContent = cfg.emptyMessage || 'No published papers configured yet.';
                els.publishedEmpty.hidden = false;
            }
            return;
        }
        if (els.publishedEmpty) els.publishedEmpty.hidden = true;
        const frag = document.createDocumentFragment();
        papers.forEach(p => frag.appendChild(buildPaperCard(p)));
        els.publishedGrid.appendChild(frag);
        requestAnimationFrame(animateCards);
    };
    const loadPublishedWork = async () => {
        const items = Array.isArray(SITE?.publishedWork?.items) ? SITE.publishedWork.items : [];
        if (!items.length) { renderPublishedWork([]); return }
        const papers = (await Promise.all(items.map(buildPublishedEntry))).filter(Boolean);
        renderPublishedWork(papers);
    };

    const prettifyHost = url => {
        try {
            return new URL(url).hostname.replace(/^www\./, '').split('.')[0]
                .replace(/[-_]/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
        } catch {
            return 'Elsewhere';
        }
    };
    const prettifyPath = url => {
        try {
            const path = decodeURIComponent(new URL(url).pathname).replace(/\/$/, '');
            const segment = path.split('/').filter(Boolean).pop() || '';
            return segment.replace(/[-_]/g, ' ').replace(/\b\w/g, char => char.toUpperCase()) || prettifyHost(url);
        } catch {
            return prettifyHost(url);
        }
    };
    const getElsewhereTitle = entry => {
        const title = String(entry.title || '').trim();
        const site = String(entry.siteName || '').trim();
        if (!title || title.toLowerCase() === site.toLowerCase() || /making sure you('|’)re not a bot/i.test(title)) return prettifyPath(entry.url);
        return title;
    };
    const getElsewhereSiteName = entry => String(entry.siteName || prettifyHost(entry.url))
        .split(/\s[|–—-]\s/)[0]
        .trim();
    const buildElsewhereCard = entry => {
        const card = document.createElement('a');
        card.className = 'elsewhere-card';
        card.href = entry.url;
        card.target = '_blank';
        card.rel = 'noopener';
        const siteName = getElsewhereSiteName(entry);
        const articleTitle = getElsewhereTitle(entry);
        card.setAttribute('aria-label', `Open ${articleTitle} on ${siteName}`);

        const image = document.createElement('img');
        image.className = 'elsewhere-card-image';
        image.src = entry.image || entry.icon || '';
        image.alt = '';
        image.loading = 'lazy';
        image.addEventListener('error', () => {
            if (entry.icon && !image.dataset.iconFallback) {
                image.dataset.iconFallback = 'true';
                image.src = entry.icon;
                return;
            }
            image.hidden = true;
            card.classList.add('elsewhere-card-no-image');
        });

        const copy = document.createElement('div');
        copy.className = 'elsewhere-card-copy';
        const site = document.createElement('p');
        site.className = 'elsewhere-card-site';
        site.textContent = siteName;
        const title = document.createElement('h4');
        title.textContent = articleTitle;
        copy.append(site, title);
        if (image.src) card.append(image);
        card.append(copy);
        return card;
    };
    const renderElsewhere = entries => {
        const cfg = SITE.elsewhere || {};
        if (els.elsewhereTitle) els.elsewhereTitle.textContent = cfg.sectionTitle || 'Elsewhere';
        if (!els.elsewhereTrack || !entries.length) return;
        els.elsewhereTrack.classList.remove('is-carousel');
        els.elsewhereTrack.innerHTML = '';
        const cards = entries.map(buildElsewhereCard);
        const duplicateCards = entries.map(buildElsewhereCard);
        duplicateCards.forEach(card => {
            card.setAttribute('aria-hidden', 'true');
            card.tabIndex = -1;
        });
        els.elsewhereTrack.append(...cards, ...duplicateCards);
        requestAnimationFrame(() => els.elsewhereTrack.classList.add('is-carousel'));
    };
    const loadElsewhere = async () => {
        const urls = Array.isArray(SITE?.elsewhere?.items) ? SITE.elsewhere.items : [];
        if (!urls.length) return;
        try {
            const response = await fetch('./assets/data/elsewhere.json', { cache: 'no-cache' });
            if (!response.ok) throw new Error(String(response.status));
            const storedEntries = await response.json();
            const byUrl = new Map(storedEntries.map(entry => [entry.url, entry]));
            renderElsewhere(urls.map(url => byUrl.get(url) || { url, siteName: prettifyHost(url), title: new URL(url).pathname.replace(/^\//, '') || url }));
        } catch {
            renderElsewhere(urls.map(url => ({ url, siteName: prettifyHost(url), title: new URL(url).pathname.replace(/^\//, '') || url })));
        }
    };

    const sorters = {
        updated: (a, b) => getRepoUpdatedTimestamp(b) - getRepoUpdatedTimestamp(a),
        stars: (a, b) => b.stargazers_count - a.stargazers_count,
        name: (a, b) => a.name.localeCompare(b.name)
    };
    const updateFilterChips = state => { els.filters.innerHTML = ''; const langs = ['All', ...Array.from(state.languages).filter(l => l !== 'All').sort()], frag = document.createDocumentFragment(); langs.forEach(lang => { const chip = document.createElement('button'); chip.className = 'chip neo-btn'; chip.type = 'button'; chip.setAttribute('aria-pressed', String(state.filter === lang)); chip.innerHTML = `<span class="chip-label neo-btn-label">${lang}</span>`; chip.addEventListener('click', () => { state.filter = lang; renderProjects(state) }); frag.appendChild(chip) }); els.filters.appendChild(frag) };
    const observer = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('animate-in'); observer.unobserve(e.target) } }), { threshold: .1, rootMargin: '50px' });
    const animateCards = () => $$('.card').forEach(c => { c.classList.remove('animate-in'); observer.observe(c) });

    const renderProjects = state => {
        const groups = { dev: [], ai: [], enterprise: [] };
        for (const r of state.repos) if (state.filter === 'All' || r.language === state.filter) groups[r.__group].push(r);
        Object.keys(groups).forEach(k => groups[k].sort(sorters[state.sort]));
        const map = { ai: els.gridAI, enterprise: els.gridEnt, dev: els.gridDev };
        for (const [k, grid] of Object.entries(map)) {
            grid.innerHTML = ''; const list = groups[k];
            if (!list.length) { grid.innerHTML = `<div class="empty">${SITE.terminal.messages.noProjectsFound}</div>`; continue }
            const frag = document.createDocumentFragment(); list.forEach(p => frag.appendChild(buildCard(p))); grid.appendChild(frag);
        }
        updateFilterChips(state); requestAnimationFrame(animateCards);
    };

    const loadRepos = async state => {
        const results = (await Promise.all(SITE.repos.map(async item => { const p = parseRepoPath(item.url); if (!p) return null; const d = await fetchRepo(p.owner, p.name); d.__group = item.group; return d }))).filter(Boolean);
        results.forEach(d => { if (d.language) state.languages.add(d.language) });
        state.repos = results;
        setFeaturedStarsTotal(results);
        renderProjects(state);
        if (repoConstellation) {
            try {
                repoConstellation.setRepos(results);
            } catch {
                repoConstellation = null;
            }
        }
    };

    const state = { repos: [], filter: 'All', sort: 'updated', languages: new Set(['All']) };
    const focusRepoCard = repo => {
        const targetUrl = String(repo?.html_url || '').toLowerCase();
        const targetName = String(repo?.name || '').toLowerCase();
        if (!targetUrl && !targetName) return;
        if (state.filter !== 'All') {
            state.filter = 'All';
            renderProjects(state);
        }
        const cards = $$('#projects .card');
        const targetCard = cards.find(card => card.dataset.repoUrl === targetUrl || card.dataset.repoName === targetName);
        if (!targetCard) {
            document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
        }
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        targetCard.classList.add('animate-in');
    };

    const init = () => {
        initScrollStartAtTop();
        const githubUsername = getGitHubUsername(SITE);
        GH_LANG_SOURCES = buildGitHubLangSources(githubUsername);
        GH_STREAK_SOURCES = buildGitHubStreakSources(githubUsername);
        els.brandName.textContent = SITE.name; els.footerName.textContent = SITE.name; els.brandTag.textContent = SITE.tagline; els.heroTitle.textContent = SITE.hero.title; els.heroTitle.setAttribute('data-text', SITE.hero.title); els.heroParagraph.innerHTML = sanitizeHTML(SITE.hero.paragraph);
        els.linkGithub.href = SITE.socials.github; els.linkLinkedIn.href = SITE.socials.linkedin; els.linkEmail.href = SITE.socials.email;
        els.skillsGrid.innerHTML = '';
        const statsCol = buildGitHubActivityCol(SITE.name.split(' ')[0], GH_LANG_SOURCES.light[0] || '', GH_STREAK_SOURCES.light[0] || '');
        els.skillsGrid.appendChild(statsCol); els.langImg = $('#githubStatsImg'); els.streakImg = $('#githubStreakImg'); els.starsTotal = $('#githubStarsTotal'); els.constellationHoverOutput = $('#constellationHoverOutput');
        els.constellationCanvas = $('#repoConstellationCanvas');
        const skillSections = [
            [SITE.terminal.messages.developmentTitle, SITE.skills.development],
            [SITE.terminal.messages.automationTitle, SITE.skills.automation],
            [SITE.terminal.messages.systemsTitle, SITE.skills.systems]
        ];
        skillSections.forEach(([title, items]) => {
            if (!Array.isArray(items) || !items.length) return;
            els.skillsGrid.appendChild(buildSkillCol(title, items));
        });
        els.year.textContent = new Date().getFullYear();
        initSidebar(els, SITE);
        initViewportScanHeight();
        initTextureParallax();
        initCursorOverlay();
        initTheme(); initHeaderScroll();
        try {
            repoConstellation = new RepoConstellation(
                els.constellationCanvas,
                els.constellationHoverOutput,
                repo => focusRepoCard(repo)
            );
        } catch {
            repoConstellation = null;
        }
        els.sort?.addEventListener('change', e => { state.sort = e.target.value; renderProjects(state) });
        initModal();
        if (els.terminalTitle) els.terminalTitle.textContent = SITE.terminal.title;
        if (els.currentPrompt) els.currentPrompt.textContent = SITE.terminal.prompt;
        new Terminal();
        loadPublishedWork().catch(() => renderPublishedWork([]));
        loadElsewhere();
        loadRepos(state).catch(() => {
            els.projectsEmpty.hidden = false;
            setStarsTotal(NaN, false);
            repoConstellation?.setTooltip('Unable to load repositories right now.');
        });
    };

export const startApp = () => {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
};
