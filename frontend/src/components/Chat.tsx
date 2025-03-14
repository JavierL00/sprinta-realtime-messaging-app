import {ReactElement, useEffect, useRef, useState} from "react";
import Loading from "./Loading";
import {Message} from "../interface/message";
import {useAuthStore} from "../store/auth";
import {Contact} from "../interface/contact";

interface Props {
	selectedContact: Contact;
	setMessages: (messages: any) => void;
	messages: Message[];
}

export default function Chat({selectedContact, setMessages, messages}: Props): ReactElement {
	const chatContainerRef = useRef<HTMLDivElement>(null);
	const [message, setMessage] = useState("");
	const {messageLoading, sendingMessage, sendMessage} = useAuthStore();
	const messageRef = useRef<HTMLInputElement>(null);

	const handleSendMessage = async () => {
		const message = messageRef.current?.value.trim();
		if (!selectedContact.id || !message) return;
		const newMessage = await sendMessage(selectedContact.id, message);
		if (newMessage) {
			setMessages((prevMessages: any) => [...prevMessages, newMessage]);
		}
		setMessage("");
	};

	useEffect(() => {
		chatContainerRef.current?.scrollTo({
			top: chatContainerRef.current.scrollHeight,
			behavior: "smooth",
		});
	}, [messages]);

	if (messageLoading) return <Loading/>;

	return (
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
				<div ref={chatContainerRef}></div>
				{/* Chat box*/}

				<div className="p-4 border-t bg-white flex flex-wrap gap-2">
					<input
					 type="text"
					 ref={messageRef}
					 placeholder="Escribe un mensaje..."
					 className="flex-1 p-2 border rounded-md"
					 value={message}
					 onChange={(e) => setMessage(e.target.value)}
					/>
					<button
					 onClick={handleSendMessage}
					 disabled={sendingMessage}
					 className="px-4 py-2 bg-purple-500 text-white rounded-md"
					 aria-label="Enviar mensaje"
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
	);
}