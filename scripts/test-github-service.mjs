import assert from 'node:assert/strict';
import { GitHubService, GitHubServiceError, PROGRESS_GIST_FILENAME } from '../app/js/services/github-service.js';
import { createEmptyProgress } from '../app/js/services/progress-service.js';

const calls = [];
const progress = createEmptyProgress({ clock: () => new Date('2026-08-17T12:00:00.000Z') });
let gistExists = false;
let gistContent = null;
const rawUrl = 'https://gist.githubusercontent.com/aluna/gist-raw/raw/rev/portugues-completo-progress.json';

function jsonResponse(status, payload) {
  return {
    ok: status >= 200 && status < 300,
    status,
    async json() { return structuredClone(payload); },
    async text() { return typeof payload === 'string' ? payload : JSON.stringify(payload); }
  };
}

async function fetchMock(url, options = {}) {
  calls.push({ url, options: structuredClone(options) });
  const parsed = new URL(url);
  if (parsed.hostname === 'gist.githubusercontent.com') {
    return jsonResponse(200, gistContent);
  }
  const path = parsed.pathname + parsed.search;
  if (path === '/user') return jsonResponse(200, { login: 'aluna', id: 7 });
  if (path.startsWith('/gists?')) {
    return jsonResponse(200, gistExists ? [{ id: 'gist-1', updated_at: '2026-08-17T12:05:00Z', files: { [PROGRESS_GIST_FILENAME]: { content: gistContent, truncated: false } } }] : []);
  }
  if (path === '/gists' && options.method === 'POST') {
    const body = JSON.parse(options.body);
    assert.equal(body.public, false);
    gistContent = body.files[PROGRESS_GIST_FILENAME].content;
    gistExists = true;
    return jsonResponse(201, { id: 'gist-1', updated_at: '2026-08-17T12:05:00Z' });
  }
  if (path === '/gists/gist-1' && (!options.method || options.method === 'GET')) {
    if (!gistExists) return jsonResponse(404, { message: 'Not Found' });
    return jsonResponse(200, { id: 'gist-1', updated_at: '2026-08-17T12:05:00Z', files: { [PROGRESS_GIST_FILENAME]: { content: gistContent, truncated: false } } });
  }
  if (path === '/gists/gist-1' && options.method === 'PATCH') {
    const body = JSON.parse(options.body);
    gistContent = body.files[PROGRESS_GIST_FILENAME].content;
    return jsonResponse(200, { id: 'gist-1', updated_at: '2026-08-17T12:06:00Z' });
  }
  return jsonResponse(404, { message: 'Not Found' });
}

const github = new GitHubService({ token: 'token-de-teste', fetchImpl: fetchMock });
assert.deepEqual(await github.identifyUser(), { login: 'aluna', id: 7 });
assert.equal(await github.findProgressGist(), null);
const created = await github.createProgress(progress);
assert.equal(created.gistId, 'gist-1');
const loaded = await github.loadProgress({ gistId: 'gist-1' });
assert.equal(loaded.progress.courseId, 'portugues-completo');
loaded.progress.curriculum.current.levelId = 'N0';
const updated = await github.updateProgress('gist-1', loaded.progress);
assert.equal(updated.gistUpdatedAt, '2026-08-17T12:06:00Z');
assert.equal((await github.loadProgress({ gistId: 'gist-1' })).progress.curriculum.current.levelId, 'N0');

const truncatedGist = {
  id: 'gist-raw',
  files: {
    [PROGRESS_GIST_FILENAME]: {
      content: '{',
      truncated: true,
      raw_url: rawUrl
    }
  }
};
const rawLoaded = await github.readProgressFile(truncatedGist);
assert.equal(rawLoaded.courseId, 'portugues-completo');
const rawCall = calls.find(call => call.url === rawUrl);
assert.ok(rawCall, 'conteúdo truncado deve usar raw_url oficial');
assert.equal(rawCall.options.headers?.Authorization, undefined, 'bearer token não deve ser enviado a gist.githubusercontent.com');
assert.equal(rawCall.options.headers?.['X-GitHub-Api-Version'], undefined);
assert.equal(rawCall.options.cache, 'no-store');

const callsBeforeInvalid = calls.length;
await assert.rejects(
  github.readProgressFile({
    id: 'gist-invalido',
    files: { [PROGRESS_GIST_FILENAME]: { content: '{', truncated: true, raw_url: 'https://evil.example/progress.json' } }
  }),
  error => error instanceof GitHubServiceError && error.code === 'RAW_FILE_URL_INVALID'
);
assert.equal(calls.length, callsBeforeInvalid, 'URL raw inesperada deve ser rejeitada antes de qualquer fetch');

for (const call of calls.filter(call => call.url.startsWith('https://api.github.com'))) {
  assert.equal(call.options.headers?.Authorization, 'Bearer token-de-teste');
  assert.equal(call.options.headers?.['X-GitHub-Api-Version'], '2026-03-10');
  assert.equal(call.options.headers?.Accept, 'application/vnd.github+json');
}

console.log('GitHubService P5: identidade, Gist, headers e leitura raw truncada sem exposição de bearer token validados sem rede.');
