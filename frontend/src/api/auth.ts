import axios from "../lib/axios";

export const signInRequest = async (email: string, password: string) => {
	try {
		const response = await axios.post("/auth/signin", {
			email,
			password,
		});
		return response.data;
	} catch (error) {
		const errorType = error as Error;
		return errorType.message;
	}
}

export const signUpRequest = async (email: string, password: string, name: string) => {
	try {
		const response = await axios.post("/auth/signup", {
			email,
			password,
			name,
		});
		return response.data;
	} catch (error) {
		const errorType = error as Error;
		return errorType.message;
	}
}

export const refreshTokenRequest = async (refreshToken: string) => {
	try {
		const response = await axios.post("/auth/refresh", {
			refreshToken,
		});
		return response.data;
	} catch (error) {
		const errorType = error as Error;
		return errorType.message;
	}
}

export const getProfileRequest = async (token: string) => {
	try {
		const response = await axios.post("/auth/profile", {
			token,
		})
		return response.data;
	} catch (error) {
		const errorType = error as Error;
		return errorType.message;
	}
}

export const getContactsRequest = async () => {
	try {
		const response = await axios.get("/contacts")
		return response.data;
	} catch (error) {
		const errorType = error as Error;
		return errorType.message;
	}
}