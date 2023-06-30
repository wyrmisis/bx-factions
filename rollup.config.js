// Rollup plugins
import commonjs         from '@rollup/plugin-commonjs';
import { nodeResolve }  from '@rollup/plugin-node-resolve';
import { terser }       from "rollup-plugin-terser";
import copy             from "rollup-plugin-copy-assets";
import sourcemaps       from "rollup-plugin-sourcemaps";

export default {
  input: './src/module/index.mjs',
  output: [
    {
      file: './dist/js/bundle.js',
      sourcemap: true
    },
    {
      file: './dist/js/bundle.min.js',
      plugins: [terser()],
      sourcemap: true,
      format: 'iife'
    }
  ],
  plugins: [
    sourcemaps(),
    nodeResolve({ browser: true }),
    commonjs(),
    copy({
      assets: [
        "../assets",
        "../templates",
      ],
    }),
  ]
};
