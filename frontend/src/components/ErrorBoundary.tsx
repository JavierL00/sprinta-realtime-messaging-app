import {useRouteError, isRouteErrorResponse} from "react-router-dom";

export default function ErrorBoundary() {
	const error = useRouteError();

	return (
	 <div style={{textAlign: "center", marginTop: "50px"}}>
		 <h1>¡Ups! Algo salió mal</h1>
		 {isRouteErrorResponse(error) ? (
			<p>{error.status} - {error.statusText}</p>
		 ) : (
			<p>Ocurrió un error inesperado.</p>
		 )}
		 <a href="/">Volver al inicio</a>
	 </div>
	);
};
