var path = require('path');

module.exports = {
  plugins: [{ plugin: require('@semantic-ui-react/craco-less') }],
  webpack: {
    alias: {
      '@state': path.resolve(__dirname, 'src/state/'),
      '@components': path.resolve(__dirname, 'src/components/'),
      '@config': path.resolve(__dirname, 'src/config/'),
      '@api': path.resolve(__dirname, 'src/api'),
      '@forms': path.resolve(__dirname, 'src/forms/'),
      '@pages': path.resolve(__dirname, 'src/pages/'),
      '@routes': path.resolve(__dirname, 'src/routes/'),
      '@authentication': path.resolve(__dirname, 'src/authentication/'),
      '@history': path.resolve(__dirname, 'src/history/'),
      '@override': path.resolve(__dirname, 'src/override'),
    },
  },
  jest: {
    configure: {
      moduleNameMapper: {
        '^@state(.*)$': '<rootDir>/src/state$1',
        '^@components(.*)$': '<rootDir>/src/components$1',
        '^@config(.*)$': '<rootDir>/src/config$1',
        '^@api(.*)$': '<rootDir>/src/api$1',
        '^@forms(.*)$': '<rootDir>/src/forms$1',
        '^@pages(.*)$': '<rootDir>/src/pages$1',
        '^@routes(.*)$': '<rootDir>/src/routes$1',
        '^@authentication(.*)$': '<rootDir>/src/authentication$1',
        '^@history(.*)$': '<rootDir>/src/history$1',
        '^@override(.*)$': '<rootDir>/src/override$1',
        '^@testData(.*)$': '<rootDir>/../tests/data$1',
      },
    },
  },
};
