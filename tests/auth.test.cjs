const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function setup(refreshFailure) {
  const cookies = new Map();
  const session = new Map();
  const events = [];
  const posts = [];
  const retries = [];
  let requestHandler, rejectHandler;
  const http = async config => { retries.push(config); return { data: { ok: true } }; };
  http.interceptors = {
    request: { use: fn => { requestHandler = fn; } },
    response: { use: (_fn, reject) => { rejectHandler = reject; } },
  };
  const response = { token: 'new-access', rf_token: 'new-refresh', expires_in: 900, user: { id: 1, username: 'admin' } };
  const axios = {
    create: () => http,
    isAxiosError: error => !!error.isAxiosError,
    post: async (url, body) => {
      posts.push({ url, body });
      await new Promise(resolve => setTimeout(resolve, 5));
      if (refreshFailure) throw refreshFailure;
      return { data: response };
    },
  };
  let source = fs.readFileSync('src/apis/gateway-http.ts', 'utf8').replace('import.meta.env.VITE_GATEWAY_URL', 'undefined');
  source = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2021, esModuleInterop: true } }).outputText;
  const exports = {};
  const storage = {
    cookieStorageUtil: { get: key => cookies.get(key), set: (value, key) => cookies.set(key, value), remove: key => cookies.delete(key) },
    sessionStorageUtil: { set: (value, key) => session.set(key, value), remove: key => session.delete(key) },
  };
  vm.runInNewContext(source, { exports, require: name => {
    if (name === 'axios') return axios;
    if (name === '@/configs/storage') return { STORAGE: { TOKEN_KEY: 'access_token', REFRESH_TOKEN_KEY: 'refresh_token', USER_KEY: 'current_user' } };
    if (name === '@/service/storage') return storage;
    throw new Error(name);
  }, window: { location: { protocol: 'http:' }, dispatchEvent: event => events.push(event.type) }, Event, setTimeout });
  return { api: exports, cookies, session, events, posts, retries, request: config => requestHandler(config), reject: error => rejectHandler(error), response };
}
const expired = url => ({ config: { url, headers: {} }, response: { status: 401 } });

test('stores token/rf_token and attaches the bearer token', () => {
  const state = setup();
  state.api.saveAuth(state.response, true);
  assert.equal(state.cookies.get('access_token'), 'new-access');
  assert.equal(state.cookies.get('refresh_token'), 'new-refresh');
  assert.equal(state.session.get('current_user').username, 'admin');
  assert.equal(state.request({ headers: {} }).headers.Authorization, 'Bearer new-access');
});

test('concurrent 401 responses share one refresh and retry with the new token', async () => {
  const state = setup();
  state.cookies.set('refresh_token', 'old-refresh');
  await Promise.all([state.reject(expired('/auth/me')), state.reject(expired('/other'))]);
  assert.equal(state.posts.length, 1);
  assert.equal(state.posts[0].url, '/api/v1/auth/refresh-token');
  assert.equal(state.posts[0].body.rf_token, 'old-refresh');
  assert.equal(state.retries.length, 2);
  assert.ok(state.retries.every(config => config.headers.Authorization === 'Bearer new-access' && config._retry));
  assert.equal(state.cookies.get('refresh_token'), 'new-refresh');
});

test('wrong login credentials never trigger refresh', async () => {
  const state = setup();
  state.cookies.set('refresh_token', 'old-refresh');
  await assert.rejects(state.reject(expired('/auth/login')));
  assert.equal(state.posts.length, 0);
});

test('invalid refresh token clears credentials and emits auth:expired', async () => {
  const state = setup({ isAxiosError: true, response: { status: 401 } });
  state.api.saveAuth(state.response);
  await assert.rejects(state.reject(expired('/auth/me')));
  assert.equal(state.cookies.size, 0);
  assert.equal(state.session.size, 0);
  assert.ok(state.events.includes('auth:expired'));
});

test('network failure preserves refresh credentials for a later retry', async () => {
  const state = setup({ isAxiosError: true, message: 'offline' });
  state.api.saveAuth(state.response);
  await assert.rejects(state.reject(expired('/auth/me')));
  assert.equal(state.cookies.get('refresh_token'), 'new-refresh');
  assert.equal(state.events.length, 0);
});
