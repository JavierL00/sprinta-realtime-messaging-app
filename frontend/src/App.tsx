import {ReactElement} from "react";
import {AuthContextProvider} from "./context/AuthContext";
import {RouterProvider} from "react-router-dom";
import {router} from "./router";

function App(): ReactElement {
	return (
	 <AuthContextProvider>
		 <RouterProvider router={router}/>
	 </AuthContextProvider>
	);
}

export default App;
