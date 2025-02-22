import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Input, Button, Form, Card, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api/auth";
import { useAuthStore } from "../../store/AuthStore";

const { Title } = Typography;

const Login: React.FC = () => {
  const { login } = useAuthStore();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data: any) => {
      login(data);
      message.success("Muvaffaqiyatli kirildi!");
      navigate("/dashboard");
    },
    onError: () => {
      message.error("Login yoki parol noto‘g‘ri!");
    },
  });

  const handleLogin = () => {
    if (!identifier || !password) {
      message.warning("Iltimos, email yoki telefon va parol kiriting!");
      return;
    }

    mutation.mutate({ identifier, password });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Card style={{ width: 400, padding: "20px", borderRadius: "10px" }}>
        <Title level={3} style={{ textAlign: "center" }}>
          Admin Panelga Kirish
        </Title>

        <Form layout="vertical">
          <Form.Item label="Email yoki Telefon">
            <Input
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Email yoki telefon"
            />
          </Form.Item>

          <Form.Item label="Parol">
            <Input.Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Parol"
            />
          </Form.Item>

          <Button
            type="primary"
            block
            onClick={handleLogin}
            loading={mutation.isPending}
          >
            Kirish
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
