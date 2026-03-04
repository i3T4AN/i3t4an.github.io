/* Portfolio Main Script - Ethan Blair */
(() => {
    'use strict';
    const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

    const els = {
        brandName: $('#brandName'), footerName: $('#footerName'), brandTag: $('#brandTag'), heroTitle: $('#heroTitle'), heroParagraph: $('#heroParagraph'),
        linkGithub: $('#linkGithub'), linkLinkedIn: $('#linkLinkedIn'), linkEmail: $('#linkEmail'),
        skillsGrid: $('#skillsGrid'), year: $('#year'), jsonld: $('#jsonld'), sort: $('#sort'),
        header: $('header'), filters: $('#filters'), gridDev: $('#grid-dev'), gridAI: $('#grid-ai'), gridEnt: $('#grid-enterprise'),
        projectsEmpty: $('#projects-empty'), themeToggle: $('#themeToggle'), themeIcon: $('#themeIcon'), themeText: $('#themeText'),
        langImg: null, streakImg: null,
        terminalBody: $('#terminalBody'), terminalInput: $('#terminalInput'), terminalOutput: $('#terminalOutput'),
        terminalClose: $('#terminalClose'), terminalMaximize: $('#terminalMaximize'), matrixCanvas: $('#matrixCanvas'),
        terminalTitle: $('#terminalTitle'), currentPrompt: $('#currentPrompt'),
        readmeModal: $('#readmeModal'), modalTitle: $('#modalTitle'), modalBody: $('#modalBody'), modalClose: $('#modalClose'), modalGitHubLink: $('#modalGitHubLink')
    };

    // Modal - simplified with single hide function
    const hideModal = () => els.readmeModal.style.display = 'none';
    const initModal = () => {
        els.modalClose.addEventListener('click', hideModal);
        els.readmeModal.addEventListener('click', e => { if (e.target === els.readmeModal) hideModal() });
        document.addEventListener('keydown', e => { if (e.key === 'Escape' && els.readmeModal.style.display === 'block') hideModal() });
    };

    const fetchReadme = async (owner, repo) => {
        const res = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/main/README.md`);
        if (!res.ok) throw new Error(`Failed: ${res.status}`);
        return res.text();
    };

    const showReadmeModal = async (repoName, repoUrl) => {
        const parsed = parseRepoPath(repoUrl);
        if (!parsed) { els.modalBody.innerHTML = '<div class="error">Invalid repository URL</div>'; return }
        els.modalTitle.textContent = `${repoName} - README`;
        els.modalBody.innerHTML = '<div class="loading">Loading README...</div>';
        els.modalGitHubLink.href = repoUrl;
        els.readmeModal.style.display = 'block';
        try {
            const content = await fetchReadme(parsed.owner, parsed.name);
            els.modalBody.innerHTML = `<div class="readme-content">${convertMarkdownToHTML(content)}</div>`;
        } catch (e) { els.modalBody.innerHTML = `<div class="error">Unable to load README: ${e.message}</div>` }
    };

    const convertMarkdownToHTML = md => md
        .replace(/^### (.*$)/gim, '<h3>$1</h3>').replace(/^## (.*$)/gim, '<h2>$1</h2>').replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>').replace(/\*(.*?)\*/gim, '<em>$1</em>')
        .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>').replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/\[([^\[]+)\]\(([^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
        .replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>').replace(/^(?!<)(.*)$/gim, '<p>$1</p>')
        .replace(/<p><\/p>/g, '').replace(/^\s*[\-\*] (.*$)/gim, '<li>$1</li>').replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

    // Terminal - consolidated output method
    class Terminal {
        constructor() {
            this.history = [];
            this.historyIndex = 0;
            this.draftInput = '';
            this.maxOutputLines = 300;
            this.matrixActive = false;
            this.matrixTimeout = null;
            this.matrixRafId = null;
            this.matrixResizeHandler = null;
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
                'matrix': a => this.setMatrix(a),
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
            const SITE = window.SITE;
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
            const SITE = window.SITE;
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
            const SITE = window.SITE;
            this.output(SITE.terminal.messages.commandsTitle, 'help');
            Object.entries(SITE.terminal.commands).forEach(([k, v]) => this.output(`  ${k.padEnd(20)} ${v}`));
            this.output(`  ${'help'.padEnd(20)} Alias for --help`);
        }

        showAbout() {
            const SITE = window.SITE;
            this.output(SITE.hero.title, 'help');
            this.output(`\n${SITE.hero.paragraph}`, 'text', true);
        }

        showSkills() {
            const SITE = window.SITE, m = SITE.terminal.messages;
            this.output(m.skillsTitle, 'help');
            [['development', m.developmentTitle], ['automation', m.automationTitle], ['systems', m.systemsTitle]].forEach(([k, t]) => {
                this.output(`\n${t.toUpperCase()}:\n`);
                SITE.skills[k].forEach(s => this.output(`  • ${s}\n`));
            });
        }

        showProjects() {
            const SITE = window.SITE;
            this.output(SITE.terminal.messages.projectsInfo, 'help');
            this.output('\nAvailable repositories:\n');
            SITE.repos.forEach(r => { const p = parseRepoPath(r.url); if (p) this.output(`  ${p.name}\n`) });
            this.output(`\n${SITE.terminal.messages.projectsBrowse}`, 'text', true);
        }

        showProject(args) {
            const SITE = window.SITE;
            if (!args.length) { this.output(SITE.terminal.messages.projectUsage, 'error'); return }
            const repo = SITE.repos.find(r => { const p = parseRepoPath(r.url); return p && p.name.toLowerCase() === args[0].toLowerCase() });
            if (repo) {
                const p = parseRepoPath(repo.url);
                this.output(SITE.terminal.messages.projectDetails.replace('{name}', p.name), 'help');
                this.output(`\nGroup: ${repo.group}\nURL: ${repo.url}\n${SITE.terminal.messages.projectNote}`, 'text', true);
            } else this.output(`Project "${args[0]}" not found. Use "projects" to see available repositories.`, 'error');
        }

        showLinks() {
            const SITE = window.SITE, s = SITE.socials;
            this.output(SITE.terminal.messages.connectTitle, 'help');
            this.output(`\nGitHub:   ${s.github}\nLinkedIn: ${s.linkedin}\nEmail:    ${s.email.replace('mailto:', '')}`, 'text', true);
        }

        setTheme(args) {
            const SITE = window.SITE, t = args[0]?.toLowerCase();
            if (['light', 'dark', 'auto'].includes(t)) {
                if (t === 'auto') { localStorage.removeItem('theme'); applyTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') }
                else { localStorage.setItem('theme', t); applyTheme(t) }
                this.output(SITE.terminal.messages.themeSet.replace('{theme}', t), 'success');
            } else this.output(SITE.terminal.messages.themeUsage, 'error');
        }

        setMatrix(args) {
            const SITE = window.SITE, m = args[0]?.toLowerCase();
            if (m === 'on') { this.activateMatrix(); this.output(SITE.terminal.messages.matrixOn, 'success') }
            else if (m === 'off') { this.deactivateMatrix(); this.output(SITE.terminal.messages.matrixOff, 'success') }
            else this.output(SITE.terminal.messages.matrixUsage, 'error');
        }

        activateMatrix() {
            const SITE = window.SITE;
            if (this.matrixActive) return;
            this.matrixActive = true;
            const c = els.matrixCanvas, ctx = c.getContext('2d');
            const resize = () => { c.width = innerWidth; c.height = innerHeight };
            c.classList.add('active');
            resize();
            this.matrixResizeHandler = resize;
            addEventListener('resize', resize, { passive: true });
            const chars = SITE.terminal.matrix.characters, size = 14;
            let drops = Array(Math.floor(c.width / size)).fill(1);
            const draw = () => {
                if (!this.matrixActive) return;
                if (drops.length !== Math.floor(c.width / size)) drops = Array(Math.floor(c.width / size)).fill(1);
                ctx.fillStyle = 'rgba(0,0,0,0.05)';
                ctx.fillRect(0, 0, c.width, c.height);
                ctx.fillStyle = '#818cf8';
                ctx.font = `${size}px monospace`;
                drops.forEach((y, i) => {
                    ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * size, y * size);
                    if (y * size > c.height && Math.random() > .975) drops[i] = 0;
                    drops[i]++;
                });
                this.matrixRafId = requestAnimationFrame(draw);
            };
            draw();
            this.matrixTimeout = setTimeout(() => this.deactivateMatrix(), SITE.terminal.matrix.duration);
        }

        deactivateMatrix() {
            this.matrixActive = false;
            els.matrixCanvas.classList.remove('active');
            if (this.matrixRafId) { cancelAnimationFrame(this.matrixRafId); this.matrixRafId = null }
            if (this.matrixTimeout) { clearTimeout(this.matrixTimeout); this.matrixTimeout = null }
            if (this.matrixResizeHandler) {
                removeEventListener('resize', this.matrixResizeHandler);
                this.matrixResizeHandler = null;
            }
        }

        clear() { els.terminalOutput.innerHTML = '' }

        showHistory() {
            const SITE = window.SITE, h = this.history.slice(-20);
            this.output(SITE.terminal.messages.historyTitle, 'help');
            this.output('\n');
            h.forEach((c, i) => this.output(`  ${(this.history.length - h.length + i + 1).toString().padStart(3)}  ${c}\n`));
        }

        showPalette() {
            const SITE = window.SITE, vars = ['--bg-primary', '--bg-secondary', '--text-primary', '--text-secondary', '--accent', '--accent-hover', '--border', '--shadow-glow'];
            this.output(SITE.terminal.messages.paletteTitle, 'help');
            this.output('\n');
            const style = getComputedStyle(document.documentElement);
            vars.forEach(v => this.output(`${v}: ${style.getPropertyValue(v).trim()}\n`));
        }

        showWhoami() {
            const SITE = window.SITE;
            this.output(SITE.terminal.asciiArt.trimStart());
            this.output('\n');
            this.output(SITE.terminal.whoami[Math.floor(Math.random() * SITE.terminal.whoami.length)], 'help');
            this.output(`\n${SITE.terminal.messages.taglinePrefix} ${SITE.tagline}`, 'text', true);
        }
    }

    // JSON-LD
    const injectJSONLD = () => {
        const s = window.SITE, data = {
            "@context": "https://schema.org", "@type": "Person", name: s.name, url: "https://i3t4an.github.io/", email: s.socials.email,
            affiliation: { "@type": "CollegeOrUniversity", name: "University of Northern Colorado" },
            sameAs: [s.socials.github, s.socials.linkedin], jobTitle: "Programmer",
            knowsAbout: [...s.skills.development, ...s.skills.automation, ...s.skills.systems].flatMap(x => x.split(/\s*,\s*/)).filter((v, i, a) => a.indexOf(v) === i).slice(0, 15)
        };
        if (els.jsonld) { els.jsonld.type = 'application/ld+json'; els.jsonld.textContent = JSON.stringify(data) }
    };

    const parseRepoPath = url => { try { const u = new URL(url); const [owner, name] = u.pathname.slice(1).split('/'); return { owner, name } } catch { return null } };
    const relativeTime = d => { const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' }); const sec = (new Date(d) - new Date()) / 1e3; const units = [[31536e3, 'year'], [2592e3, 'month'], [604800, 'week'], [86400, 'day'], [3600, 'hour'], [60, 'minute'], [1, 'second']]; for (const [s, u] of units) { const v = sec / s; if (Math.abs(v) >= 1 || u === 'second') return rtf.format(Math.round(v), u) } };
    const cache = { get: k => { try { return JSON.parse(sessionStorage.getItem(k)) } catch { return null } }, set: (k, v) => { try { sessionStorage.setItem(k, JSON.stringify(v)) } catch { } } };

    const fetchRepo = async (owner, name) => {
        const key = `gh:${owner}/${name}`, cached = cache.get(key); if (cached) return cached;
        try {
            const res = await fetch(`https://api.github.com/repos/${owner}/${name}`, { headers: { Accept: 'application/vnd.github+json' } });
            if (!res.ok) throw new Error(res.status);
            const d = await res.json();
            const repo = { full_name: d.full_name, html_url: d.html_url, description: d.description || name.replace(/[-_]/g, ' ').replace(/\b\w/g, m => m.toUpperCase()), language: d.language || 'Other', stargazers_count: d.stargazers_count || 0, updated_at: d.updated_at || new Date().toISOString(), name, error: false };
            cache.set(key, repo); return repo;
        } catch { return { full_name: `${owner}/${name}`, html_url: `https://github.com/${owner}/${name}`, description: name.replace(/[-_]/g, ' ').replace(/\b\w/g, m => m.toUpperCase()), language: 'Other', stargazers_count: 0, updated_at: new Date().toISOString(), name, error: true } }
    };

    // Theme
    const GH_LANG_SOURCES = {
        light: [
            'https://github-readme-stats-sigma-five.vercel.app/api/top-langs?username=i3T4AN&show_icons=true&locale=en&layout=compact&theme=default&hide_border=true&custom_title=Top%20Languages&v=5'
        ],
        dark: [
            'https://github-readme-stats-sigma-five.vercel.app/api/top-langs?username=i3T4AN&show_icons=true&locale=en&layout=compact&hide_border=true&bg_color=1a1b27&title_color=A855F7&text_color=CFD6E2&icon_color=00D4FF&custom_title=Top%20Languages&v=4'
        ]
    };
    const GH_STREAK_SOURCES = {
        light: [
            'https://streak-stats.demolab.com?user=i3T4AN&theme=default&hide_border=true'
        ],
        dark: [
            'https://streak-stats.demolab.com?user=i3T4AN&theme=tokyonight&hide_border=true'
        ]
    };
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
        if (els.themeIcon) {
            els.themeIcon.innerHTML = isDark
                ? '<svg viewBox="0 0 24 24" class="social-icon" aria-hidden="true"><path fill="currentColor" d="M12 4.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 12 4.5Zm0 10.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 4.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 12 19.5ZM4.5 12a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5A.75.75 0 0 1 4.5 12Zm12 0a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5A.75.75 0 0 1 16.5 12ZM6.7 6.7a.75.75 0 0 1 1.06 0l1.06 1.06a.75.75 0 0 1-1.06 1.06L6.7 7.76a.75.75 0 0 1 0-1.06Zm8.48 8.48a.75.75 0 0 1 1.06 0l1.06 1.06a.75.75 0 0 1-1.06 1.06l-1.06-1.06a.75.75 0 0 1 0-1.06ZM6.7 17.3a.75.75 0 0 1 0-1.06l1.06-1.06a.75.75 0 0 1 1.06 1.06L7.76 17.3a.75.75 0 0 1-1.06 0Zm8.48-8.48a.75.75 0 0 1 0-1.06l1.06-1.06a.75.75 0 1 1 1.06 1.06l-1.06 1.06a.75.75 0 0 1-1.06 0Z"/></svg>'
                : '<svg viewBox="0 0 24 24" class="social-icon" aria-hidden="true"><path fill="currentColor" d="M14.72 3.24a.75.75 0 0 1 .24.94 7.5 7.5 0 0 0 9.36 10.06.75.75 0 0 1 .94.94A9 9 0 1 1 13.78 2.76a.75.75 0 0 1 .94.48Z"/></svg>';
        }
        if (els.themeText) els.themeText.textContent = isDark ? 'Light' : 'Dark';
        els.themeToggle?.setAttribute('aria-pressed', String(isDark));
    };
    const updateGitHubStats = isDark => { const mode = isDark ? 'dark' : 'light'; setImageWithFallback(els.langImg, GH_LANG_SOURCES[mode]); setImageWithFallback(els.streakImg, GH_STREAK_SOURCES[mode]) };
    const applyTheme = t => { const isDark = t === 'dark'; document.documentElement.classList.toggle('theme-dark', isDark); updateThemeButton(isDark); updateGitHubStats(isDark) };
    const initTheme = () => {
        const saved = localStorage.getItem('theme');
        applyTheme(saved || 'dark');
        els.themeToggle?.addEventListener('click', () => { const isDark = document.documentElement.classList.toggle('theme-dark'); localStorage.setItem('theme', isDark ? 'dark' : 'light'); updateThemeButton(isDark); updateGitHubStats(isDark) });
    };
    const initHeaderScroll = () => addEventListener('scroll', () => els.header.classList.toggle('scrolled', scrollY > 20), { passive: true });

    // DOM builders
    const buildSkillCol = (title, items) => { const col = document.createElement('div'); col.className = 'col'; col.innerHTML = `<h4>${title}</h4>`; const ul = document.createElement('ul'), frag = document.createDocumentFragment(); items.forEach(t => { const li = document.createElement('li'); li.textContent = t; frag.appendChild(li) }); ul.appendChild(frag); col.appendChild(ul); return col };
    const buildCard = repo => {
        const card = document.createElement('article'); card.className = 'card';
        card.innerHTML = `<h5><a href="${repo.html_url}" target="_blank" rel="noopener">${repo.name}</a></h5><p class="desc">${repo.description}</p><div class="meta"><span class="lang">${repo.language}</span><span>⭐ ${repo.stargazers_count}</span><span>${relativeTime(repo.updated_at)}</span></div><div class="actions"><a class="gh-link" href="${repo.html_url}" target="_blank" rel="noopener">View on GitHub →</a></div>`;
        card.addEventListener('click', e => { if (!e.target.closest('.gh-link')) { e.preventDefault(); showReadmeModal(repo.name, repo.html_url) } });
        return card;
    };

    const sorters = { updated: (a, b) => new Date(b.updated_at) - new Date(a.updated_at), stars: (a, b) => b.stargazers_count - a.stargazers_count, name: (a, b) => a.name.localeCompare(b.name) };
    const updateFilterChips = state => { els.filters.innerHTML = ''; const langs = ['All', ...Array.from(state.languages).filter(l => l !== 'All').sort()], frag = document.createDocumentFragment(); langs.forEach(lang => { const chip = document.createElement('button'); chip.className = 'chip neo-btn'; chip.type = 'button'; chip.setAttribute('aria-pressed', String(state.filter === lang)); chip.innerHTML = `<span class="chip-label neo-btn-label">${lang}</span>`; chip.addEventListener('click', () => { state.filter = lang; renderProjects(state) }); frag.appendChild(chip) }); els.filters.appendChild(frag) };
    const observer = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('animate-in'); observer.unobserve(e.target) } }), { threshold: .1, rootMargin: '50px' });
    const animateCards = () => $$('.card').forEach(c => { c.classList.remove('animate-in'); observer.observe(c) });

    const renderProjects = state => {
        const SITE = window.SITE, groups = { dev: [], ai: [], enterprise: [] };
        for (const r of state.repos) if (state.filter === 'All' || r.language === state.filter) groups[r.__group].push(r);
        Object.keys(groups).forEach(k => groups[k].sort(sorters[state.sort]));
        const map = { dev: els.gridDev, ai: els.gridAI, enterprise: els.gridEnt };
        for (const [k, grid] of Object.entries(map)) {
            grid.innerHTML = ''; const list = groups[k];
            if (!list.length) { grid.innerHTML = `<div class="empty">${SITE.terminal.messages.noProjectsFound}</div>`; continue }
            const frag = document.createDocumentFragment(); list.forEach(p => frag.appendChild(buildCard(p))); grid.appendChild(frag);
        }
        updateFilterChips(state); requestAnimationFrame(animateCards);
    };

    const loadRepos = async state => {
        const SITE = window.SITE;
        const results = (await Promise.all(SITE.repos.map(async item => { const p = parseRepoPath(item.url); if (!p) return null; const d = await fetchRepo(p.owner, p.name); d.__group = item.group; return d }))).filter(Boolean);
        results.forEach(d => { if (d.language) state.languages.add(d.language) });
        state.repos = results; renderProjects(state);
    };

    const state = { repos: [], filter: 'All', sort: 'updated', languages: new Set(['All']) };

    const init = () => {
        const SITE = window.SITE;
        els.brandName.textContent = SITE.name; els.footerName.textContent = SITE.name; els.brandTag.textContent = SITE.tagline; els.heroTitle.textContent = SITE.hero.title; els.heroTitle.setAttribute('data-text', SITE.hero.title); els.heroParagraph.textContent = SITE.hero.paragraph;
        els.linkGithub.href = SITE.socials.github; els.linkLinkedIn.href = SITE.socials.linkedin; els.linkEmail.href = SITE.socials.email;
        els.skillsGrid.innerHTML = '';
        const statsCol = document.createElement('div'); statsCol.className = 'col primary-col'; statsCol.innerHTML = `<h4>GitHub Activity</h4><div class="github-stats"><img id="githubStatsImg" src="${GH_LANG_SOURCES.light[0]}" alt="${SITE.name.split(' ')[0]}'s GitHub Language Stats" loading="lazy"><img id="githubStreakImg" src="${GH_STREAK_SOURCES.light[0]}" alt="${SITE.name.split(' ')[0]}'s GitHub Streak Stats" loading="lazy"></div>`;
        els.skillsGrid.appendChild(statsCol); els.langImg = $('#githubStatsImg'); els.streakImg = $('#githubStreakImg');
        els.skillsGrid.appendChild(buildSkillCol(SITE.terminal.messages.developmentTitle, SITE.skills.development));
        els.skillsGrid.appendChild(buildSkillCol(SITE.terminal.messages.automationTitle, SITE.skills.automation));
        els.skillsGrid.appendChild(buildSkillCol(SITE.terminal.messages.systemsTitle, SITE.skills.systems));
        els.year.textContent = new Date().getFullYear();
        initTheme(); initHeaderScroll();
        els.sort?.addEventListener('change', e => { state.sort = e.target.value; renderProjects(state) });
        injectJSONLD(); initModal();
        if (els.terminalTitle) els.terminalTitle.textContent = SITE.terminal.title;
        if (els.currentPrompt) els.currentPrompt.textContent = SITE.terminal.prompt;
        new Terminal();
        loadRepos(state).catch(() => els.projectsEmpty.hidden = false);
    };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
