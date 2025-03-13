import {ReactElement} from "react";
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import {AuthGuard} from "./auth/AuthGuard";
import SignIn from "./components/SignIn";
import Signup from "./components/Signup";
import Inbox from "./components/Inbox";

function App(): ReactElement {
	return (
	 <Router>
		 <AuthGuard>
			 <Routes>
				 <Route path="/" element={<SignIn/>}/>
				 <Route path="/signup" element={<Signup/>}/>
				 <Route path="/inbox" element={<Inbox/>}/>
				 <Route path="*" element={<Navigate to="/"/>}/>
			 </Routes>
		 </AuthGuard>
	 </Router>
	);
}

export default App;
