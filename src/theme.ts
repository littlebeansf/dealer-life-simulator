// theme.ts
import { extendTheme, ThemeConfig } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const colors = {
  brand: {
    background: "#121212",
    surface: "#1E1E1E",
    border: "#2C2C2C",
    accent: "#E2E8F0",
    action: "#FFFFFF",
    text: "#EAEAEA",
    heading: "#FFFFFF",
    muted: "#A0AEC0",
  },
  lightbrand: {
    background: "#F7FAFC",
    surface: "#EDF2F7",
    border: "#CBD5E0",
    accent: "#2D3748",
    action: "#1A202C",
    text: "#1A202C",
    heading: "#2D3748",
    muted: "#4A5568",
  },
};

const styles = {
  global: (props: any) => ({
    body: {
      bg: mode("lightbrand.background", "brand.background")(props),
      color: mode("lightbrand.text", "brand.text")(props),
    },
    "*::selection": {
      bg: mode("lightbrand.accent", "brand.accent")(props),
      color: mode("lightbrand.surface", "brand.surface")(props),
    },
  }),
};

const fonts = {
  heading: "Roboto, sans-serif",
  body: "Roboto, sans-serif",
};

const components = {
  Button: {
    baseStyle: {
      fontWeight: "bold",
      borderRadius: "md",
    },
    variants: {
      solid: (props: any) => ({
        bg: mode("lightbrand.action", "brand.action")(props),
        color: mode("white", "black")(props),
        _hover: {
          bg: mode("lightbrand.surface", "brand.surface")(props),
        },
        _active: {
          bg: mode("lightbrand.border", "brand.border")(props),
        },
      }),
    },
  },
};

const theme = extendTheme({ config, colors, styles, fonts, components });

export default theme;
