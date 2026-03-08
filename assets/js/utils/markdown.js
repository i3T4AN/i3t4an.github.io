const ALLOWED_TAGS = new Set([
    'H1', 'H2', 'H3', 'P', 'STRONG', 'EM', 'PRE', 'CODE', 'A', 'UL', 'LI', 'BR',
    'TABLE', 'THEAD', 'TBODY', 'TR', 'TH', 'TD'
]);
const SAFE_HREF_RE = /^(https?:\/\/|mailto:)/i;
const escapeHTML = value => String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export const sanitizeHTML = html => {
    const t = document.createElement('template');
    t.innerHTML = String(html || '');
    Array.from(t.content.querySelectorAll('*')).forEach(node => {
        if (!ALLOWED_TAGS.has(node.tagName)) {
            node.replaceWith(document.createTextNode(node.textContent || ''));
            return;
        }
        Array.from(node.attributes).forEach(attr => {
            const name = attr.name.toLowerCase();
            const value = String(attr.value || '').trim();
            if (name.startsWith('on') || name === 'style') {
                node.removeAttribute(attr.name);
                return;
            }
            if (node.tagName === 'A' && name === 'href' && !SAFE_HREF_RE.test(value)) {
                node.removeAttribute(attr.name);
                return;
            }
            if (node.tagName !== 'A' || (name !== 'href' && name !== 'target' && name !== 'rel')) {
                node.removeAttribute(attr.name);
            }
        });
        if (node.tagName === 'A') {
            node.setAttribute('target', '_blank');
            node.setAttribute('rel', 'noopener');
        }
    });
    return t.innerHTML;
};

const renderInline = text => {
    const codeSplit = String(text || '').split(/(`[^`]*`)/g);
    return codeSplit.map(part => {
        if (/^`[^`]*`$/.test(part)) return `<code>${escapeHTML(part.slice(1, -1))}</code>`;
        return escapeHTML(part)
            .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+|mailto:[^)\s]+)\)/gi, '<a href="$2">$1</a>')
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/\*([^*]+)\*/g, '<em>$1</em>');
    }).join('');
};

const parseTableRow = row => {
    const trimmed = String(row || '').trim().replace(/^\|/, '').replace(/\|$/, '');
    return trimmed.split('|').map(cell => cell.trim());
};

const isTableSeparator = row => {
    const cells = parseTableRow(row);
    if (!cells.length) return false;
    return cells.every(cell => /^:?-{3,}:?$/.test(cell));
};

export const convertMarkdownToHTML = md => {
    const lines = String(md || '').replace(/\r/g, '').split('\n');
    const out = [];
    let i = 0;
    const isTableHeaderAt = idx => (
        idx >= 0 &&
        idx + 1 < lines.length &&
        lines[idx].includes('|') &&
        isTableSeparator(lines[idx + 1])
    );

    while (i < lines.length) {
        const line = lines[i];
        if (!line.trim()) {
            i++;
            continue;
        }

        if (/^```/.test(line)) {
            const code = [];
            i++;
            while (i < lines.length && !/^```/.test(lines[i])) {
                code.push(lines[i]);
                i++;
            }
            if (i < lines.length) i++;
            out.push(`<pre><code>${escapeHTML(code.join('\n'))}</code></pre>`);
            continue;
        }

        const h = line.match(/^(#{1,3})\s+(.+)$/);
        if (h) {
            const level = h[1].length;
            out.push(`<h${level}>${renderInline(h[2].trim())}</h${level}>`);
            i++;
            continue;
        }

        if (/^\s*[-*]\s+/.test(line)) {
            const items = [];
            while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
                items.push(lines[i].replace(/^\s*[-*]\s+/, ''));
                i++;
            }
            out.push(`<ul>${items.map(item => `<li>${renderInline(item.trim())}</li>`).join('')}</ul>`);
            continue;
        }

        if (isTableHeaderAt(i)) {
            const headerCells = parseTableRow(line);
            i += 2;
            const bodyRows = [];
            while (i < lines.length && lines[i].trim() && lines[i].includes('|')) {
                bodyRows.push(parseTableRow(lines[i]));
                i++;
            }
            const headerHtml = `<tr>${headerCells.map(cell => `<th>${renderInline(cell)}</th>`).join('')}</tr>`;
            const bodyHtml = bodyRows.map(row => `<tr>${row.map(cell => `<td>${renderInline(cell)}</td>`).join('')}</tr>`).join('');
            out.push(`<table><thead>${headerHtml}</thead><tbody>${bodyHtml}</tbody></table>`);
            continue;
        }

        const para = [];
        while (
            i < lines.length &&
            lines[i].trim() &&
            !/^```/.test(lines[i]) &&
            !/^(#{1,3})\s+/.test(lines[i]) &&
            !/^\s*[-*]\s+/.test(lines[i]) &&
            !isTableHeaderAt(i)
        ) {
            para.push(lines[i]);
            i++;
        }
        out.push(`<p>${renderInline(para.join(' ').trim())}</p>`);
    }

    return out.join('\n');
};
