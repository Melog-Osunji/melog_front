const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const config = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts: [],
    sourceExts: [],
  },
};

const defaultConfig = getDefaultConfig(__dirname);

config.resolver.assetExts = defaultConfig.resolver.assetExts.filter(
  (ext) => ext !== 'svg'
);
config.resolver.sourceExts = [
  ...defaultConfig.resolver.sourceExts,
  'svg',
];

module.exports = mergeConfig(defaultConfig, config);
