import {ReactElement, useEffect, useState} from "react";
import {useAuthStore} from "../store/auth";
import {Contact} from "../interface/contact";

interface Props {
	contact: Contact | null;
}

export default function Chat({contact}: Props): ReactElement {
	const {fetchMessages, sendMessage} = useAuthStore();
	const [messages, setMessages] = useState<any[]>([]);
	const [page, setPage] = useState(1);
	const [message, setMessage] = useState("");


	const handleSendMessage = async () => {
		if (!contact || (!message)) return;
		const newMessage = await sendMessage(contact?.id, message);
		if (newMessage) {
			setMessages((prevMessages) => [...prevMessages, newMessage]);
		}
		setMessage("");
	};

	return (
	 <div className="flex-1 flex flex-col">
		 {contact ? (
			<>
				<div className="p-4 border-b bg-gray-200">
					<h2 className="text-xl font-bold">{contact?.name}</h2>
				</div>
				<div className="flex-1 overflow-y-auto p-4 space-y-3">
					{messages.map((msg, index) => (
					 <div
						key={index}
						className={`p-3 rounded-lg max-w-xs ${
						 msg.sender === contact
							? "bg-purple-500 text-white self-end text-left"
							: "bg-gray-300 text-right"
						}`}
					 >
						 {msg.content}
					 </div>
					))}
				</div>
				{messages.length > 0 && (
				 <button
					className="mt-4 p-2 bg-gray-300"
					onClick={() => setPage((prev) => prev + 1)}
				 >
					 Cargar más
				 </button>
				)}
				<div className="p-4 border-t bg-white flex flex-wrap gap-2">
					<input
					 type="text"
					 placeholder="Escribe un mensaje..."
					 className="flex-1 p-2 border rounded-md"
					 value={message}
					 onChange={(e) => setMessage(e.target.value)}
					/>
					<input
					 type="file"
					 className="border rounded-md text-sm p-2 w-[250px] text-stone-500 file:mr-5 file:py-1 file:px-3 file:text-xs file:font-medium file:border file:rounded-md file:bg-stone-50 file:text-stone-700 hover:file:cursor-pointer hover:file:bg-blue-50 hover:file:text-blue-700"
					/>
					<button
					 onClick={handleSendMessage}
					 className="px-4 py-2 bg-purple-500 text-white rounded-md"
					>
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