export const genderIcons: Record<string, string> = {
  Male: new URL("@/assets/icons/genders/male.png", import.meta.url).href,
  Female: new URL("@/assets/icons/genders/female.png", import.meta.url).href,
  Other: new URL("@/assets/icons/genders/other.png", import.meta.url).href,
};

export const appIcons: Record<string, string> = {
  Dealer: new URL("@/assets/icons/apps/dealer.png", import.meta.url).href,
  Market: new URL("@/assets/icons/apps/market.png", import.meta.url).href,
  Storage: new URL("@/assets/icons/apps/storage.png", import.meta.url).href,
  Scroll: new URL("@/assets/icons/apps/scroll.png", import.meta.url).href,
};

export const statusIcons: Record<string, string> = {
  Heart: new URL("@/assets/icons/status/heart.png", import.meta.url).href,
  Sanity: new URL("@/assets/icons/status/sanity.png", import.meta.url).href,
  Strength: new URL("@/assets/icons/status/strength.png", import.meta.url).href,
  Speed: new URL("@/assets/icons/status/speed.png", import.meta.url).href,
  Gold: new URL("@/assets/icons/status/gold.png", import.meta.url).href,
};

export const navigationIcons: Record<string, string> = {
  Next: new URL("@/assets/icons/navigation/next.png", import.meta.url).href,
  Traveling: new URL("@/assets/icons/navigation/traveling.png", import.meta.url)
    .href,
};

export const deviceIcons: Record<string, string> = {
  Phone: new URL("@/assets/icons/device/phone.png", import.meta.url).href,
};

export const icons = {
  gender: genderIcons,
  app: appIcons,
  status: statusIcons,
  navigation: navigationIcons,
  device: deviceIcons,
};
