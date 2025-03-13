import {ReactElement} from "react";
import {useAuthStore} from "../store/auth";
import {useNavigate} from "react-router-dom";

export default function Dashboard(): ReactElement {
	const {loading, user, signOut} = useAuthStore();
	const navigate = useNavigate();

	const handleSignOut = async (e: any) => {
		e.preventDefault();
		signOut();
		navigate("/");
	}

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
	 <div>
		 <h1>Dashboard</h1>
		 <h2>Welcome, {user?.name}</h2>
		 <div>
			 <p onClick={handleSignOut} className={"hover:cursor-pointer border inline-block px-4 py-3 mt-4"}>
				 Sign Out
			 </p>
		 </div>
	 </div>
	);
}