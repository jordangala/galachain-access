import * as esbuild from 'esbuild';
import esbuildPluginDts from 'esbuild-plugin-d.ts';

await esbuild.build({
  entryPoints: ['src/galachain-access.ts'],
  bundle: false,
  outdir: 'dist',
  // outfile: 'dist/galachain-access.js',
  plugins: [
    esbuildPluginDts({
      outDir: 'dist',
    }),
  ],
});
