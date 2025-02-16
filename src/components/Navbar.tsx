import { Button } from "antd";
import { useAuthStore } from "../store/AuthStore";

const Navbar: React.FC = () => {
  const { user, logout } = useAuthStore();

  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px", background: "#eee" }}>
      {user ? (
        <>
          <span>👤 {user.name} ({user.role})</span>
          <Button danger onClick={logout}>Chiqish</Button>
        </>
      ) : (
        <span>❌ Foydalanuvchi yo'q</span>
      )}
    </div>
  );
};

export default Navbar;
