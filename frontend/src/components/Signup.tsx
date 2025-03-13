import {ReactElement, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useAuthStore} from "../store/auth";

export default function Signup(): ReactElement {
	const [email, setEmail] = useState("");
	const [name, setName] = useState("");
	const [password, setPassword] = useState("");

	const {signUp, error, loading} = useAuthStore();
	const navigate = useNavigate();

	const handleSignUp = async (e: any) => {
		e.preventDefault();
		await signUp(email, password, name);

		const {accessToken} = useAuthStore.getState();
		if (accessToken) {
			navigate("/dashboard");
		}
	}

	return (
	 <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
		 <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
			 <h2 className="mb-2 text-center text-2xl font-bold text-gray-800">Sign up today!</h2>
			 <p className="text-center text-gray-600">
				 Already have an account?{" "}
				 <Link to="/" className="font-medium text-purple-600 hover:underline">
					 Sign in!
				 </Link>
			 </p>
			 <form onSubmit={handleSignUp} className="mt-6 space-y-4">
				 <div>
					 <input
						type="email"
						placeholder="Email"
						onChange={(e) => setEmail(e.target.value)}
						className="w-full rounded-lg border border-gray-300 p-3 text-gray-800 focus:border-purple-500 focus:ring focus:ring-purple-300"
						required
					 />
				 </div>

				 <div>
					 <input
						type="text"
						placeholder="Name"
						onChange={(e) => setName(e.target.value)}
						className="w-full rounded-lg border border-gray-300 p-3 text-gray-800 focus:border-purple-500 focus:ring focus:ring-purple-300"
						required
					 />
				 </div>

				 <div>
					 <input
						type="password"
						placeholder="Password"
						onChange={(e) => setPassword(e.target.value)}
						className="w-full rounded-lg border border-gray-300 p-3 text-gray-800 focus:border-purple-500 focus:ring focus:ring-purple-300"
						required
					 />
				 </div>

				 <button
					type="submit"
					disabled={loading}
					className="w-full rounded-lg bg-purple-600 p-3 text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-purple-400"
				 >
					 {loading ? "Signing up..." : "Sign Up"}
				 </button>

				 {error && <p className="mt-2 text-center text-sm text-red-500">{error}</p>}
			 </form>
		 </div>
	 </div>
	);
};
