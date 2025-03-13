import {useEffect, useState} from "react";
import {useAuthStore} from "../store/auth";
import Loading from "./Loading";
import {Contact} from "../interface/contact";
import {Message} from "../interface/message";

export default function Inbox() {
	const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);
	const [page, setPage] = useState(1);
	const [message, setMessage] = useState("");

	const {loading, user, contacts, fetchContacts, fetchMessages, sendMessage} = useAuthStore();

	const handleSendMessage = async () => {
		if (!selectedContact || (!message)) return;
		const newMessage = await sendMessage(selectedContact?.id, message);
		if (newMessage) {
			setMessages((prevMessages) => [...prevMessages, newMessage]);
		}
		setMessage("");
	};

	useEffect(() => {
		if (contacts === null) {
			fetchContacts();
		}
	}, [contacts, fetchContacts]);

	if (loading) {
		return <Loading/>;
	}

	return (
	 <div className="border h-svh p-8">
		 <div className="border w-full h-full">
			 <div className="flex h-full overflow-hidden">

				 {/* Contacts */}
				 <div className="w-1/4 min-w-[150px] border-r bg-gray-100 p-4">
					 <h2 className="text-xl font-bold pb-2 pl-1.5">Bienvenido, {user?.name}!</h2>
					 <input
						type="text"
						placeholder="Buscar..."
						className="w-full mt-2 p-2 border rounded-md"
					 />
					 <ul className="mt-4 space-y-2">
						 {contacts?.map((contact: Contact) => (
							<li
							 key={contact.id}
							 onClick={() => setSelectedContact(contact)}
							 className={`p-3 rounded-lg cursor-pointer ${
								selectedContact?.id === contact.id
								 ? "bg-purple-500 text-white"
								 : "hover:bg-gray-200"
							 }`}
							>
								{contact.name}
							</li>
						 ))}
					 </ul>
				 </div>
				 {/* Contacts */}

				 {/* Chat */}
				 <div className="flex-1 flex flex-col">
					 {selectedContact ? (
						<>
							<div className="p-4 border-b bg-gray-200">
								<h2 className="text-xl font-bold">{selectedContact?.name}</h2>
							</div>
							<div className="flex-1 overflow-y-auto p-4 space-y-3">
								{messages.map((msg: Message) => (
								 <div
									key={msg.id}
									className={`p-3 rounded-lg max-w-xs ${
									 msg.sender_id === selectedContact?.id
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
				 {/* Chat */}
			 </div>
		 </div>
	 </div>
	);
}
