import * as esbuild from 'esbuild';
import * as sass from 'sass';
import { writeFileSync, mkdirSync } from 'fs';
import chokidar from 'chokidar';

const isWatch = process.argv.includes('--watch');

mkdirSync('public', { recursive: true });

const esbuildConfig = {
  entryPoints: ['src/scripts/src_init.js'],
  bundle: true,
  minify: true,
  outfile: 'public/bundle.js',
};

function buildSass() {
  const time = new Date().toLocaleTimeString();
  try {
    const result = sass.compile('src/styles/main.scss', { style: 'compressed' });
    writeFileSync('public/bundle.css', result.css);
    console.log(`✓ ${time}  bundle.css rebuilt`);
  } catch (err) {
    console.error(`✗ ${time}  Sass error:\n  ${err.message}`);
  }
}

if (isWatch) {
  // JS: esbuild's native watch with rebuild logging
  const ctx = await esbuild.context({
    ...esbuildConfig,
    plugins: [{
      name: 'rebuild-logger',
      setup(build) {
        build.onEnd((result) => {
          const time = new Date().toLocaleTimeString();
          if (result.errors.length === 0) {
            console.log(`✓ ${time}  bundle.js rebuilt`);
          } else {
            console.error(`✗ ${time}  bundle.js errors:`, result.errors);
          }
        });
      },
    }],
  });
  await ctx.watch();

  // CSS: initial build + chokidar watch
  buildSass();
  chokidar
    .watch('src/styles/**/*.scss', { ignoreInitial: true })
    .on('change', buildSass)
    .on('add', buildSass)
    .on('unlink', buildSass);

  console.log('\n👀 Watching src/scripts/ and src/styles/');
  console.log('   Hit save in your editor → bundle rebuilds → hard reload Comet (Cmd+Shift+R)');
  console.log('   Press Ctrl+C to stop.\n');
} else {
  await esbuild.build(esbuildConfig);
  buildSass();
  console.log('✓ Webflow bundle built → public/bundle.js + public/bundle.css');
}
