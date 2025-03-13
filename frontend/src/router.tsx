import {createBrowserRouter} from "react-router-dom";
import Signup from "./components/Signup";
import SignIn from "./components/SignIn";
import Dashboard from "./components/Dashboard";
import ErrorBoundary from "./components/ErrorBoundary";

export const router = createBrowserRouter([
	{path: "/", element: <SignIn/>, errorElement: <ErrorBoundary/>},
	{path: "/signup", element: <Signup/>, errorElement: <ErrorBoundary/>},
	{path: "/dashboard", element: <Dashboard/>, errorElement: <ErrorBoundary/>},
]);
