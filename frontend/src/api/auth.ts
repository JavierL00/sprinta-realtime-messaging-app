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

export const getMessagesRequest = async (contactId: string, page: number, limit: number) => {
	try {
		const response = await axios.get(`/messages?contact_id=${contactId}&page=${page}&limit=${limit}`);
		return response.data;
	} catch (error) {
		const errorType = error as Error;
		return errorType.message;
	}
}

export const sendMessageRequest = async (receiverId: string, content: string, file?: File | null) => {
	const formData = new FormData();
	formData.append("receiver_id", receiverId);
	formData.append("content", content);
	if (file) {
		formData.append("file", file);
	}

	try {
		const response = await axios.post("/messages", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
		}});
		return response.data;
	} catch (error) {
		const errorType = error as Error;
		return errorType.message;
	}
}