import {ReactElement, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useAuthStore} from "../store/auth";

export function AuthGuard({children}: { children: ReactElement }) {
	const navigate = useNavigate();
	const location = useLocation();
	const {accessToken, refreshToken} = useAuthStore();

	useEffect(() => {
		const isAuth = accessToken && refreshToken;
		const isSignupPage = location.pathname === "/signup";
		const isHomePage = location.pathname === "/";

		if (!isAuth && !isHomePage && !isSignupPage) {
			navigate("/");
		}

		if (isAuth && isHomePage) {
			navigate("/dashboard");
		}

		if (isAuth && isSignupPage) {
			navigate("/dashboard");
		}
	}, [accessToken, refreshToken, location, navigate]);

	return children;
}
