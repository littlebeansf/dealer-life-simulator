// src/theme.ts

import { extendTheme, ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const colors = {
  brand: {
    background: "#0D0D0D", // Deep gray-black
    surface: "#1A1A1A", // Dark gray for HUDs, panels
    accent: "#E0E0E0", // Light gray for highlights
    text: "#FFFFFF", // Pure white text
  },
};

const styles = {
  global: (props: any) => ({
    body: {
      bg: props.colorMode === "dark" ? "brand.background" : "white",
      color: props.colorMode === "dark" ? "brand.text" : "black",
    },
  }),
};

const theme = extendTheme({ config, colors, styles });

export default theme;
