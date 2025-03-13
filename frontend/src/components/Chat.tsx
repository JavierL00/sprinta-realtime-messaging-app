import {ReactElement} from "react";

interface Props {
	selectedContact: string | null;
}

export default function Chat({selectedContact}: Props): ReactElement {
	const messages = [
		{sender: "Juan Pérez", text: "Hola, ¿cómo estás?"},
		{sender: "Tú", text: "¡Todo bien! ¿Y tú?"},
	];

	return (
	 <div className="flex-1 flex flex-col">
		 {selectedContact ? (
			<>
				<div className="p-4 border-b bg-gray-200">
					<h2 className="text-xl font-bold">{selectedContact}</h2>
				</div>
				<div className="flex-1 overflow-y-auto p-4 space-y-3">
					{messages.map((msg, index) => (
					 <div
						key={index}
						className={`p-3 rounded-lg max-w-xs ${
						 msg.sender === "Tú"
							? "bg-purple-500 text-white self-end"
							: "bg-gray-300"
						}`}
					 >
						 {msg.text}
					 </div>
					))}
				</div>
				<div className="p-4 border-t bg-white flex">
					<input
					 type="text"
					 placeholder="Escribe un mensaje..."
					 className="flex-1 p-2 border rounded-md"
					/>
					<button className="ml-2 px-4 py-2 bg-purple-500 text-white rounded-md">
						Enviar
					</button>
				</div>
			</>
		 ) : (
			<div className="flex items-center justify-center flex-1">
				<p className="text-gray-500">Selecciona un contacto para chatear</p>
			</div>
		 )}
	 </div>
	);
}