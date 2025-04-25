import { babel, getBabelOutputPlugin } from '@rollup/plugin-babel'
import terser from '@rollup/plugin-terser'
import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig([
  {
    entries: [
      { input: 'src/index', name: 'i18n' },
    ],
    declaration: 'node16',
    clean: true,
    rollup: {
      emitCJS: true,
    },
    hooks: {
      'rollup:options': (ctx, option) => {
        if (!Array.isArray(option.output)) {
          return
        }
        option.output.push(
          {
            dir: ctx.options.outDir,
            format: 'esm',
            plugins: [
              getBabelOutputPlugin({
                filename: 'miniI18n',
                presets: [
                  [
                    '@babel/preset-env',
                    {
                      modules: 'umd',
                      targets: ['chrome >= 52'],
                    },
                  ],
                ],
              }),
              terser({}),
            ],
          },
        )

        const plugins = [
          ...option.plugins,
          babel({ babelHelpers: 'bundled' }),
        ]
        option.plugins = plugins
      },
    },
  },
])
