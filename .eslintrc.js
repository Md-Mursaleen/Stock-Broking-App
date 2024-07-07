module.exports = {
  root: true,
  rules: {
    'react/react-in-jsx-scope': 'off',
  },
  extends: '@react-native',
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      babelrc: false,
      configFile: false,
      parserOpts: {
        plugins: ['jsx'],
      },
    },
  },
};
