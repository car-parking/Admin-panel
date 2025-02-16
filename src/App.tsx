import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from "./Pages/Login";
import AdminLayout from "./layout/AdminLayout";
import Dashboard from "./Pages/Dashboard";
import Users from "./Pages/User";
import Settings from "./Pages/Setting";
import Admins from "./Pages/Admins";
import Owner from "./Pages/Owner";
import { ConfigProvider, theme } from "antd";
import { useState } from "react";

const queryClient = new QueryClient();

interface AppProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const App: React.FC<AppProps> = ({ darkMode, setDarkMode }) => {
  return (
    <ConfigProvider theme={{ algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm }}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<AdminLayout darkMode={darkMode} setDarkMode={setDarkMode} />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="users" element={<Users />} />
              <Route path="owners" element={<Owner />} />
              <Route path="admins" element={<Admins />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </Router>
      </QueryClientProvider>
    </ConfigProvider>
  );
};

export default App;
