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
			 <div style={{
				 backgroundImage: `radial-gradient(#9b4fad 2px, transparent 1px), radial-gradient(#9b4fad 1px, transparent 1px)`,
				 backgroundSize: `32px 32px`,
				 backgroundPosition: `0 0, 16px 16px`,
				 backgroundColor: `#f9f9f9`,
			 }}>
				 <Routes>
					 <Route path="/" element={<SignIn/>}/>
					 <Route path="/signup" element={<Signup/>}/>
					 <Route path="/inbox" element={<Inbox/>}/>
					 <Route path="*" element={<Navigate to="/"/>}/>
				 </Routes>
			 </div>
		 </AuthGuard>
	 </Router>
	);
}

export default App;
