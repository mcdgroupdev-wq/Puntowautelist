import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const prerenderDir = path.join(rootDir, '.prerender');

const SITE_URL = 'https://usepunto.com';

const ROUTES = [
  {
    route: '/',
    outFile: path.join(distDir, 'index.html'),
    title: 'Punto – App para encontrar cofundador y socios para tu startup',
    description:
      'Punto conecta emprendedores para encontrar cofundador, socio técnico o equipo. Únete a la lista de espera.',
  },
  {
    route: '/privacidad',
    outFile: path.join(distDir, 'privacidad', 'index.html'),
    title: 'Política de privacidad – Punto',
    description:
      'Política de privacidad de Punto (MCD Group): información sobre cómo recopilamos, utilizamos, protegemos y gestionamos los datos de los usuarios.',
  },
  {
    route: '/terminos',
    outFile: path.join(distDir, 'terminos', 'index.html'),
    title: 'Términos y condiciones – Punto',
    description:
      'Términos y condiciones de uso de Punto (MCD Group), la app para emprendedores que buscan cofundadores, socios y colaboradores.',
  },
  {
    route: '/aviso-legal',
    outFile: path.join(distDir, 'aviso-legal', 'index.html'),
    title: 'Aviso legal – Punto',
    description:
      'Aviso legal e información identificativa de Punto y MCD Group conforme a la LSSI-CE.',
  },
  {
    route: '/seguridad-infantil',
    outFile: path.join(distDir, 'seguridad-infantil', 'index.html'),
    title: 'Estándares de seguridad infantil – Punto',
    description:
      'Estándares de seguridad infantil de PUNTO (MCD Group): directrices sobre conductas prohibidas y protocolos de denuncia CSAE/CSAM.',
  },
  {
    route: '/eliminar-cuenta',
    outFile: path.join(distDir, 'eliminar-cuenta', 'index.html'),
    title: 'Eliminar tu cuenta de Punto',
    description:
      'Cómo solicitar la eliminación de tu cuenta y datos personales en la app Punto (MCD Group): desde la app o por correo electrónico.',
  },
];

const SITEMAP_PATHS = [
  '/',
  '/privacidad',
  '/terminos',
  '/seguridad-infantil',
  '/eliminar-cuenta',
];

function escapeHtmlAttr(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeHtmlText(value) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function normalizeSsrMotionStyles(html) {
  // Motion SSR emits inline initial styles (like opacity:0) that stay invisible if JS is disabled.
  return html.replace(/opacity:\s*0(?=[;"])/g, 'opacity:1');
}

function writeSitemapAndRobots() {
  const lastmod = new Date().toISOString().split('T')[0];

  const urlEntries = SITEMAP_PATHS.map((routePath) => {
    const loc = `${SITE_URL}${routePath}`;
    const priority = routePath === '/' ? '1.0' : '0.8';
    const changefreq = routePath === '/' ? 'weekly' : 'monthly';
    return [
      '  <url>',
      `    <loc>${loc}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      `    <changefreq>${changefreq}</changefreq>`,
      `    <priority>${priority}</priority>`,
      '  </url>',
    ].join('\n');
  }).join('\n');

  const sitemapXml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urlEntries,
    '</urlset>',
    '',
  ].join('\n');

  const robotsTxt = [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    '',
  ].join('\n');

  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf8');
  fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsTxt, 'utf8');
}

async function run() {
  const templatePath = path.join(distDir, 'index.html');
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Missing built client template at ${templatePath}`);
  }
  const templateHtml = fs.readFileSync(templatePath, 'utf8');

  const ssrEntry = path.join(prerenderDir, 'prerender.js');
  if (!fs.existsSync(ssrEntry)) {
    throw new Error(`Missing SSR prerender bundle at ${ssrEntry}`);
  }

  const { renderRoute } = await import(pathToFileURL(ssrEntry).href);

  for (const item of ROUTES) {
    const rawMarkup = renderRoute(item.route);
    const visibleMarkup = normalizeSsrMotionStyles(rawMarkup);
    const safeTitle = escapeHtmlText(item.title);
    const safeTitleAttr = escapeHtmlAttr(item.title);
    const safeDesc = escapeHtmlAttr(item.description);
    const canonicalUrl = `${SITE_URL}${item.route}`;

    let pageHtml = templateHtml
      .replace(/<title>[\s\S]*?<\/title>/, `<title>${safeTitle}</title>`)
      .replace(
        /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
        `<meta name="description" content="${safeDesc}" />`,
      )
      .replace(
        /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
        `<link rel="canonical" href="${canonicalUrl}" />`,
      )
      .replace(
        /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/,
        `<meta property="og:url" content="${canonicalUrl}" />`,
      )
      .replace(
        /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/,
        `<meta property="og:title" content="${safeTitleAttr}" />`,
      )
      .replace(
        /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/,
        `<meta property="og:description" content="${safeDesc}" />`,
      )
      .replace(
        /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/,
        `<meta name="twitter:title" content="${safeTitleAttr}" />`,
      )
      .replace(
        /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/,
        `<meta name="twitter:description" content="${safeDesc}" />`,
      )
      .replace('<div id="root"></div>', `<div id="root">${visibleMarkup}</div>`);

    fs.mkdirSync(path.dirname(item.outFile), { recursive: true });
    fs.writeFileSync(item.outFile, pageHtml, 'utf8');
  }

  writeSitemapAndRobots();

  fs.rmSync(prerenderDir, { recursive: true, force: true });
  console.log(
    'Pre-rendered static HTML, sitemap.xml, and robots.txt for:',
    ROUTES.map((r) => r.route).join(', '),
  );
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
