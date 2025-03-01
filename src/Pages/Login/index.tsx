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
      console.log("Login muvaffaqiyatli:", data);
      login(data);
      message.success("Muvaffaqiyatli kirildi!");
      navigate("/dashboard");
    },
    onError: () => {
      message.error("Login yoki parol noto'g'ri!");
    },
  });

  const handleLogin = () => {
    if (!identifier || !password) {
      message.warning("Iltimos, email yoki telefon va parol kiriting!");
      return;
    }

    mutation.mutate(
      { identifier, password },
      {
        onError: (error) => {
          console.error("Mutation xatosi:", error);
        },
      }
    );
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: `url('/login.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#0A2FB6',
        backgroundRepeat: 'no-repeat', 
      }}
    >
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(10, 47, 182, 0.8) 0%, rgba(10, 47, 182, 0.4) 100%)',
      }} />
      
      <Card 
        style={{ 
          width: 400,
          padding: "32px",
          borderRadius: "24px",
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.2)",
          border: "1px solid rgba(255, 255, 255, 0.18)",
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div style={{ 
          width: '80px', 
          height: '80px', 
          margin: '0 auto 24px',
          background: 'white',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 15px rgba(255, 255, 255, 0.2)'
        }}>
          {/* <img src="/logo.png" alt="Logo" style={{ width: '50px', height: '50px' }} /> */}
          <h1>LOGO</h1>
        </div>

        <Title level={2} style={{ textAlign: "center", marginBottom: "32px", color: "white" }}>
          Login
        </Title>

        <Form layout="vertical">
            <Form.Item>
              <Input
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Email or Number"
                size="large"
                style={{ 
                  borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "white",
                  height: "50px",
                  padding: "0 20px",
                  boxShadow: "0 4px 15px rgba(255, 255, 255, 0.2)"
                }}
              />
            </Form.Item>

          <Form.Item>
            <Input.Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              size="large"
              style={{ 
                borderRadius: "12px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "white",
                height: "50px",
                padding: "0 20px",
                boxShadow: "0 4px 15px rgba(255, 255, 255, 0.2)"

              }}
            />
          </Form.Item>

          <div style={{ textAlign: 'right', marginBottom: '24px' }}>
            <Button type="link" style={{ color: 'white', padding: 0 }}>
              Forgot Password?
            </Button>
          </div>

          <Button
            type="primary"
            block
            onClick={handleLogin}
            loading={mutation.isPending}
            size="large"
            style={{ 
              height: "50px",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: 500,
              background: "white",
              color: "#0A2FB6",
              border: "none",
              boxShadow: "0 4px 15px rgba(255, 255, 255, 0.2)"
            }}
          >
            Sign in
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
