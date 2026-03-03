import { ConfigPlugin, withInfoPlist } from "expo/config-plugins";

const withIosPlugin: ConfigPlugin = (config) => {
  return withInfoPlist(config, async (cfg) => {
    const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!cfg.modResults) return cfg;

    return cfg;
  });
};

export default withIosPlugin;
