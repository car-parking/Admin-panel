import { useAxios } from "../hook/useAxsios";

interface LoginData {
  identifier: string;
  password: string;
}

export const loginUser = async ({ identifier, password }: LoginData) => {
  const axios = useAxios();
  const response = await axios({
    url: "/auth/login",
    method: "POST",
    body: {
      login: identifier,
      password,
    }
  });
 localStorage.setItem("token", response.data.accessToken);
 localStorage.setItem("refreshToken", response.data.refreshToken);
console.log(response);

  return {
    role: "admin",
    accessToken: response.data.accessToken,
    refreshToken: response.data.refreshToken,
  };
};
