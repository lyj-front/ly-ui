module.exports = {
  // ATTENTION!!
  // Preset ordering is reversed, so `@babel/typescript` will called first
  // Do not put `@babel/typescript` before `@babel/env`, otherwise will cause a compile error
  // See https://github.com/babel/babel/issues/12066
  presets: [
    [
      '@babel/env',
      {
        loose: true,
        modules: false,
      },
    ],
    '@babel/typescript',
  ],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }], // 装饰器语法
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    '@vue/babel-plugin-jsx',
    '@babel/plugin-proposal-nullish-coalescing-operator',
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-logical-assignment-operators',
    ['@babel/plugin-proposal-private-methods', { loose: true }],
    '@babel/transform-runtime',
    'lodash',
  ],
  overrides: [
    {
      test: [/\.vue(\?|$)/, /\.md$/],
      plugins: ['@babel/transform-typescript'],
    },
  ],
  env: {
    utils: {
      ignore: ['**/*.test.ts', '**/*.spec.ts'],
      presets: [
        [
          '@babel/env',
          {
            loose: true,
            modules: false,
          },
        ],
      ],
      plugins: [
        [
          'babel-plugin-module-resolver',
          {
            root: ['element-plus'],
            alias: {
              '@element-plus': 'element-plus/lib',
            },
          },
        ],
      ],
    },
  },
}