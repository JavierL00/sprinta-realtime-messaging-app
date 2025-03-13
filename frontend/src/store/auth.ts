import {create} from "zustand/react";
import {
	getContactsRequest,
	getMessagesRequest,
	getProfileRequest,
	refreshTokenRequest, sendMessageRequest,
	signInRequest,
	signUpRequest
} from "../api/auth";

interface AuthState {
	user: any | null;
	contacts: any[] | null;
	accessToken: string | null;
	refreshToken: string | null;
	error: string | null;
	loading: boolean;
	signIn: (email: string, password: string) => Promise<void>;
	signUp: (email: string, password: string, name: string) => Promise<void>;
	signOut: () => void;
	refreshTokens: () => Promise<{ accessToken: string; refreshToken: string }>;
	fetchUser: () => Promise<void>;
	fetchContacts: () => Promise<void>;
	fetchMessages: (contactId: string | null, page: number, limit: number) => Promise<any[]>;
	sendMessage: (receiverId: string, content: string) => Promise<any>;
}

const loadAuthState = (): Partial<AuthState> => {
	const storedAccessToken = localStorage.getItem("accessToken");
	const storedRefreshToken = localStorage.getItem("refreshToken");
	return {
		accessToken: storedAccessToken,
		refreshToken: storedRefreshToken,
	};
};

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	accessToken: null,
	refreshToken: null,
	error: null,
	loading: false,
	contacts: null,

	...loadAuthState(),

	signUp: async (email, password, name) => {
		set({loading: true, error: null});
		try {
			const response = await signUpRequest(email, password, name);
			set({
				user: response.user,
				accessToken: response.accessToken,
				refreshToken: response.refreshToken,
			});

			localStorage.setItem("accessToken", response.accessToken);
			localStorage.setItem("refreshToken", response.refreshToken);
		} catch (error) {
			const errorType = error as Error;
			set({error: errorType.message || "Error de registro"});
		} finally {
			set({loading: false});
		}
	},

	signIn: async (email, password) => {
		set({loading: true, error: null});
		try {
			const response = await signInRequest(email, password);
			set({
				user: response.user,
				accessToken: response.accessToken,
				refreshToken: response.refreshToken,
			});

			localStorage.setItem("accessToken", response.accessToken);
			localStorage.setItem("refreshToken", response.refreshToken);
		} catch (error) {
			const errorType = error as Error;
			set({error: errorType.message || "Credenciales inválidas"});
		} finally {
			set({loading: false});
		}
	},

	signOut: () => {
		set({user: null, accessToken: null, refreshToken: null});
		localStorage.removeItem("accessToken");
		localStorage.removeItem("refreshToken");
	},

	refreshTokens: async () => {
		try {
			const state: any = useAuthStore.getState();
			const response = await refreshTokenRequest(state.refreshToken!);

			set({
				accessToken: response.accessToken,
				refreshToken: response.refreshToken,
			});

			localStorage.setItem("accessToken", response.accessToken);
			localStorage.setItem("refreshToken", response.refreshToken);

			return {
				accessToken: response.accessToken,
				refreshToken: response.refreshToken,
			};
		} catch (error) {
			useAuthStore.getState().signOut();
			throw new Error("No se pudo renovar el token.");
		}
	},

	fetchUser: async () => {
		set({loading: true, error: null});
		const state = useAuthStore.getState();
		if (!state.accessToken) {
			set({loading: false});
			return;
		}

		try {
			const response = await getProfileRequest(state.accessToken);

			if (!response) {
				throw new Error("No se pudo obtener el usuario.");
			}

			set({user: response});
		} catch (error) {
			console.error("Error obteniendo usuario:", error);
			set({user: null});
		} finally {
			set({loading: false});
		}
	},

	fetchContacts: async () => {
		set({loading: true, error: null});
		const state = useAuthStore.getState();
		if (!state.accessToken) {
			set({loading: false});
			return;
		}

		try {
			const response = await getContactsRequest();

			console.log('fetching contacts', response);

			if (!response) {
				throw new Error("No se pudo obtener los contactos.");
			}

			set({contacts: response});
		} catch (error) {
			console.error("Error obteniendo contactos:", error);
			set({contacts: null});
		} finally {
			set({loading: false});
		}
	},

	fetchMessages: async (contactId: string | null, page: number, limit: number) => {
		set({loading: true, error: null});
		const state = useAuthStore.getState();
		if (!state.accessToken || !contactId) {
			set({loading: false});
			return [];
		}

		try {
			const response = await getMessagesRequest(contactId, page, limit);
			console.log('fetching messages', response);
			return response.messages ?? [];
		} catch (error) {
			console.error("Error obteniendo mensajes:", error);
			return [];
		} finally {
			set({loading: false});
		}
	},

	sendMessage: async (receiverId: string, content: string) => {
		set({ loading: true, error: null });

		const state = useAuthStore.getState();
		if (!state.accessToken || !receiverId) {
			set({loading: false});
			return;
		}

		try {
			const response = await sendMessageRequest(receiverId, content);
			return response.message;
		} catch (error) {
			console.error("Error enviando mensaje:", error);
			set({ error: "No se pudo enviar el mensaje." });
		} finally {
			set({ loading: false });
		}
	}
}));

(async () => {
	await useAuthStore.getState().fetchUser();
})();