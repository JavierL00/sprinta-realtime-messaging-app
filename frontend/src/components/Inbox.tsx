import {useEffect, useRef, useState} from "react";
import {useAuthStore} from "../store/auth";
import Loading from "./Loading";
import {Contact} from "../interface/contact";
import {Message} from "../interface/message";
import {defaultContact} from "../data/contacts";
import Contacts from "./Contacts";

export default function Inbox() {
	const [selectedContact, setSelectedContact] = useState<Contact>(defaultContact);
	const [messages, setMessages] = useState<Message[]>([]);
	const [page, setPage] = useState(1);
	const [message, setMessage] = useState("");
	const downPageRef = useRef(document.createElement("div"))

	const {loading, messageLoading, sendingMessage, contacts, fetchContacts, fetchMessages, sendMessage} = useAuthStore();

	const handleFetchMessages = async (contact: Contact) => {
		const newMessages = await fetchMessages(contact.id, page, 10);
		setMessages(newMessages);
	}

	const handleSelectContact = async (contact: Contact) => {
		setSelectedContact(contact);
		await handleFetchMessages(contact);
	}

	const handleSendMessage = async () => {
		if (selectedContact.id || (!message)) return;
		const newMessage = await sendMessage(selectedContact.id, message);
		if (newMessage) {
			setMessages((prevMessages) => [...prevMessages, newMessage]);
		}
		setMessage("");

		downPageRef.current.scrollIntoView({behavior: "smooth"});
	};

	useEffect(() => {
		fetchContacts();
	}, [fetchContacts]);

	if (loading) {
		return <Loading/>;
	}

	return (
	 <div className="border h-svh p-8">
		 <div className="border w-full h-full">
			 <div className="flex h-full overflow-hidden">

				 {/* Contacts */}
				 <Contacts handleSelectContact={handleSelectContact} selectedContact={selectedContact}/>
				 {/* Contacts */}

				 {/* Chat */}
				 {messageLoading ? <Loading/> : (
					<div className="flex-1 flex flex-col">
						{selectedContact ? (
						 <>
							 <div className="p-4 border-b bg-gray-200">
								 <h2 className="text-xl font-bold">{selectedContact?.name}</h2>
							 </div>

							 {/* Chat box*/}
							 <div className="flex-1 overflow-y-auto p-4 space-y-3">
								 {messages.map((msg: Message) => (
									<div
									 key={msg.id}
									 className={`flex w-full ${
										msg.receiver_id === selectedContact?.id
										 ? "justify-end"
										 : "justify-start"
									 }`}
									>
										<div className={`p-3 rounded-lg w-fit ${
										 msg.receiver_id === selectedContact?.id
											? "bg-gray-300"
											: "bg-purple-500 text-white"
										}`}>
											{msg.content}
										</div>
									</div>
								 ))}
							 </div>
							 <div ref={downPageRef}></div>
							 {/* Chat box*/}

							 <div className="p-4 border-t bg-white flex flex-wrap gap-2">
								 <input
									type="text"
									placeholder="Escribe un mensaje..."
									className="flex-1 p-2 border rounded-md"
									value={message}
									onChange={(e) => setMessage(e.target.value)}
								 />
								 <button
									onClick={handleSendMessage}
									disabled={sendingMessage}
									className="px-4 py-2 bg-purple-500 text-white rounded-md"
								 >
									 {sendingMessage ? "Enviando..." : "Enviar"}
								 </button>
							 </div>
						 </>
						) : (
						 <div className="flex items-center justify-center flex-1">
							 <p className="text-gray-500">Selecciona un contacto para chatear</p>
						 </div>
						)}
					</div>
				 )}
				 {/* Chat */}
			 </div>
		 </div>
	 </div>
	);
}
