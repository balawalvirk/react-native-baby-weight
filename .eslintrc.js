module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    '@react-native-community',
    'eslint:recommended',
    'prettier',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  settings: {
    'import/resolver': {
      'babel-module': {},
    },
  },
  plugins: ['react', 'prettier', 'jsx-a11y', 'react-hooks'],
  rules: {
    'prettier/prettier': ['error', {singleQuote: true, parser: 'flow'}],
    'react/jsx-filename-extension': [1, {extensions: ['.js', '.jsx', '.tsx']}],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'arrow-body-style': 'off',
    semi: ['error', 'always'],
    'arrow-parens': ['error', 'always'],
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'always-multiline',
      },
    ],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'import/prefer-default-export': 'off',
    'react/state-in-constructor': ['error', 'never'],
    'react/require-default-props': ['error', {ignoreFunctionalComponents: true}],
    'react/destructuring-assignment': [0],
    'react/jsx-props-no-spreading': 'off',
    'react/no-unused-state': [0],
    'no-restricted-syntax': [0],
    curly: ['error', 'all'],
    'no-console': 'error',
    'no-useless-return': 0,
  },
};
