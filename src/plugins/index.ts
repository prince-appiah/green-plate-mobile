import { ConfigPlugin } from "expo/config-plugins";
import withAndroidPlugin from "./withAndroidPlugin";
import withIosPlugin from "./withIosPlugin";

const withCombinedPlugins: ConfigPlugin = (config) => {
  config = withAndroidPlugin(config);
  config = withIosPlugin(config);
  return config;
};

export default withCombinedPlugins;
