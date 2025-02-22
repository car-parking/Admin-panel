import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

const queryClient = new QueryClient();

const Root = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
      <QueryClientProvider client={queryClient}>
        <App darkMode={darkMode} setDarkMode={setDarkMode} />
      </QueryClientProvider>
  );
};

createRoot(document.getElementById("root")!).render(<Root />);
