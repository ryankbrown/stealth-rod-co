import * as esbuild from 'esbuild';
import * as sass from 'sass';
import { writeFileSync, mkdirSync } from 'fs';

mkdirSync('public', { recursive: true });

await esbuild.build({
  entryPoints: ['src/scripts/main.js'],
  bundle: true,
  minify: true,
  outfile: 'public/bundle.js',
});

const result = sass.compile('src/styles/main.scss', { style: 'compressed' });
writeFileSync('public/bundle.css', result.css);

console.log('✓ Webflow bundle built → public/bundle.js + public/bundle.css');
