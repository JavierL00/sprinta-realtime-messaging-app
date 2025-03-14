import {create} from "zustand/react";
import {
	getContactsRequest,
	getMessagesRequest,
	getProfileRequest,
	getUserById,
	refreshTokenRequest,
	sendMessageRequest,
	signInRequest,
	signUpRequest
} from "../api/auth";
import {defaultContacts} from "../data/contacts";
import {ContactType} from "../interface/contactType";

interface AuthState {
	user: any | null;
	contacts: ContactType[];
	accessToken: string | null;
	refreshToken: string | null;
	error: string | null;
	loading: boolean;
	messageLoading: boolean;
	sendingMessage: boolean;
	signIn: (email: string, password: string) => Promise<void>;
	signUp: (email: string, password: string, name: string) => Promise<void>;
	signOut: () => void;
	refreshTokens: () => Promise<{ accessToken: string; refreshToken: string }>;
	fetchUser: () => Promise<void>;
	fetchContacts: () => Promise<void>;
	fetchMessages: (contactId: string | null, page: number, limit: number) => Promise<any[]>;
	sendMessage: (receiverId: string, content: string) => Promise<any>;
	getUserById: (userId: string) => Promise<any>;
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
	contacts: defaultContacts,
	messageLoading: false,
	sendingMessage: false,

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
		localStorage.clear();
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

			if (!response) {
				throw new Error("No se pudo obtener los contactos.");
			}

			set({contacts: response});
		} catch (error) {
			console.error("Error obteniendo contactos:", error);
			set({contacts: defaultContacts});
		} finally {
			set({loading: false});
		}
	},

	fetchMessages: async (contactId: string | null, page: number, limit: number) => {
		set({messageLoading: true, error: null});
		const state = useAuthStore.getState();
		if (!state.accessToken || !contactId) {
			set({messageLoading: false});
			return [];
		}

		try {
			const response = await getMessagesRequest(contactId, page, limit);
			return response.messages ?? [];
		} catch (error) {
			console.error("Error obteniendo mensajes:", error);
			return [];
		} finally {
			set({messageLoading: false});
		}
	},

	sendMessage: async (receiverId: string, content: string) => {
		set({sendingMessage: true, error: null});

		const state = useAuthStore.getState();
		if (!state.accessToken || !receiverId) {
			set({sendingMessage: false});
			return;
		}

		try {
			const response = await sendMessageRequest(receiverId, content);
			return response.message;
		} catch (error) {
			console.error("Error enviando mensaje:", error);
			set({error: "No se pudo enviar el mensaje."});
		} finally {
			set({sendingMessage: false});
		}
	},

	getUserById: async (userId: string) => {
		try {
			return await getUserById(userId);
		} catch (error) {
			const errorType = error as Error;
			return errorType.message;
		}
	}
}));

(async () => {
	await useAuthStore.getState().fetchUser();
})();