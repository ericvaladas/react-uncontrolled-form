import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { terser } from "rollup-plugin-terser";
import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';

const env = process.env.NODE_ENV;
const config = {
  output: {
    name: 'react-uncontrolled-form',
    format: 'umd',
    globals: {react: 'React'}
  },
  external: ['react'],
  plugins: [
    resolve(),
    commonjs({include: 'node_modules/**'}),
    babel({exclude: 'node_modules/**'}),
    replace({'process.env.NODE_ENV': JSON.stringify(env)})
  ]
};

if (env === 'production') {
  config.plugins.push(
    terser({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_proto: true
      }
    })
  );
}

export default config;
