module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      '@babel/plugin-proposal-decorators',
      {
        legacy: true,
      },
    ],
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          actions: './src/actions',
          components: './src/components',
          config: './src/config',
          screens: './src/screens',
          utils: './src/utils',
          assets: './src/assets',
        },
      },
    ],
  ],
};
