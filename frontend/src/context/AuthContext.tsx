import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {supabase} from "../supabaseClient";

type AuthContextType = {
	session: any;
	signUpNewUser: (email: string, password: string) => Promise<{ success: boolean, data?: any, error?: string }>;
	signInUser: (email: string, password: string) => Promise<{ success: boolean, data?: any, error?: string }>;
	signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

type AuthContextProviderProps = {
	children: ReactNode;
}

export const AuthContextProvider = ({children}: AuthContextProviderProps) => {
	const [session, setSession] = useState<any | null>(null);

	// Sign up
	const signUpNewUser = async (email: string, password: string) => {
		const {data, error} = await supabase.auth.signUp({email, password});

		if (error) {
			console.error("There was a problem while sign up: " + error.message);
			return {success: false, error: error.message};
		}

		return {success: true, data};
	}

	// Sign in
	const signInUser = async (email: string, password: string) => {
		try {
			const {data, error} = await supabase.auth.signInWithPassword({email, password});
			if (error) {
				console.error("There was a problem while signing in: " + error.message);
				return {success: false, error: error.message};
			}
			return {success: true, data};
		} catch (error) {
			if (error instanceof Error) {
				console.error("There was a problem while signing in: " + error.message);
				return {success: false, error: error.message};
			}
		}

		return {success: false, error: "Unknown error"};
	}

	// Sign out
	const signOut = async () => {
		const {error} = await supabase.auth.signOut();
		if (error) {
			console.error("There was a problem while signing out: " + error.message);
		}
	}

	useEffect(() => {
		supabase.auth.getSession().then(({data: {session}}) => {
			setSession(session);
		})

		supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
		})
	}, []);

	return (
	 <AuthContext.Provider value={{session, signUpNewUser, signInUser, signOut}}>
		 {children}
	 </AuthContext.Provider>
	)
}

export const UserAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("UserAuth must be used within an AuthContextProvider");
	}
	return context;
}