// Node modules
import glob from "glob";
import path from "path";
// Rollup
import config     from './rollup.config';
import livereload from 'rollup-plugin-livereload';

const watcher = (globs) => ({
  buildStart() {
    for (const item of globs) {
      glob.sync(path.resolve(item)).forEach((filename) => {
        this.addWatchFile(filename);
      });
    }
  }
})

const devConfig = { ...config };

const devPlugins = [
  watcher(['src/**/*.hbs', 'src/**/*.html']),
  livereload({ watch: 'dist', port: 9999, delay: 1000 })
];

devConfig.plugins = [
  ...config.plugins,
  ...devPlugins
];

export default devConfig;