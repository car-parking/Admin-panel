import axios from "axios";

interface LoginData {
  identifier: string;
  password: string;
}

export const loginUser = async ({ identifier, password }: LoginData) => {
  // Fake API uchun
  const response = await axios.post("https://dummyjson.com/auth/login", {
    username: identifier, // Fake API da "username" deb ataladi
    password,
  });

  return {
    name: response.data.firstName + " " + response.data.lastName,
    email: response.data.email,
    role: "admin", // Fake API dan kelmaydi, shunchaki qo‘shib qo‘ydik
    token: response.data.token,
  };
};
