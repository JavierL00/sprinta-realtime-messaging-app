import {createBrowserRouter} from "react-router-dom";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import Dashboard from "./components/Dashboard";
import ErrorBoundary from "./components/ErrorBoundary";
import PrivateRoute from "./components/PrivateRoute";

export const router = createBrowserRouter([
	{path: "/", element: <Signin/>, errorElement: <ErrorBoundary/>},
	{path: "/signup", element: <Signup/>, errorElement: <ErrorBoundary/>},
	{
		path: "/dashboard", element: (
		 <PrivateRoute>
			 <Dashboard/>
		 </PrivateRoute>
		), errorElement: <ErrorBoundary/>
	},
]);
