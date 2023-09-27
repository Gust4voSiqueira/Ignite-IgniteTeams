module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@assets': './src/assets',
            '@components': './src/components/index.ts',
            '@storage': './src/storage',
            '@screens': './src/screens/index.ts',
            '@utils': './src/utils',
          },
        },
      ],
    ],
  }
}
