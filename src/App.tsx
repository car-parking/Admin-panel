import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider, theme } from "antd";
import Login from "./Pages/Login";
import AdminLayout from "./layout/AdminLayout";
import Dashboard from "./Pages/Dashboard";
import Users from "./Pages/User";
import Owner from "./Pages/Owner";
import Admins from "./Pages/Admins";
import Settings from "./Pages/Setting";
import ParkingSpots from "./Pages/ParkingSpot";

const queryClient = new QueryClient();

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("darkMode") === "true"; // LocalStorage'dan darkMode holatini yuklash
  });

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode)); // DarkMode holatini saqlash
  }, [darkMode]);

  const darkTheme = {
    algorithm: theme.darkAlgorithm,
    token: {
      colorPrimary: "#2F54EB",
      colorBgBase: "#141E30",
      colorTextBase: "#D6E4FF",
      colorBorder: "#3A60C9",
    },
  };

  const lightTheme = {
    algorithm: theme.defaultAlgorithm,
    token: {
      colorPrimary: "#3366FF",
      colorBgBase: "#F0F5FF",
      colorTextBase: "#002766",
      colorBorder: "#85A5FF",
    },
  };

  return (
    <ConfigProvider theme={darkMode ? darkTheme : lightTheme}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<AdminLayout darkMode={darkMode} setDarkMode={setDarkMode} />}>
              <Route index path="/dashboard" element={<Dashboard />} />
              <Route path="users" element={<Users />} />
              <Route path="owners" element={<Owner />} />
              <Route path="admins" element={<Admins />} />
              <Route path="settings" element={<Settings />} />
              <Route path="parking-spots" element={<ParkingSpots />} />
            </Route>
          </Routes>
        </Router>
      </QueryClientProvider>
    </ConfigProvider>
  );
};

export default App;
