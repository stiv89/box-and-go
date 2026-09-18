import type { BoxConfiguration } from "@/types";

import { toPortableLogoDataUrl } from "./portable-logo";

/** Resolves the configuration into a shape safe to export: no session-bound blob URLs. */
export async function preparePortableConfiguration(
  configuration: BoxConfiguration,
): Promise<BoxConfiguration> {
  const portableLogoUrl = await toPortableLogoDataUrl(configuration.customization.logo.url);
  if (portableLogoUrl === configuration.customization.logo.url) {
    return configuration;
  }

  return {
    ...configuration,
    customization: {
      ...configuration.customization,
      logo: { ...configuration.customization.logo, url: portableLogoUrl },
    },
  };
}
