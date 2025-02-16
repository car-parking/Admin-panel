import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider, theme } from "antd";
import { useState } from "react";

const queryClient = new QueryClient();

const Root = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <ConfigProvider theme={{ algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm }}>
      <QueryClientProvider client={queryClient}>
        <App darkMode={darkMode} setDarkMode={setDarkMode} />
      </QueryClientProvider>
    </ConfigProvider>
  );
};

createRoot(document.getElementById("root")!).render(<Root />);
