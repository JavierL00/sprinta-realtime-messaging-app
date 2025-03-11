import {ReactElement, ReactNode} from "react";
import {UserAuth} from "../context/AuthContext";
import {Navigate} from "react-router-dom";

export default function PrivateRoute({children}: { children: ReactNode }): ReactElement {
	const {session} = UserAuth();

	if (session === undefined) {
		return <p>Loading...</p>;
	}

	return <>{session ? <>{children}</> : <Navigate to={"/"}/>}</>;
}