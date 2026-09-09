/**
 * Ensures the unsigned Cloudinary upload preset used by the admin panel
 * (browser certificate uploads) exists and has the right settings.
 *
 * Run by .github/workflows/backend-setup.yml on a GitHub Actions runner —
 * the Cloudinary Admin API is not reachable from every dev environment.
 * The API key/secret are provided via GitHub Secrets (CLOUDINARY_API_KEY /
 * CLOUDINARY_API_SECRET) and are never printed or committed.
 *
 * Usage:
 *   CLOUDINARY_API_KEY=… CLOUDINARY_API_SECRET=… \
 *   VITE_CLOUDINARY_CLOUD_NAME=… VITE_CLOUDINARY_UPLOAD_PRESET=… \
 *   node scripts/cloudinary-setup.mjs
 */
import crypto from 'node:crypto';

const CLOUD = process.env.VITE_CLOUDINARY_CLOUD_NAME;
const PRESET_NAME = process.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'completestudy-certificates';
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

const ALLOWED_FORMATS = 'pdf,jpg,jpeg,png,webp';
const FOLDER = 'certificates';

if (!CLOUD || !API_KEY || !API_SECRET) {
  console.error(
    'Missing environment: need VITE_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET.'
  );
  process.exit(1);
}

/** Cloudinary signature: sha1 of alphabetically sorted `key=value` pairs (+ api_secret). */
function sign(params) {
  const toSign = Object.keys(params)
    .filter((key) => params[key] !== undefined && params[key] !== '' && key !== 'api_key' && key !== 'signature' && key !== 'file')
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('&');
  return crypto.createHash('sha1').update(toSign + API_SECRET).digest('hex');
}

async function adminApi(path, method, params = {}) {
  const url = `https://api.cloudinary.com/v1_1/${CLOUD}${path}`;
  const body = new URLSearchParams({
    ...params,
    timestamp: String(Math.floor(Date.now() / 1000)),
    api_key: API_KEY,
  });
  body.set('signature', sign(Object.fromEntries(body.entries())));

  const response = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: method === 'GET' ? undefined : body.toString(),
  });
  const text = await response.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    // non-JSON response handled below
  }
  return { ok: response.ok, status: response.status, json, text };
}

function describe(preset) {
  return `name=${preset.name} unsigned=${preset.unsigned} allowed_formats=${preset.allowed_formats || '(any)'} folder=${preset.folder || '(root)'}`;
}

console.log(`Cloud name: ${CLOUD}`);
console.log(`Preset: ${PRESET_NAME}`);
console.log('\n1) Listing existing upload presets…');

const list = await adminApi('/presets', 'GET');
if (!list.ok) {
  console.error(`   Could not list presets (HTTP ${list.status}): ${list.text.slice(0, 500)}`);
  process.exit(1);
}

const presets = Array.isArray(list.json?.presets) ? list.json.presets : [];
console.log(`   Found ${presets.length} preset(s).`);
presets.forEach((preset) => console.log(`   - ${describe(preset)}`));

const desiredSettings = { unsigned: 'true', allowed_formats: ALLOWED_FORMATS, folder: FOLDER };
const existing = presets.find((preset) => preset.name === PRESET_NAME);

if (existing) {
  const needsUpdate =
    String(existing.unsigned) !== 'true' ||
    (existing.allowed_formats || '') !== ALLOWED_FORMATS ||
    (existing.folder || '') !== FOLDER;
  if (!needsUpdate) {
    console.log(`\n2) Preset "${PRESET_NAME}" already exists with the correct settings. Nothing to do.`);
    process.exit(0);
  }
  console.log(`\n2) Updating existing preset "${PRESET_NAME}"…`);
  const update = await adminApi(`/presets/${encodeURIComponent(PRESET_NAME)}`, 'POST', desiredSettings);
  if (update.ok) {
    console.log(`   Updated: ${describe(update.json)}`);
    process.exit(0);
  }
  console.error(`   Update failed (HTTP ${update.status}): ${update.text.slice(0, 500)}`);
  process.exit(1);
}

console.log(`\n2) Creating unsigned preset "${PRESET_NAME}" (formats: ${ALLOWED_FORMATS}, folder: ${FOLDER})…`);
const create = await adminApi('/presets', 'POST', { name: PRESET_NAME, ...desiredSettings });
if (create.ok) {
  console.log(`   Created: ${describe(create.json)}`);
  console.log('\nThe admin panel can now upload certificates directly from the browser.');
  process.exit(0);
}

console.error(`   Creation failed (HTTP ${create.status}): ${create.text.slice(0, 500)}`);
process.exit(1);
