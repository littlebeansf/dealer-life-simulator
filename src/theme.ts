import { extendTheme, ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const colors = {
  brand: {
    background: "#0D0D0D", // dark background
    surface: "#1A1A1A", // dark panels
    accent: "#E0E0E0", // soft highlights
    text: "#FFFFFF", // pure white
  },
  lightbrand: {
    background: "#F7FAFC", // light background (Chakra's light gray)
    surface: "#E2E8F0", // lighter panel
    accent: "#1A202C", // dark text
    text: "#1A202C", // almost black text
  },
};

const styles = {
  global: (props: any) => ({
    body: {
      bg:
        props.colorMode === "dark"
          ? "brand.background"
          : "lightbrand.background",
      color: props.colorMode === "dark" ? "brand.text" : "lightbrand.text",
    },
  }),
};

const fonts = {
  heading: "Roboto, sans-serif",
  body: "Roboto, sans-serif",
};

const theme = extendTheme({ config, colors, styles, fonts });

export default theme;
