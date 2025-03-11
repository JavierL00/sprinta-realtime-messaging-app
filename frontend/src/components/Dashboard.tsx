import {ReactElement} from "react";
import {UserAuth} from "../context/AuthContext";
import {useNavigate} from "react-router-dom";

export default function Dashboard(): ReactElement {
	const {session, signOut} = UserAuth();
	const navigate = useNavigate();

	const handleSignOut = async (e: any) => {
		e.preventDefault();
		try {
			await signOut();
			navigate("/");
		} catch (error) {
			const errorType = error as Error;
			console.error("Error signing out: ", errorType.message);
		}
	}

	return (
	 <div>
		 <h1>Dashboard</h1>
		 <h2>Welcome, {session?.user?.email}</h2>
		 <div>
			 <p onClick={handleSignOut} className={"hover:cursor-pointer border inline-block px-4 py-3 mt-4"}>
				 Sign Out
			 </p>
		 </div>
	 </div>
	);
}