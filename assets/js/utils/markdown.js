const ALLOWED_TAGS = new Set(['H1', 'H2', 'H3', 'P', 'STRONG', 'EM', 'PRE', 'CODE', 'A', 'UL', 'LI', 'BR']);
const escapeHTML = value => String(value || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
export const sanitizeHTML = html => {
    const t = document.createElement('template');
    t.innerHTML = String(html || '');
    Array.from(t.content.querySelectorAll('*')).forEach(node => {
        if (!ALLOWED_TAGS.has(node.tagName)) return node.replaceWith(document.createTextNode(node.textContent || ''));
        Array.from(node.attributes).forEach(attr => {
            const name = attr.name.toLowerCase(), value = String(attr.value || '').trim();
            if (name.startsWith('on') || name === 'style' || (node.tagName === 'A' && name === 'href' && !/^https?:\/\//i.test(value))) node.removeAttribute(attr.name);
        });
        if (node.tagName === 'A') { node.setAttribute('target', '_blank'); node.setAttribute('rel', 'noopener') }
    });
    return t.innerHTML;
};

export const convertMarkdownToHTML = md => escapeHTML(md)
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\[([^\[]+)\]\(([^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/^(?!<)(.*)$/gim, '<p>$1</p>')
    .replace(/<p><\/p>/g, '')
    .replace(/^\s*[\-\*] (.*$)/gim, '<li>$1</li>')
    .replace(/(<li>[\s\S]*<\/li>)/, '<ul>$1</ul>');
