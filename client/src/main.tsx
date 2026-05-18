import { createRoot } from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "./hooks/useTheme";
import { BannerProvider } from "./hooks/useBanner";
import { AudioProvider } from "./hooks/useAudio";
import { FontSizeProvider } from "./hooks/useFontSize";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <FontSizeProvider>
      <AudioProvider>
        <BannerProvider>
          <App />
        </BannerProvider>
      </AudioProvider>
    </FontSizeProvider>
  </ThemeProvider>
);
