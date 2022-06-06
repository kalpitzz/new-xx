import axios from "axios";
import jwt_decode from "jwt-decode";
import dayjs from "dayjs";
import useAuth from "./useAuth";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import ThemeAction from "../redux/actions/ThemeAction";

let actionAxios = null;

const useAxios = () => {
  const dispatch = useDispatch();

  const { auth, setAuth, logoutUser } = useAuth();

  async function RefreshToken() {
    let refreshResponse = await axios
      .post(`${process.env.REACT_APP_API_BASE_URL}/accounts/refresh_token/`, {
        IdToken: auth?.idToken,
        RefreshToken: auth?.refreshToken,
      })
      .catch((err) => logoutUser());
    localStorage.setItem("accessToken", refreshResponse.data.AccessToken);
    localStorage.setItem("idToken", refreshResponse.data.IdToken);

    setAuth({
      ...auth,
      accessToken: refreshResponse.data.AccessToken,
      idToken: refreshResponse.data.IdToken,
    });
    return refreshResponse.data.IdToken;
  }

  let axiosAPI = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
  });

  axiosAPI.interceptors.request.use(
    async (req) => {
      if (auth.refreshToken) {
        let user = jwt_decode(auth?.idToken);
        let isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

        if (!isExpired) {
          req.headers = { Authorization: "Bearer " + auth?.idToken };
          return req;
        }
        req.headers = { Authorization: "Bearer " + (await RefreshToken()) };
      }

      return req;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  axiosAPI.interceptors.response.use(
    function (response) {
      return JSON.parse(JSON.stringify(response.data));
    },
    (error) => {
      toast.error(error?.response?.data?.message);

      return Promise.reject(error);
    }
  );

  actionAxios = axiosAPI;
  return axiosAPI;
};

export { actionAxios };

export default useAxios;
