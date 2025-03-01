import { useEffect, Dispatch, SetStateAction } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider, theme } from "antd";
import Login from "./Pages/Login";
import AdminLayout from "./layout/AdminLayout";
import Dashboard from "./Pages/Dashboard";
import Users from "./Pages/User";
import Admins from "./Pages/Admins";
import Settings from "./Pages/Setting";
import ParkingSpots from "./Pages/ParkingSpot";
import Payments from "./Pages/Payments";
import Reservations from "./Pages/Reservations";
import PrivateRoute from "./PrivateRoutes/PrivateRoute";

interface AppProps {
  darkMode: boolean;
  setDarkMode: Dispatch<SetStateAction<boolean>>;
}

const queryClient = new QueryClient();

const App: React.FC<AppProps> = ({ darkMode, setDarkMode }) => {
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode)); // DarkMode holatini saqlash
  }, [darkMode]);

  const darkTheme = {
    algorithm: theme.darkAlgorithm,
    token: {
      colorPrimary: "rgba(47, 84, 235, 1)",
      colorBgBase: "rgba(20, 30, 48, 1)",
      colorTextBase: "rgba(214, 228, 255, 1)",
      colorBorder: "rgba(58, 96, 201, 1)",
    },
  };

  const lightTheme = {
    algorithm: theme.defaultAlgorithm,
    token: {
      colorPrimary: "rgba(0, 0, 255, 1)",
      colorBgBase: "rgba(255, 255, 255, 1)",
      colorTextBase: "rgba(0, 0, 139, 1)",
      colorBorder: "rgba(173, 216, 230, 0.5)",
    },
  };

  return (
    <ConfigProvider theme={darkMode ? darkTheme : lightTheme}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
       <Route element={<PrivateRoute />}>
            <Route path="/" element={<AdminLayout darkMode={darkMode} setDarkMode={setDarkMode} />}>
              <Route index path="/dashboard" element={<Dashboard />} />
              <Route path="users" element={<Users />} />
              <Route path="admins" element={<Admins />} />
              <Route path="settings" element={<Settings />} />
              <Route path="parking-spots" element={<ParkingSpots />} />
              <Route path="payments" element={<Payments />} />
              <Route path="reservations" element={<Reservations />} />
            </Route>
       </Route>
          </Routes>
        </Router>
      </QueryClientProvider>
    </ConfigProvider>
  );
};

export default App;
