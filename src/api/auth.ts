import axios from "axios";

interface LoginData {
  identifier: string;
  password: string;
}

export const loginUser = async ({ identifier, password }: LoginData) => {
  const response = await axios.post("http://10.10.1.231:12545/auth/login", {
    login: identifier, 
    password,
  });
   console.log(response);
   
  return {
  
    role: "admin", 
    accessToken: response.data.data.accessToken,
    refreshToken: response.data.data.refreshToken,
  };
};
