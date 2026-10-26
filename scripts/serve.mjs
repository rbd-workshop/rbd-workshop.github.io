import http from 'node:http';
import { readFile, realpath, stat } from 'node:fs/promises';
import { watch } from 'node:fs';
import path from 'node:path';
import { build, root } from './build.mjs';

await build();
const publicRoot = await realpath(path.join(root, 'docs'));
const port = Number(process.env.PORT || 4173);
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('PORT must be between 1024 and 65535');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.ico': 'image/x-icon' };
const server = http.createServer(async (request, response) => {
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(405, { Allow: 'GET, HEAD' }); response.end('Method not allowed'); return;
  }
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (pathname === '/__preview') {
      const requested = Number(new URL(request.url, 'http://localhost').searchParams.get('width') || 390);
      const width = Math.min(2560, Math.max(320, Number.isFinite(requested) ? requested : 390));
      const height = width >= 1280 ? Math.round(width * 9 / 16) : 900;
      const preview = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>RBD responsive preview</title><style>body{margin:0;background:#e4e5df;font:13px Arial,sans-serif;color:#242820}header{padding:14px 24px;display:flex;flex-wrap:wrap;gap:18px;align-items:center}a{color:inherit}.stage{margin:0 auto}iframe{display:block;border:0;background:white;width:${width}px;height:${height}px;transform-origin:top left}strong{margin-right:auto}</style><header><strong>RBD · ${width}px responsive preview</strong><a href="/__preview?width=320">320px</a><a href="/__preview?width=390">390px</a><a href="/__preview?width=768">768px</a><a href="/__preview?width=1280">1280px</a><a href="/__preview?width=1920">1920px</a><a href="/__preview?width=2560">2560px</a><a href="/">Open website ↗</a></header><div class="stage"><iframe title="RBD website at ${width} pixels" src="/"></iframe></div><script>const stage=document.querySelector('.stage'),frame=document.querySelector('iframe');function fit(){const scale=Math.min(1,(innerWidth-32)/${width});stage.style.width=(${width}*scale)+'px';stage.style.height=(${height}*scale)+'px';frame.style.transform='scale('+scale+')'}addEventListener('resize',fit);fit();</script></html>`;
      response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); response.end(request.method === 'HEAD' ? undefined : preview); return;
    }
    if (pathname.includes('\0') || pathname.split('/').some(segment => segment.startsWith('.'))) {
      response.writeHead(404); response.end('Not found'); return;
    }
    let target = path.resolve(publicRoot, '.' + pathname);
    if ((await stat(target)).isDirectory()) target = path.join(target, 'index.html');
    target = await realpath(target);
    if (!target.startsWith(publicRoot + path.sep)) { response.writeHead(404); response.end('Not found'); return; }
    const data = await readFile(target);
    response.writeHead(200, { 'Content-Type': types[path.extname(target)] || 'application/octet-stream', 'Content-Length': data.length });
    response.end(request.method === 'HEAD' ? undefined : data);
  } catch (error) {
    response.writeHead(error instanceof URIError ? 400 : 404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end(error instanceof URIError ? 'Invalid URL' : 'Page not found');
  }
});
server.on('error', error => { console.error(error.code === 'EADDRINUSE' ? `Port ${port} is in use. Start with PORT=4174 npm start.` : error.message); process.exit(1); });
server.listen(port, '127.0.0.1', () => console.log(`RBD local preview: http://127.0.0.1:${port}\nWatching src/ and content/. Refresh your browser after an edit. Ctrl+C stops the server.`));
let timer;
let buildQueue = Promise.resolve();
for (const folder of ['src', 'content']) watch(path.join(root, folder), { recursive: true }, () => {
  clearTimeout(timer);
  timer = setTimeout(() => { buildQueue = buildQueue.then(build).catch(error => console.error('Build failed:', error.message)); }, 150);
});
