import { createRoot } from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "./hooks/useTheme";
import { BannerProvider } from "./hooks/useBanner";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <BannerProvider>
      <App />
    </BannerProvider>
  </ThemeProvider>
);
