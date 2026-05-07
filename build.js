import * as esbuild from 'esbuild';
import * as sass from 'sass';
import { writeFileSync, mkdirSync, copyFileSync } from 'fs';
import chokidar from 'chokidar';

const isWatch = process.argv.includes('--watch');

const PUBLIC_DIR = 'public';
const OVERRIDES_DIR = 'comet-local-overrides/stealthrodco-dev.netlify.app';

mkdirSync(PUBLIC_DIR, { recursive: true });
mkdirSync(OVERRIDES_DIR, { recursive: true });

const esbuildConfig = {
  entryPoints: ['src/scripts/src_init.js'],
  bundle: true,
  minify: true,
  outfile: `${PUBLIC_DIR}/bundle.js`,
};

function copyToOverrides(file) {
  try {
    copyFileSync(`${PUBLIC_DIR}/${file}`, `${OVERRIDES_DIR}/${file}`);
  } catch (err) {
    console.error(`✗ Failed to mirror ${file} to overrides:`, err.message);
  }
}

async function buildJs(ctx) {
  const time = new Date().toLocaleTimeString();
  try {
    const result = await ctx.rebuild();
    if (result.errors.length === 0) {
      copyToOverrides('bundle.js');
      console.log(`✅ ${time}  bundle.js rebuilt`);
    } else {
      console.error(`❌ ${time}  bundle.js errors:`, result.errors);
    }
  } catch (err) {
    console.error(`❌ ${time}  esbuild error:`, err.message);
  }
}

function buildSass() {
  const time = new Date().toLocaleTimeString();
  try {
    const result = sass.compile('src/styles/main.scss', { style: 'compressed' });
    writeFileSync(`${PUBLIC_DIR}/bundle.css`, result.css);
    copyToOverrides('bundle.css');
    console.log(`✅ ${time}  bundle.css rebuilt`);
  } catch (err) {
    console.error(`❌ ${time}  Sass error:\n  ${err.message}`);
  }
}

if (isWatch) {
  // Create esbuild context — we trigger rebuilds via ctx.rebuild() from chokidar
  // (instead of esbuild's own ctx.watch(), which is unreliable inside Dropbox)
  const ctx = await esbuild.context(esbuildConfig);

  // Initial builds
  await buildJs(ctx);
  buildSass();

  // JS watcher — fires on any .js save under src/scripts/, even files not yet imported
  chokidar
    .watch('src/scripts/**/*.js', { ignoreInitial: true })
    .on('change', () => buildJs(ctx))
    .on('add', () => buildJs(ctx))
    .on('unlink', () => buildJs(ctx));

  // SCSS watcher
  chokidar
    .watch('src/styles/**/*.scss', { ignoreInitial: true })
    .on('change', buildSass)
    .on('add', buildSass)
    .on('unlink', buildSass);

  // Graceful shutdown
  process.on('SIGINT', async () => {
    await ctx.dispose();
    process.exit(0);
  });

  console.log('\n👀 Watching src/scripts/**/*.js and src/styles/**/*.scss');
  console.log('   Bundles write to public/ AND comet-local-overrides/ on every save');
  console.log('   Hit save → hard reload Comet (Cmd+Shift+R)');
  console.log('   Press Ctrl+C to stop.\n');
} else {
  await esbuild.build(esbuildConfig);
  copyToOverrides('bundle.js');
  buildSass();
  console.log('✅ Webflow bundle built → public/ + comet-local-overrides/');
}
