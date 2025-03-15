import {ReactElement, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useAuthStore} from "../store/auth";

export function AuthGuard({children}: { children: ReactElement }) {
	const navigate = useNavigate();
	const location = useLocation();
	const {accessToken, refreshToken, signOut} = useAuthStore();

	useEffect(() => {
		const isAuth = accessToken && refreshToken;
		const isSignupPage = location.pathname === "/signup";
		const isHomePage = location.pathname === "/";

		if (accessToken === 'undefined' && refreshToken === 'undefined') {
			signOut();
		}

		if (!isAuth && !isHomePage && !isSignupPage) {
			navigate("/");
		}

		if (isAuth && isHomePage) {
			navigate("/inbox");
		}

		if (isAuth && isSignupPage) {
			navigate("/inbox");
		}
	}, [accessToken, refreshToken, location, navigate, signOut]);

	return children;
}
