import {ReactElement, useEffect, useState} from "react";
import {useAuthStore} from "../store/auth";

interface Props {
	contactId: string | null;
}

export default function Chat({contactId}: Props): ReactElement {
	const fetchMessages = useAuthStore((state) => state.fetchMessages);
	// const sendMessage = useAuthStore((state) => state.sendMessage);
	const [messages, setMessages] = useState<any[]>([]);
	const [page, setPage] = useState(1);
	const [message, setMessage] = useState("");

	useEffect(() => {
		const loadMessages = async () => {
			if (!contactId) return;
			const newMessages = await fetchMessages(contactId, page, 10);
			setMessages(newMessages);
		};

		setMessages([]);
		if (contactId) loadMessages();
	}, [contactId, page]);

	return (
	 <div className="flex-1 flex flex-col">
		 {contactId ? (
			<>
				<div className="p-4 border-b bg-gray-200">
					<h2 className="text-xl font-bold">{contactId}</h2>
				</div>
				<div className="flex-1 overflow-y-auto p-4 space-y-3">
					{messages.map((msg, index) => (
					 <div
						key={index}
						className={`p-3 rounded-lg max-w-xs ${
						 msg.sender === contactId
							? "bg-purple-500 text-white self-end text-left"
							: "bg-gray-300 text-right"
						}`}
					 >
						 {msg.content}
					 </div>
					))}
				</div>
				<button className="mt-4 p-2 bg-gray-300" onClick={() => setPage(page + 1)}>Cargar más</button>
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