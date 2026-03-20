import { AndroidConfig, ConfigPlugin, withAndroidManifest } from "expo/config-plugins";

const { addMetaDataItemToMainApplication, getMainApplicationOrThrow } = AndroidConfig.Manifest;

const withAndroidPlugin: ConfigPlugin = (config) => {
  const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;

  return withAndroidManifest(config, async (cfg) => {
    const mainApplication = getMainApplicationOrThrow(cfg.modResults);
    if (!mainApplication.$) return cfg;
    if (!mainApplication["meta-data"]) mainApplication["meta-data"] = [];

    addMetaDataItemToMainApplication(mainApplication, "com.google.android.geo.API_KEY", googleMapsApiKey || "");

    // Alternative if I dont want to use the helper function or I face issues with it.
    // mainApplication["meta-data"].push({
    //   $: {
    //     "android:name": "com.google.android.geo.GOOGLE_MAPS_API_KEY",
    //     "android:value": googleMapsApiKey || "",
    //   },
    // });

    return cfg;
  });
};

export default withAndroidPlugin;
