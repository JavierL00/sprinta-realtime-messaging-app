import axios from "axios";
import {useAuthStore} from "../store/auth";

const baseURL =
 process.env.NODE_ENV === "production"
	? process.env.DOMAIN
	: "http://localhost:3005";

const authApi = axios.create({
	baseURL,
	withCredentials: true,
});

let isRefreshing = false;

authApi.interceptors.request.use(async (config) => {
	const state = useAuthStore.getState();
	let token = state.accessToken;

	if (!token) {
		return config;
	}

	config.headers.Authorization = `Bearer ${token}`;
	return config;
});

authApi.interceptors.response.use(
 (response) => response,
 async (error) => {
	 const state = useAuthStore.getState();
	 if (error.response?.status === 401 && state.refreshToken && !isRefreshing) {
		 isRefreshing = true;
		 try {
			 const newTokens = await state.refreshTokens();
			 error.config.headers.Authorization = `Bearer ${newTokens.accessToken}`;
			 isRefreshing = false;
			 return axios(error.config);
		 } catch (refreshError) {
			 state.signOut();
			 isRefreshing = false;
			 window.location.href = "/";
			 return Promise.reject(refreshError);
		 }
	 }
	 return Promise.reject(error);
 }
);

export default authApi;
