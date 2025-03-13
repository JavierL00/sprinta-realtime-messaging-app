import {ReactElement, useState} from "react";
import {Link, useNavigate} from "react-router-dom";

export default function Signup(): ReactElement {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();

	const handleSignUp = async (e: any) => {
		e.preventDefault();
		setLoading(true);
		setError("");
		console.log(email, password)
		navigate("/register");
	}

	return (
	 <div>
		 <form onSubmit={handleSignUp} className={"max-w-md m-auto pt-24"}>
			 <h2 className={"font-bold pb-2"}>
				 Sign up today!
			 </h2>
			 <p>
				 Already have an account? <Link className={"text-purple-500"} to={"/"}>Sign in!</Link>
			 </p>
			 <div className={"flex flex-col py-4"}>
				 <input
					onChange={(e) => setEmail(e.target.value)}
					placeholder={"email"} type="email" className={"p-3 mt-6"}/>
				 <input
					onChange={(e) => setPassword(e.target.value)}
					placeholder={"password"} type="password" className={"p-3 mt-6"}/>
				 <button type={"submit"} disabled={loading} className={"mt-6 w-full"}>Sign Up</button>
				 {error && <p className={"text-red-500"}>{error}</p>}
			 </div>
		 </form>
	 </div>
	);
};
