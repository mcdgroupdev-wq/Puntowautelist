import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const prerenderDir = path.join(rootDir, '.prerender');

const ROUTES = [
  {
    route: '/',
    outFile: path.join(distDir, 'index.html'),
    title: 'Punto – Encuentra a tu cofundador',
    description:
      'Punto es una app para emprendedores que quieren encontrar cofundadores, socios y colaboradores para crear proyectos juntos. Únete a la lista de espera.',
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
    const safeDesc = escapeHtmlAttr(item.description);

    let pageHtml = templateHtml
      .replace(/<title>[\s\S]*?<\/title>/, `<title>${safeTitle}</title>`)
      .replace(
        /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
        `<meta name="description" content="${safeDesc}" />`,
      )
      .replace(
        /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/,
        `<meta property="og:title" content="${escapeHtmlAttr(item.title)}" />`,
      )
      .replace(
        /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/,
        `<meta property="og:description" content="${safeDesc}" />`,
      )
      .replace('<div id="root"></div>', `<div id="root">${visibleMarkup}</div>`);

    fs.mkdirSync(path.dirname(item.outFile), { recursive: true });
    fs.writeFileSync(item.outFile, pageHtml, 'utf8');
  }

  fs.rmSync(prerenderDir, { recursive: true, force: true });
  console.log('Pre-rendered static HTML for:', ROUTES.map((r) => r.route).join(', '));
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
