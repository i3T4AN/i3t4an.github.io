import { readFile, mkdir, writeFile } from 'node:fs/promises';
import vm from 'node:vm';

const configSource = await readFile(new URL('../config.js', import.meta.url), 'utf8');
const sandbox = { window: {} };
vm.runInNewContext(configSource, sandbox, { filename: 'config.js' });
const urls = sandbox.window.SITE?.elsewhere?.items || [];

const decode = value => String(value || '')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\s+/g, ' ')
    .trim();
const attribute = (html, property) => {
    const escaped = property.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const patterns = [
        new RegExp(`<meta[^>]+(?:property|name)=["']${escaped}["'][^>]+content=["']([^"']*)["'][^>]*>`, 'i'),
        new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+(?:property|name)=["']${escaped}["'][^>]*>`, 'i')
    ];
    for (const pattern of patterns) {
        const match = html.match(pattern);
        if (match?.[1]) return decode(match[1]);
    }
    return '';
};
const pageTitle = html => decode(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]);
const resolveUrl = (value, pageUrl) => {
    try { return new URL(value, pageUrl).href } catch { return '' }
};
const getIcon = (html, pageUrl) => {
    const match = html.match(/<link[^>]+rel=["'][^"']*(?:icon|shortcut icon)[^"']*["'][^>]+href=["']([^"']+)["'][^>]*>/i)
        || html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["'][^"']*(?:icon|shortcut icon)[^"']*["'][^>]*>/i);
    return resolveUrl(match?.[1] || '/favicon.ico', pageUrl);
};
const hostName = url => new URL(url).hostname.replace(/^www\./, '').split('.')[0]
    .replace(/[-_]/g, ' ').replace(/\b\w/g, char => char.toUpperCase());

const entries = await Promise.all(urls.map(async url => {
    try {
        const response = await fetch(url, {
            headers: { 'user-agent': 'Mozilla/5.0 (compatible; i3T4AN-Portfolio/1.0; +https://i3t4an.github.io/)' },
            redirect: 'follow',
            signal: AbortSignal.timeout(25000)
        });
        if (!response.ok) throw new Error(`${response.status}`);
        const html = await response.text();
        return {
            url,
            title: attribute(html, 'og:title') || attribute(html, 'twitter:title') || pageTitle(html) || hostName(url),
            siteName: attribute(html, 'og:site_name') || hostName(url),
            image: resolveUrl(attribute(html, 'og:image') || attribute(html, 'twitter:image'), response.url),
            icon: getIcon(html, response.url)
        };
    } catch (error) {
        console.warn(`Metadata unavailable for ${url}: ${error.message}`);
        return { url, title: hostName(url), siteName: hostName(url), image: '', icon: resolveUrl('/favicon.ico', url) };
    }
}));

await mkdir(new URL('../assets/data/', import.meta.url), { recursive: true });
await writeFile(new URL('../assets/data/elsewhere.json', import.meta.url), `${JSON.stringify(entries, null, 2)}\n`);
console.log(`Wrote metadata for ${entries.length} Elsewhere links.`);
