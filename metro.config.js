const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Disable remote debugging and development features
config.resolver.platforms = ["ios", "android", "native", "web"];

// Disable source maps in production
if (process.env.NODE_ENV === "production") {
  config.transformer.minifierConfig = {
    ...config.transformer.minifierConfig,
    keep_fnames: false,
    mangle: true,
  };

  // Disable debugging in production
  config.serializer.customSerializer = undefined;
}

// Disable network inspection
config.transformer.enableBabelRCLookup = false;

// Disable debugging features
config.resolver.unstable_enableSymlinks = false;

module.exports = config;
