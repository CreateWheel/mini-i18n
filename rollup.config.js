import typescript from '@rollup/plugin-typescript'
import del from 'rollup-plugin-delete'
import { terser } from 'rollup-plugin-terser'
import { babel } from '@rollup/plugin-babel'

const production = !process.env.ROLLUP_WATCH

const name = 'I18n'

export default {
  watch: {
    clearScreen: false
  },
  input: 'src/main.ts', // 打包入口
  output: [
    {
      name,
      sourcemap: true,
      format: 'iife',
      file: 'dist/main.js',
      plugins: [production && terser()]
    },
    { name, format: 'esm', file: 'dist/main.mjs' },
    { name, exports: 'auto', format: 'cjs', file: 'dist/main.cjs' }
  ],
  plugins: [
    typescript(),
    del({ targets: 'dist/*' }),
    babel({ babelHelpers: 'bundled', presets: ['@babel/preset-env'] })
  ]
}
